// api/log.js
// Phase B7 (unsolved) + B8 (all requests): append to ANFRAGEN_LOG.md
// POST /api/log
// Body JSON: { subsystem, labelNumber, symptom, operatorNotes, conversationHistory,
//              solved: boolean, language }

import { getObjectText, putObjectText } from './_storage.js';

export const config = { maxDuration: 15 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try { body = JSON.parse(await readBody(req)); }
  catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

  const {
    subsystem,
    labelNumber,
    symptom,
    operatorNotes = '',
    conversationHistory = [],
    solved = false,
    language = 'DE'
  } = body;

  const ssNum  = String(subsystem || '00').padStart(2, '0');
  const now    = new Date();
  const tsStr  = now.toISOString().replace('T', ' ').slice(0, 19);
  const turns  = Math.floor(conversationHistory.length / 2);
  const status = solved ? 'SOLVED' : 'UNSOLVED — external diagnosis required';

  const logEntry = `
## ${tsStr} | VL2.${ssNum} | ${status}
- Label: ${labelNumber || 'N/A'}
- Symptom: ${symptom || 'N/A'}
- Notes: ${operatorNotes || 'N/A'}
- Turns: ${turns}
- Language: ${language}
`;

  try {
    const current = await getObjectText('ANFRAGEN_LOG.md').catch(() => '');
    await putObjectText('ANFRAGEN_LOG.md', current + logEntry);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('log.js error:', err);
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
