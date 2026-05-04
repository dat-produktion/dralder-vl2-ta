// api/log.js
// Records a fault that was NOT resolved by the operator.
// Two main triggers (both from the frontend):
//   - Operator clicks Reset / closes panel after running a diagnose      → status: 'fix_not_reported'
//   - beforeunload beacon when tab closes mid-session                    → status: 'fix_not_reported'
//
// Writes:
//   - photos/<errorId>/diag-<NN>.<ext>  (any fault images present)
//   - STOERUNGEN_TS<NN>.md entry (so long-term KB captures unresolved cases too)
//   - ANFRAGEN_LOG.md one-liner
//
// POST /api/log
// Body JSON: { error_id, subsystem, line_state, symptoms, operator_notes,
//              fault_images:[{b64,mime}], solved:bool, status, language, timestamp }

import { putObject, getObjectText, putObjectText } from './_storage.js';

export const config = { maxDuration: 15, api: { bodyParser: { sizeLimit: '25mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try { body = JSON.parse(await readBody(req)); }
  catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

  const errorId       = body.error_id || generateErrorIdServerSide();
  const subsystemRaw  = body.subsystem;
  const lineState     = body.line_state || body.lineState || null;
  const symptoms      = body.symptoms   || [];
  const operatorNotes = body.operator_notes || body.operatorNotes || '';
  const faultImages   = body.fault_images   || [];
  const solved        = !!body.solved;
  const status        = body.status || (solved ? 'SOLVED' : 'fix_not_reported');
  const language      = body.language || 'DE';

  const ssNum   = subsystemRaw ? String(subsystemRaw).replace(/^VL2\./, '').padStart(2,'0') : '00';
  const now     = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const tsStr   = now.toISOString().replace('T', ' ').slice(0, 19);

  try {
    // 1. Save any fault photos under photos/<errorId>/diag-<NN>.<ext>
    const photoPaths = [];
    for (let i = 0; i < faultImages.length; i++) {
      const img = faultImages[i];
      if (!img || !img.b64) continue;
      const ext = (img.mime || 'image/jpeg').split('/')[1] || 'jpg';
      const key = `photos/${errorId}/diag-${String(i+1).padStart(2,'0')}.${ext}`;
      try {
        await putObject(key, Buffer.from(img.b64, 'base64'), img.mime || 'image/jpeg');
        photoPaths.push({ role: 'diag', path: '/' + key });
      } catch (e) { console.warn('log photo save failed', key, e.message); }
    }

    // 2. Concise description from symptoms + operator notes
    const description = buildConciseDescription(symptoms, operatorNotes);

    // 3. Append entry to STOERUNGEN_TS<NN>.md (only if subsystem known)
    if (ssNum !== '00') {
      const entry = formatStoerungEntry({
        errorId, dateStr, ssNum, status,
        description, lineState, photoPaths, language
      });
      const stoerKey = `subsystems/STOERUNGEN_TS${ssNum}.md`;
      const stoerCurrent = await getObjectText(stoerKey).catch(() => '');
      await putObjectText(stoerKey, stoerCurrent + entry);
    }

    // 4. One-line summary in ANFRAGEN_LOG.md
    const statusLabel = solved ? 'SOLVED' : (status === 'fix_not_reported' ? 'FIX NOT REPORTED' : 'UNSOLVED');
    const logLine = `\n## ${tsStr} | VL2.${ssNum} | ${errorId} | ${statusLabel} — ${description.slice(0,140)} | photos:${photoPaths.length} | ${language}`;
    const logCurrent = await getObjectText('ANFRAGEN_LOG.md').catch(() => '');
    await putObjectText('ANFRAGEN_LOG.md', logCurrent + logLine);

    return res.status(200).json({ ok: true, error_id: errorId, photos: photoPaths });

  } catch (err) {
    console.error('log.js error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// --- helpers ---

function buildConciseDescription(symptoms, operatorNotes) {
  const parts = [];
  if (Array.isArray(symptoms) && symptoms.length) parts.push(symptoms.join('; '));
  if (operatorNotes) {
    const trimmed = String(operatorNotes).trim().replace(/\s+/g, ' ').slice(0, 80);
    if (trimmed) parts.push(trimmed);
  }
  return parts.join(' — ') || '(no description provided)';
}

function formatStoerungEntry({ errorId, dateStr, ssNum, status, description, lineState, photoPaths, language }) {
  const statusLabel = status === 'fix_not_reported' ? 'FIX NOT REPORTED' : status.toUpperCase();
  const lines = [
    '',
    `### ${dateStr} | ${errorId} | ${statusLabel}`,
    `- **Error ID**: ${errorId}`,
    `- **Subsystem**: VL2.${ssNum}`,
    `- **Description**: ${description}`,
    `- **Line state**: ${lineState === 'stopped' ? 'Stopped' : lineState === 'running' ? 'Running with defect' : 'Not specified'}`,
    `- **Resolution**: Fix not reported by operator`,
    `- **Language**: ${language}`,
  ];
  if (photoPaths.length) {
    lines.push('- **Photos**:');
    photoPaths.forEach(p => lines.push(`  - ${p.role}: ${p.path}`));
  }
  return lines.join('\n') + '\n';
}

function generateErrorIdServerSide() {
  const now  = new Date();
  const dd   = String(now.getDate()).padStart(2,'0');
  const mm   = String(now.getMonth()+1).padStart(2,'0');
  const yyyy = now.getFullYear();
  const secs = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();
  const nnn  = String((secs + Math.floor(Math.random()*100)) % 1000).padStart(3,'0');
  return `${dd}${mm}${yyyy}-${nnn}`;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
