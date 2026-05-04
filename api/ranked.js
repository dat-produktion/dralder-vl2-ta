// api/ranked.js
// Returns top-3 recency-weighted symptoms for a subsystem.
// Reads STOERUNGEN_TS[XX].md, parses the ## Fault Log section.
// GET /api/ranked?ss=09
// Response: { ranked: [{symptom, count, score}], totalFixes: number }

import { getObjectText } from './_storage.js';

export const config = { maxDuration: 15 };

// Recency weights: last 7d=3, 8-30d=2, 31-90d=1, >90d=0.5
function recencyWeight(dateStr) {
  const ageDays = (Date.now() - new Date(dateStr).getTime()) / 86400000;
  if (ageDays <= 7)  return 3;
  if (ageDays <= 30) return 2;
  if (ageDays <= 90) return 1;
  return 0.5;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const ss = req.query.ss;
  if (!ss) return res.status(400).json({ error: 'ss query param required' });

  const ssNum = String(ss).padStart(2, '0');

  try {
    const text = await getObjectText(`subsystems/STOERUNGEN_TS${ssNum}.md`).catch(() => '');

    // Parse ## Fault Log section
    // Entry format: ### YYYY-MM-DD | VL2.XX.YYY.NNN | Symptom text
    // Followed by: - **Symptom**: actual symptom text
    const scores  = {};
    const counts  = {};
    const display = {};
    let totalFixes = 0;

    const faultLogSection = text.split('## Fault Log')[1] || '';
    const entryRegex = /###\s+(\d{4}-\d{2}-\d{2})[^|\n]*\|[^|\n]*\|[^\n]+\n([\s\S]*?)(?=###|\s*$)/g;
    let match;

    while ((match = entryRegex.exec(faultLogSection)) !== null) {
      const dateStr   = match[1];
      const entryBody = match[2];

      // Extract symptom line
      const symptomLine = entryBody.match(/\*\*Symptom\*\*:\s*(.+)/);
      if (!symptomLine) continue;

      const symptomRaw = symptomLine[1].trim();
      // Skip placeholder values
      if (symptomRaw === 'Not specified' || symptomRaw === '[KNOWLEDGE PENDING') continue;

      const key = symptomRaw.toLowerCase();
      const w   = recencyWeight(dateStr);

      scores[key]  = (scores[key]  || 0) + w;
      counts[key]  = (counts[key]  || 0) + 1;
      display[key] = symptomRaw;   // last seen display string wins
      totalFixes++;
    }

    const ranked = Object.keys(scores)
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, 3)
      .map(k => ({ symptom: display[k], count: counts[k], score: Math.round(scores[k] * 10) / 10 }));

    // Cache hint — ranked list changes slowly
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json({ ranked, totalFixes });

  } catch (err) {
    console.error('ranked.js error:', err);
    return res.status(500).json({ error: err.message });
  }
}
