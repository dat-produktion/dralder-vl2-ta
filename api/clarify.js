// api/clarify.js
// Phase B2: First Claude call — reads INDEX.md only, decides which detail files to load.
// Returns: { filesNeeded: string[], priorCaseFound: boolean, priorCaseSummary: string }
// POST /api/clarify
// Body JSON: { subsystem, problemDescription, labelNumber, photoDescriptions }

import Anthropic from '@anthropic-ai/sdk';
import { getObjectText } from './_storage.js';

export const config = { maxDuration: 30 };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try { body = JSON.parse(await readBody(req)); }
  catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

  const { subsystem, problemDescription, labelNumber, photoDescriptions = [] } = body;
  if (!subsystem || !problemDescription) {
    return res.status(400).json({ error: 'subsystem and problemDescription required' });
  }

  try {
    // Load INDEX.md and the relevant STOERUNGEN fault file from object storage
    const [indexMd, stoerMd] = await Promise.all([
      getObjectText('INDEX.md'),
      getObjectText(`subsystems/STOERUNGEN_TS${String(subsystem).padStart(2,'0')}.md`).catch(() => '')
    ]);

    const systemPrompt = `You are the steering intelligence for a packaging line diagnostic agent at Dr. Alder Tiernahrung GmbH — Line 2 (VL2). 

Your task at this stage is NOT to diagnose. Your task is to:
1. Read INDEX.md to understand which knowledge files exist in the knowledge base.
2. Read the most recent fault log for this subsystem.
3. Decide which additional files would be most useful for diagnosis.
4. Check whether a similar case has been documented before.

Respond ONLY with valid JSON in this exact schema:
{
  "filesNeeded": ["path/to/file1.md", "path/to/file2.pdf"],
  "priorCaseFound": true,
  "priorCaseSummary": "Brief description of the most similar prior case, or empty string if none"
}

Rules:
- filesNeeded: list 0-2 file paths from INDEX.md that are relevant. Empty array if the STOERUNGEN fault log alone is sufficient.
- ONLY request files whose path ends in _kb.md or _alarms.md. These are lean summaries safe for live diagnosis.
- NEVER request files under manuals/raw/ (full OEM PDFs — far too expensive for live operator use) or under diagrams/ (wiring diagrams — load offline only).
- Hard cap: maximum 2 files per call. Token budget is tight; pick the most decisive ones.
- priorCaseSummary: one sentence max. Empty string if no prior case found.
- No other text outside the JSON object.`;

    const userContent = `SUBSYSTEM: VL2.${String(subsystem).padStart(2,'0')}
LABEL NUMBER: ${labelNumber || 'not provided'}
PROBLEM DESCRIPTION: ${problemDescription}
${photoDescriptions.length > 0 ? `PHOTOS: ${photoDescriptions.join('; ')}` : ''}

---
INDEX.md:
${indexMd || '[INDEX.md not yet populated — knowledge base being built]'}

---
STOERUNGEN_TS${String(subsystem).padStart(2,'0')}.md (recent fault log):
${stoerMd || '[No fault history for this subsystem yet]'}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }]
    });

    const raw = response.content.map(b => b.text || '').join('');
    // Strip any markdown fences if Claude adds them
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('clarify.js error:', err);
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
