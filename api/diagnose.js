// api/diagnose.js
// Phase B4: Second Claude call — receives original request + loaded detail files.
// Handles both initial diagnosis AND follow-up turns (conversationHistory).
// POST /api/diagnose
// Body JSON: { subsystem, problemDescription, labelNumber, photos (base64[]),
//              filesNeeded (from clarify), priorCaseSummary, conversationHistory,
//              language ('EN'|'DE') }

import Anthropic from '@anthropic-ai/sdk';
import { getObjectText, getObjectBase64 } from './_storage.js';

export const config = { maxDuration: 60 };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_INITIAL = {
  EN: `You are the Technical Agent (TA) for packaging line VL2 at Dr. Alder Tiernahrung GmbH.

You support mechanical and electrical technicians in diagnosing faults. You are not a replacement for the technician — you are the structured memory of the plant that asks the right questions, provides the most likely causes, and searches through wiring diagrams and control software.

LINE VL2 — 20 SUBSYSTEMS:

GROUP A — Pallet Infeed:
01 AUF   Pallet loading station
02 FBZ   Pallet feed conveyor
03 ROB   Unloading robot — Fanuc S-420 i W (vacuum layer gripper, ~200 cans)
04 WMK   Wiremesh conveyor (post-robot handoff)

GROUP B — Singulation:
05 DRE   Rotary table (bulk → directional)
06 SNG   Singulator (disk + air jets, exit chute passes UNDER DRU printer)

GROUP C — Single-File Processing:
07 DRU   Printer — Videojet 1880+ (LEASED — contact Videojet service before internal intervention)
08 DNW   Can inverter — BMH Bahn W2001 (SINGLE flip, internal path NOT visible)
09 LBL   Rotary labeler — Langguth hotLAN + Nordson 3100 glue (#2 most frequent fault)

GROUP D — ZVI Integrated Machine (sections 10-13 share Vintek HMI + control):
10 AGG   Aggregator (3-column accumulator, releases 6-can grid to TRP)
11 TRP   Tray packer — ZVI N1/012/PAC/001 + Nordson ProBlue 7 (#1 MOST FREQUENT FAULT ON LINE)
12 FOL   Film wrapper — ZVI integrated (#3 most frequent fault)
13 STU   Shrink tunnel — ZVI integrated (HIGH VOLTAGE + HOT SURFACE — LOTO MANDATORY)

GROUP E — Tray Output:
14 TBE   Tray labeler + cooling riser — Eidos Printess 4e (⚠ WAX ribbon currently loaded — RESIN required for shrink film)
15 SEL   Screw elevator (vertical spiral, TBE level → palletizer level)
16 ZUO   Allocation station (only subsystem with two parallel downstream subsystems — feeds both PAL3 and PAL2)

GROUP F — Palletizing (Parallel):
17 PAL3  Palletizer 3 — Custom + Siemens HMI (NOT identical to PAL2)
18 EX3   Exit 3 — full pallet exit conveyor for PAL3, forklift handoff
19 PAL2  Palletizer 2 — Custom + Siemens HMI (NOT identical to PAL3)
20 EX2   Exit 2 — full pallet exit conveyor for PAL2, forklift handoff

TAG SYSTEM: VL2.[SS].[TYPE].[NNN] — e.g. VL2.11.M.001 = subsystem 11 (TRP), motor 001

WHAT YOU MUST NOT DO:
- Never authorize live work under voltage
- Never decide on shutdown or continued operation
- Never intervene in PLC or control systems
- Never overwrite knowledge base entries — only append
- Never document a repair without operator confirmation

Structure your initial response EXACTLY:
SEVERITY: [HIGH / MEDIUM / LOW]
ROOT CAUSE ASSESSMENT: (2-3 sentences specific to this machine and tag)
IMMEDIATE ACTIONS: (numbered list, specific to components)
INSPECT THESE COMPONENTS: (use VL2.XX.TYPE.NNN tags where known)
UPSTREAM / DOWNSTREAM IMPACT: (cascade effects on other subsystems)
DO NOT RESTART UNTIL: (specific condition)
ESCALATE IF: (condition requiring OEM or senior tech)`,

  DE: `Sie sind der Technische Agent (TA) für die Verpackungslinie VL2 bei Dr. Alder Tiernahrung GmbH.

Sie unterstützen Mechaniker und Elektriker bei der Fehlerdiagnose. Sie sind kein Ersatz für den Techniker — Sie sind das strukturierte Gedächtnis der Anlage, das die richtigen Fragen stellt, die wahrscheinlichsten Ursachen nennt und Schaltpläne sowie Steuerungssoftware direkt durchsucht.

LINIE VL2 — 20 SUBSYSTEME:

GRUPPE A — Palettenzuführung:
01 AUF   Palettenladestation
02 FBZ   Palettenförderer
03 ROB   Entladeroboter — Fanuc S-420 i W (Vakuum-Lagengreifer, ca. 200 Dosen)
04 WMK   Maschendrahtförderer (Übergabe nach Roboter)

GRUPPE B — Vereinzelung:
05 DRE   Drehtisch (Bulk → gerichtet)
06 SNG   Vereinzeler (Scheibe + Luftdüsen, Auslaufrutsche verläuft UNTER DRU-Drucker)

GRUPPE C — Einzelreihen-Verarbeitung:
07 DRU   Drucker — Videojet 1880+ (LEASING — vor Eingriff Videojet-Service kontaktieren)
08 DNW   Dosenwender — BMH Bahn W2001 (EINZELDREHUNG, Innenpfad NICHT sichtbar)
09 LBL   Etikettiermaschine — Langguth hotLAN + Nordson 3100 Kleber (#2 häufigster Fehler)

GRUPPE D — ZVI-Integrierte Maschine (Abschnitte 10-13 teilen Vintek-HMI + Steuerung):
10 AGG   Aggregator (3-spaltiger Speicher, Freigabe von 6-Dosen-Raster an TRP)
11 TRP   Tray-Packer — ZVI N1/012/PAC/001 + Nordson ProBlue 7 (#1 HÄUFIGSTER FEHLER DER LINIE)
12 FOL   Folienwickler — ZVI integriert (#3 häufigster Fehler)
13 STU   Schrumpftunnel — ZVI integriert (HOCHSPANNUNG + HEISSE OBERFLÄCHE — LOTO ZWINGEND)

GRUPPE E — Tray-Ausgabe:
14 TBE   Tray-Etikettierer + Kühlsteigförderer — Eidos Printess 4e (⚠ WAX-Band derzeit geladen — RESIN für Schrumpffolie erforderlich)
15 SEL   Schneckenheber (vertikale Spirale, TBE-Ebene → Palettierer-Ebene)
16 ZUO   Zuordnungsstation (einziges Subsystem mit zwei parallelen nachgelagerten Subsystemen — speist PAL3 und PAL2)

GRUPPE F — Palettierung (parallel):
17 PAL3  Palettierer 3 — Eigenbau + Siemens HMI (NICHT identisch mit PAL2)
18 EX3   Ausgang 3 — Vollpaletten-Ausgangsförderer für PAL3, Übergabe an Gabelstapler
19 PAL2  Palettierer 2 — Eigenbau + Siemens HMI (NICHT identisch mit PAL3)
20 EX2   Ausgang 2 — Vollpaletten-Ausgangsförderer für PAL2, Übergabe an Gabelstapler

TAG-SYSTEM: VL2.[SS].[TYP].[NNN] — z.B. VL2.11.M.001 = Subsystem 11 (TRP), Motor 001

WAS SIE NICHT TUN DÜRFEN:
- Keine Freigabe für Arbeiten unter Spannung
- Keine Entscheidung über Abschaltung oder Weiterbetrieb
- Keine Eingriffe in SPS oder Steuerungssysteme
- Keine Überschreibung von Wissensbankeinträgen — nur Anhängen
- Keine autonome Dokumentation von Reparaturen ohne Bestätigung des Bedieners

Strukturieren Sie Ihre erste Antwort GENAU so:
SEVERITY: [HIGH / MEDIUM / LOW]
ROOT CAUSE ASSESSMENT: (2-3 Sätze, maschinenbezogen)
IMMEDIATE ACTIONS: (nummerierte Liste, komponentenbezogen)
INSPECT THESE COMPONENTS: (VL2.XX.TYP.NNN-Tags verwenden wenn bekannt)
UPSTREAM / DOWNSTREAM IMPACT: (Kaskadeneffekte auf andere Subsysteme)
DO NOT RESTART UNTIL: (konkrete Bedingung)
ESCALATE IF: (Bedingung für OEM oder erfahrenen Techniker)`
};

