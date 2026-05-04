// api/clarify.js
// Two modes:
//   mode='triage'        → operator_text/images only → returns { reply: "<short text>" }
//   mode='diagnose_prep' → subsystem already chosen → returns { filesNeeded, priorCaseFound, priorCaseSummary }

import Anthropic from '@anthropic-ai/sdk';
import { getObjectText, putObject } from './_storage.js';

export const config = { maxDuration: 30 };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SUBSYSTEMS = `01 AUF Pallet loading | 02 FBZ Pallet conveyor | 03 ROB Fanuc S-420 robot | 04 WMK Wiremesh conveyor | 05 DRE Rotary table | 06 SNG Singulator | 07 DRU Videojet 1880+ printer | 08 DNW BMH can inverter | 09 LBL Langguth labeler + Nordson 3100 (#2 fault) | 10 AGG Aggregator | 11 TRP ZVT tray packer + Nordson ProBlue 7 (#1 fault) | 12 FOL ZVT film wrapper (#3 fault) | 13 STU ZVT shrink tunnel (LOTO) | 14 TBE Eidos Printess 4e tray labeler | 15 SEL Screw elevator | 16 ZUO Allocation station | 17 PAL3 Palletizer 3 | 18 EX3 Exit 3 | 19 PAL2 Palletizer 2 | 20 EX2 Exit 2`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try { body = JSON.parse(await readBody(req)); }
  catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

  const mode = body.mode || 'diagnose_prep';
  const lang = body.language === 'EN' ? 'EN' : 'DE';

  try {
    if (mode === 'triage') return await triage(body, lang, res);
    return await diagnosePrep(body, lang, res);
  } catch (err) {
    console.error('clarify.js error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function triage(body, lang, res) {
  const { operator_text = '', images = [], error_id: errorId = null } = body;
  if (!operator_text && images.length === 0) {
    return res.status(400).json({ error: 'operator_text or images required' });
  }

  // Fire-and-forget: persist triage photos to Hetzner under photos/<errorId>/triage-NN.<ext>.
  // Does NOT block the Claude call; failures are logged but don't fail the response.
  if (errorId && images.length > 0) {
    images.forEach((img, idx) => {
      try {
        const ext = (img.mime || 'image/jpeg').split('/')[1] || 'jpg';
        const key = `photos/${errorId}/triage-${String(idx+1).padStart(2,'0')}.${ext}`;
        putObject(key, Buffer.from(img.b64, 'base64'), img.mime || 'image/jpeg')
          .catch(e => console.warn('triage photo save failed', key, e.message));
      } catch (e) { console.warn('triage photo prep failed', e.message); }
    });
  }

  const sys = lang === 'DE'
    ? `Sie sind der Triage-Helfer für Verpackungslinie VL2 bei Dr. Alder. 20 Subsysteme:
${SUBSYSTEMS}

WICHTIG zu Fotos: Wenn der Bediener ein Foto angehängt hat, ist DAS FOTO die primäre Evidenz. Bediener beschreiben Fehler oft ungenau (falsches Subsystem, ungenaue Begriffe, fehlender Kontext). Vertrauen Sie dem, was Sie tatsächlich SEHEN, mehr als der Beschreibung. Wenn Foto und Text widersprechen, folgen Sie dem Foto und weisen Sie kurz auf die Diskrepanz hin.

Aufgabe: Lesen Sie Foto (falls vorhanden) UND Bedienermeldung. Antworten Sie KURZ und KLAR, max. 3 Sätze:
1. Wahrscheinlichstes Subsystem mit Tag (z.B. „VL2.11 TRP – Tray-Packer").
2. Ein Satz, warum — mit Bezug auf konkretes visuelles Detail wenn Foto vorhanden.
3. Wenn unsicher: EINE gezielte Rückfrage statt Vermutung.

Keine Aufzählungen, keine Überschriften, kein Markdown. Nur Fließtext.`
    : `You are the triage helper for packaging line VL2 at Dr. Alder. 20 subsystems:
${SUBSYSTEMS}

IMPORTANT about photos: If the operator attached a photo, THE PHOTO is primary evidence. Operators often describe faults inaccurately (wrong subsystem, imprecise terms, missing context). Trust what you actually SEE more than the description. If photo and text disagree, follow the photo and briefly note the discrepancy.

Task: Read photo (if any) AND operator report. Reply SHORT and CLEAR, max 3 sentences:
1. Most likely subsystem with tag (e.g. "VL2.11 TRP – Tray Packer").
2. One sentence why — referencing a concrete visual detail if a photo is present.
3. If unsure: ONE specific clarifying question instead of guessing.

No bullet lists, no headings, no markdown. Plain prose only.`;

  const content = [];
  images.forEach(img => content.push({
    type: 'image',
    source: { type: 'base64', media_type: img.mime || 'image/jpeg', data: img.b64 }
  }));
  content.push({ type: 'text', text: operator_text || '(photo only — no text)' });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 250,
    system: sys,
    messages: [{ role: 'user', content }]
  });

  const reply = response.content.map(b => b.text || '').join('').trim();
  return res.status(200).json({ reply });
}

async function diagnosePrep(body, lang, res) {
  const subsystem = body.subsystem;
  if (!subsystem) return res.status(400).json({ error: 'subsystem required' });

  const ssNum = String(subsystem).replace(/^VL2\./, '').padStart(2, '0');

  const [indexMd, stoerMd] = await Promise.all([
    getObjectText('INDEX.md'),
    getObjectText(`subsystems/STOERUNGEN_TS${ssNum}.md`).catch(() => '')
  ]);

  const sys = `You are the steering intelligence for the VL2 diagnostic agent at Dr. Alder.

Decide which 0-2 lean knowledge files would help diagnose THIS specific fault. Respond ONLY with valid JSON:
{ "filesNeeded": ["..."], "priorCaseFound": true|false, "priorCaseSummary": "one sentence or empty" }

Rules:
- ONLY request paths ending in _kb.md or _alarms.md (lean summaries; safe for live diagnosis).
- NEVER request manuals/raw/ (full PDFs — too expensive) or diagrams/ (load offline only).
- Hard cap: max 2 files. Empty array OK if STOERUNGEN log alone is enough.
- priorCaseSummary: one sentence max, empty if none.
- No prose outside the JSON.`;

  const userText = `SUBSYSTEM: VL2.${ssNum}
LINE STATE: ${body.line_state || 'unknown'}
SYMPTOMS: ${(body.symptoms || []).join('; ') || '(none selected)'}
OPERATOR NOTES: ${body.operator_notes || body.problemDescription || '(none)'}

---
INDEX.md:
${indexMd || '[INDEX not yet populated]'}

---
STOERUNGEN_TS${ssNum}.md:
${stoerMd || '[No fault history]'}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    system: sys,
    messages: [{ role: 'user', content: userText }]
  });

  const raw = response.content.map(b => b.text || '').join('');
  const clean = raw.replace(/```json|```/g, '').trim();
  let parsed;
  try { parsed = JSON.parse(clean); }
  catch { parsed = { filesNeeded: [], priorCaseFound: false, priorCaseSummary: '' }; }
  return res.status(200).json(parsed);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
