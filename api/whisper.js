// api/whisper.js
// Receives JSON { audio_b64, mime, language } from the frontend, decodes to a
// temp file, and sends to OpenAI Whisper for transcription.
// POST /api/whisper
// Body JSON: { audio_b64: string (base64), mime?: string, language?: 'de'|'en' }
// Response: { text: string } on success, { error: string } on failure.

import { createReadStream } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import FormData from 'form-data';

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

  // Pick extension from mime so Whisper accepts the file
  const ext = mime.includes('mp4')  ? 'mp4'
            : mime.includes('mpeg') ? 'mp3'
            : mime.includes('ogg')  ? 'ogg'
            : mime.includes('wav')  ? 'wav'
            :                          'webm';

  const tmpPath = join(tmpdir(), `audio_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`);

  try {
    const audioBuffer = Buffer.from(audio_b64, 'base64');
    if (audioBuffer.length === 0) return res.status(400).json({ error: 'audio_b64 decoded to zero bytes' });
    await writeFile(tmpPath, audioBuffer);

    const form = new FormData();
    form.append('file', createReadStream(tmpPath), { filename: `audio.${ext}`, contentType: mime });
    form.append('model', 'whisper-1');
    form.append('prompt', 'Verpackungslinie, Förderband, Sensor, Palette, Roboter, Greifer, Etikettierer, Folienwickler, Palettierer, Frequenzumrichter, SPS, Störung, Alarm, Vintek, Nordson, ZVI, Fanuc, Videojet, Langguth, Eidos. Packaging line, conveyor, sensor, pallet, robot, gripper, labeler, film wrapper, palletizer, VFD, PLC, fault, alarm.');
    form.append('language', language === 'en' ? 'en' : 'de');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, ...form.getHeaders() },
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
  } finally {
    await unlink(tmpPath).catch(() => {});
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