const FOLLOWUP_SUFFIX = {
  EN: `\n\nYou are now in an interactive follow-up loop. The operator has tried something and is reporting back.
DO NOT use the structured SEVERITY/ROOT CAUSE format. Instead:
- Acknowledge what they found in one sentence
- Either ask ONE targeted clarifying question, OR suggest the next specific check/action, OR confirm resolution
- Keep responses to 3-6 sentences max
- Reference specific component tags (VL2.XX.TYPE.NNN) when suggesting checks`,
  DE: `\n\nSie befinden sich jetzt in einer interaktiven Folgediagnose-Schleife. Der Bediener hat etwas versucht und berichtet zurück.
NICHT das strukturierte SEVERITY/ROOT CAUSE-Format verwenden. Stattdessen:
- Bestätigen Sie in einem Satz, was gefunden wurde
- Stellen Sie EINE gezielte Rückfrage, ODER schlagen Sie die nächste konkrete Prüfung vor, ODER bestätigen Sie die Behebung
- Antworten auf maximal 3-6 Sätze begrenzen
- Komponentenkennzeichen (VL2.XX.TYP.NNN) verwenden wenn Prüfungen vorgeschlagen werden`
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try { body = JSON.parse(await readBody(req)); }
  catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

  const {
    subsystem,
    problemDescription,
    labelNumber,
    photos = [],          // array of { base64, mediaType }
    filesNeeded = [],     // from clarify.js
    priorCaseSummary = '',
    conversationHistory = [],   // array of {role, content} for follow-up turns
    language = 'DE',
    lineState,
    symptoms = [],
    operatorNotes = ''
  } = body;

  const isFollowup = conversationHistory.length > 0;
  const lang = language === 'EN' ? 'EN' : 'DE';

  try {
    // ----------------------------------------------------------------
    // Load requested detail files from Hetzner.
    // Three modes based on file extension:
    //   .pdf              → base64 → Claude 'document' block (native PDF reading)
    //   .png/.jpg/.jpeg/.webp → base64 → Claude 'image' block (wiring diagrams)
    //   everything else   → UTF-8 text → appended to text prompt
    // ----------------------------------------------------------------
    const TEXT_EXTS  = new Set(['.md','.txt','.csv','.stl','.scl','.awl','.db','.udt']);
    const IMAGE_EXTS = new Set(['.png','.jpg','.jpeg','.webp']);

    // Accumulate inline-document content blocks and text snippets separately
    const kbDocBlocks  = [];   // Claude content blocks (pdf / image)
    const kbTextChunks = [];   // Plain text to append to textContent

    await Promise.all(
      filesNeeded.map(async (path) => {
        const ext = path.slice(path.lastIndexOf('.')).toLowerCase();
        try {
          if (ext === '.pdf') {
            const b64 = await getObjectBase64(path);
            kbDocBlocks.push({
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: b64 },
              title: path,
              context: `Knowledge base file loaded for VL2 diagnosis: ${path}`
            });
          } else if (IMAGE_EXTS.has(ext)) {
            const b64 = await getObjectBase64(path);
            const mime = ext === '.png' ? 'image/png'
                       : ext === '.webp' ? 'image/webp'
                       : 'image/jpeg';
            kbDocBlocks.push({
              type: 'image',
              source: { type: 'base64', media_type: mime, data: b64 }
            });
            kbTextChunks.push(`\n---\nIMAGE FILE: ${path}\n[Wiring diagram / schematic — see image block above]`);
          } else {
            // Text-mode: .md .txt .csv .stl .scl etc.
            const content = await getObjectText(path);
            kbTextChunks.push(`\n---\nFILE: ${path}\n${content}`);
          }
        } catch {
          kbTextChunks.push(`\n---\nFILE: ${path}\n[Not yet available in knowledge base]`);
        }
      })
    );

    // Build system prompt
    const systemPrompt = SYSTEM_INITIAL[lang]
      + (isFollowup ? FOLLOWUP_SUFFIX[lang] : '');

    // Build user content (multimodal: KB docs + operator photos + text)
    const contentParts = [];

    // 1. KB PDF / image blocks first (reference material)
    kbDocBlocks.forEach(block => contentParts.push(block));

    // 2. Operator photos
    photos.forEach(p => {
      contentParts.push({
        type: 'image',
        source: { type: 'base64', media_type: p.mediaType || 'image/jpeg', data: p.base64 }
      });
    });

    // Build text part
    const ssNum = String(subsystem).padStart(2, '0');
    let textContent = `SUBSYSTEM: VL2.${ssNum}\n`;
    if (labelNumber) textContent += `LABEL: ${labelNumber}\n`;
    if (lineState)   textContent += `LINE STATE: ${lineState === 'stopped' ? 'LINE STOPPED' : 'LINE RUNNING WITH DEFECT'}\n`;
    if (symptoms.length > 0) textContent += `OBSERVED SYMPTOMS:\n${symptoms.map((s,i) => `${i+1}. ${s}`).join('\n')}\n`;
    if (operatorNotes) textContent += `OPERATOR NOTES: ${operatorNotes}\n`;
    if (problemDescription) textContent += `PROBLEM DESCRIPTION: ${problemDescription}\n`;
    if (priorCaseSummary) textContent += `\nPRIOR SIMILAR CASE: ${priorCaseSummary}\n`;
    if (photos.length > 0) textContent += `\n${photos.length} operator photo(s) attached — treat as primary evidence.\n`;
    if (kbDocBlocks.length > 0) textContent += `\n${kbDocBlocks.length} KB document(s) / diagram(s) attached above — use for component identification and verification.\n`;
    if (kbTextChunks.length > 0) textContent += `\nLOADED KNOWLEDGE FILES:${kbTextChunks.join('\n')}`;

    contentParts.push({ type: 'text', text: textContent });

    // Build messages array
    let messages;
    if (isFollowup) {
      // Follow-up: conversation history already seeded by prior calls
      messages = [
        ...conversationHistory,
        { role: 'user', content: contentParts }
      ];
    } else {
      messages = [{ role: 'user', content: contentParts }];
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: isFollowup ? 600 : 1200,
      system: systemPrompt,
      messages
    });

    const replyText = response.content.map(b => b.text || '').join('');

    return res.status(200).json({
      reply: replyText,
      usage: response.usage
    });

  } catch (err) {
    console.error('diagnose.js error:', err);
    return res.status(500).json({ error: err.message });
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
