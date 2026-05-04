// api/resolve.js
// Operator confirmed they fixed the fault. We:
//  1. Save the resolution photo (if any) to photos/<errorId>/fix.<ext>
//  2. Save any diagnostic photos (in case diagnose.js missed them) to photos/<errorId>/diag-<seq>.<ext>
//  3. Append a structured entry to subsystems/STOERUNGEN_TS<NN>.md (with error_id + concise description)
//  4. Append a one-line summary to ANFRAGEN_LOG.md
//
// POST /api/resolve
// Body JSON (current frontend contract):
//   { error_id, subsystem, line_state, symptoms, operator_notes, diagnosis,
//     resolution, resolution_image:{b64,mime}, fault_images:[{b64,mime}],
//     conversation_turns, language, timestamp }

import { putObject, getObjectText, putObjectText } from './_storage.js';

export const config = { maxDuration: 30, api: { bodyParser: { sizeLimit: '25mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try { body = JSON.parse(await readBody(req)); }
  catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

  // --- field normalization (accept new + legacy) ---
  const errorId       = body.error_id || generateErrorIdServerSide();
  const subsystemRaw  = body.subsystem;
  const lineState     = body.line_state || body.lineState || null;
  const symptoms      = body.symptoms   || [];
  const operatorNotes = body.operator_notes || body.operatorNotes || '';
  const resolution    = body.resolution || body.fixText || '';
  const resolutionImg = body.resolution_image || body.fixPhoto || null;   // {b64,mime} or null
  const faultImages   = body.fault_images   || body.photos      || [];   // array of {b64,mime}
  const diagnosis     = body.diagnosis      || null;                      // {reply,summary} or null
  const turns         = body.conversation_turns ?? body.turns ?? 0;
  const language      = body.language       || 'DE';

  if (!subsystemRaw) return res.status(400).json({ error: 'subsystem required' });
  if (!resolution)   return res.status(400).json({ error: 'resolution text required' });

  const ssNum   = String(subsystemRaw).replace(/^VL2\./, '').padStart(2, '0');
  const now     = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const tsStr   = now.toISOString().replace('T', ' ').slice(0, 19);

  try {
    const photoPaths = [];

    // 1. Resolution photo  →  photos/<errorId>/fix.<ext>
    if (resolutionImg && resolutionImg.b64) {
      const ext = (resolutionImg.mime || 'image/jpeg').split('/')[1] || 'jpg';
      const key = `photos/${errorId}/fix.${ext}`;
      await putObject(key, Buffer.from(resolutionImg.b64, 'base64'), resolutionImg.mime || 'image/jpeg');
      photoPaths.push({ role: 'fix', path: '/' + key });
    }

    // 2. Fault/diagnostic photos  →  photos/<errorId>/diag-<NN>.<ext>
    //    (Best-effort idempotent — diagnose.js may have already saved them; overwrite is fine.)
    for (let i = 0; i < faultImages.length; i++) {
      const img = faultImages[i];
      if (!img || !img.b64) continue;
      const ext = (img.mime || 'image/jpeg').split('/')[1] || 'jpg';
      const key = `photos/${errorId}/diag-${String(i+1).padStart(2,'0')}.${ext}`;
      await putObject(key, Buffer.from(img.b64, 'base64'), img.mime || 'image/jpeg');
      photoPaths.push({ role: 'diag', path: '/' + key });
    }

    // 3. Build concise description (symptoms + clipped operator notes)
    const description = buildConciseDescription(symptoms, operatorNotes);
    const diagSummary = (diagnosis && (diagnosis.summary || (diagnosis.reply || '').slice(0, 160))) || '';

    // 4. Append structured entry to STOERUNGEN_TS<NN>.md
    const entry = formatStoerungEntry({
      errorId, dateStr, ssNum, status: 'SOLVED',
      description, diagSummary, resolution, lineState,
      turns, photoPaths, language
    });
    const stoerKey = `subsystems/STOERUNGEN_TS${ssNum}.md`;
    const stoerCurrent = await getObjectText(stoerKey).catch(() => '');
    await putObjectText(stoerKey, stoerCurrent + entry);

    // 5. Append one-line summary to ANFRAGEN_LOG.md
    const logLine = `\n## ${tsStr} | VL2.${ssNum} | ${errorId} | SOLVED — ${description.slice(0,120)} → ${resolution.slice(0,120)} | photos:${photoPaths.length} | turns:${turns} | ${language}`;
    const logCurrent = await getObjectText('ANFRAGEN_LOG.md').catch(() => '');
    await putObjectText('ANFRAGEN_LOG.md', logCurrent + logLine);

    return res.status(200).json({ ok: true, error_id: errorId, photos: photoPaths });

  } catch (err) {
    console.error('resolve.js error:', err);
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

function formatStoerungEntry({ errorId, dateStr, ssNum, status, description, diagSummary, resolution, lineState, turns, photoPaths, language }) {
  const lines = [
    '',
    `### ${dateStr} | ${errorId} | ${status}`,
    `- **Error ID**: ${errorId}`,
    `- **Subsystem**: VL2.${ssNum}`,
    `- **Description**: ${description}`,
    `- **Line state**: ${lineState === 'stopped' ? 'Stopped' : lineState === 'running' ? 'Running with defect' : 'Not specified'}`,
    `- **Diagnosis (TA)**: ${diagSummary || '(no diagnosis recorded)'}`,
    `- **Resolution**: ${resolution}`,
    `- **Turns**: ${turns}`,
    `- **Language**: ${language}`,
  ];
  if (photoPaths.length) {
    lines.push('- **Photos**:');
    photoPaths.forEach(p => lines.push(`  - ${p.role}: ${p.path}`));
  }
  return lines.join('\n') + '\n';
}

function generateErrorIdServerSide() {
  // Used only when the frontend forgets to send error_id (legacy clients / direct API hits).
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
