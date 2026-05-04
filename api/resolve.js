// api/resolve.js
// Phase B6: Operator confirms resolution.
// 1. Uploads photo to Hetzner Object Storage
// 2. Appends structured entry to STOERUNGEN_TS[XX].md
// 3. Appends to ANFRAGEN_LOG.md
// POST /api/resolve
// Body JSON: { subsystem, labelNumber, symptom, fixText, fixPhoto: {base64, mediaType, name},
//              conversationHistory, language, operatorNotes, lineState }

import { putObject, getObjectText, putObjectText } from './_storage.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try { body = JSON.parse(await readBody(req)); }
  catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

  const {
    subsystem,
    labelNumber,
    symptom,
    fixText,
    fixPhoto,          // { base64, mediaType, name }
    conversationHistory = [],
    language = 'DE',
    operatorNotes = '',
    lineState
  } = body;

  if (!subsystem || !fixText || !fixPhoto) {
    return res.status(400).json({ error: 'subsystem, fixText, and fixPhoto required' });
  }

  const ssNum  = String(subsystem).padStart(2, '0');
  const now    = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const tsStr   = now.toISOString().replace('T', ' ').slice(0, 19);
  const uuid    = Math.random().toString(36).slice(2, 10);

  try {
    // 1. Upload photo to object storage
    const ext        = (fixPhoto.mediaType || 'image/jpeg').split('/')[1] || 'jpg';
    const photoKey   = `photos/vl2-${ssNum}/${dateStr}/${uuid}.${ext}`;
    const photoBytes = Buffer.from(fixPhoto.base64, 'base64');
    await putObject(photoKey, photoBytes, fixPhoto.mediaType || 'image/jpeg');

    // 2. Build structured fault log entry (Markdown)
    const turns = Math.floor(conversationHistory.length / 2);
    const entry = `
### ${dateStr} | ${labelNumber || `VL2.${ssNum}`} | ${symptom || fixText.slice(0, 60)}
- **Symptom**: ${symptom || operatorNotes || 'Not specified'}
- **Diagnosis**: (see conversation — ${turns} turn${turns !== 1 ? 's' : ''})
- **Resolution**: ${fixText}
- **Line state**: ${lineState === 'stopped' ? 'Stopped' : lineState === 'running' ? 'Running with defect' : 'Not specified'}
- **Resolved by**: Operator (confirmed)
- **Photo**: /${photoKey}
- **Turns**: ${turns}
`;

    // 3. Append to STOERUNGEN_TS[XX].md
    const stoerKey     = `subsystems/STOERUNGEN_TS${ssNum}.md`;
    const stoerCurrent = await getObjectText(stoerKey).catch(() => '');
    await putObjectText(stoerKey, stoerCurrent + entry);

    // 4. Append to ANFRAGEN_LOG.md
    const logEntry = `
## ${tsStr} | VL2.${ssNum} | SOLVED
- Label: ${labelNumber || 'N/A'}
- Symptom: ${symptom || 'N/A'}
- Resolution: ${fixText}
- Photo: /${photoKey}
- Turns: ${turns}
- Language: ${language}
`;
    const logCurrent = await getObjectText('ANFRAGEN_LOG.md').catch(() => '');
    await putObjectText('ANFRAGEN_LOG.md', logCurrent + logEntry);

    return res.status(200).json({
      ok: true,
      photoKey,
      message: `Resolution logged for VL2.${ssNum}`
    });

  } catch (err) {
    console.error('resolve.js error:', err);
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
