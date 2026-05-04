// api/whisper.js
// Receives JSON { audio_b64, mime, language } from the frontend, decodes the
// base64, and posts the raw audio to OpenAI Whisper using native Web FormData.
// POST /api/whisper
// Body JSON: { audio_b64: string (base64), mime?: string, language?: 'de'|'en' }
// Response: { text: string } on success, { error: string } on failure.

export const config = {
  maxDuration: 30,
  api: { bodyParser: { sizeLimit: '25mb' } }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

  let body;
  try { body = JSON.parse(await readBody(req)); }
  catch { return res.status(400).json({ error: 'Invalid JSON body' }); }

  const { audio_b64, mime = 'audio/webm', language = 'de' } = body;
  if (!audio_b64) return res.status(400).json({ error: 'audio_b64 required' });

  const ext = mime.includes('mp4')  ? 'mp4'
            : mime.includes('mpeg') ? 'mp3'
            : mime.includes('ogg')  ? 'ogg'
            : mime.includes('wav')  ? 'wav'
            :                          'webm';

  try {
    const audioBuffer = Buffer.from(audio_b64, 'base64');
    if (audioBuffer.length === 0) return res.status(400).json({ error: 'audio_b64 decoded to zero bytes' });

    // Native Web FormData + Blob — fetch sets the multipart boundary itself.
    const blob = new Blob([audioBuffer], { type: mime });
    const form = new FormData();
    form.append('file', blob, `audio.${ext}`);
    form.append('model', 'whisper-1');
    form.append('prompt', 'Verpackungslinie, Förderband, Sensor, Palette, Roboter, Greifer, Etikettierer, Folienwickler, Palettierer, Frequenzumrichter, SPS, Störung, Alarm, Vintek, Nordson, ZVT, Fanuc, Videojet, Langguth, Eidos. Packaging line, conveyor, sensor, pallet, robot, gripper, labeler, film wrapper, palletizer, VFD, PLC, fault, alarm.');
    form.append('language', language === 'en' ? 'en' : 'de');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },  // do NOT set Content-Type — FormData sets it with boundary
      body: form
    });

    if (!whisperRes.ok) {
      const errText = await whisperRes.text();
      console.error('Whisper API error:', whisperRes.status, errText);
      return res.status(502).json({ error: `Whisper ${whisperRes.status}: ${errText.slice(0, 300)}` });
    }

    const data = await whisperRes.json();
    return res.status(200).json({ text: (data.text || '').trim() });

  } catch (err) {
    console.error('whisper.js error:', err);
    return res.status(500).json({ error: err.message });
  }
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
