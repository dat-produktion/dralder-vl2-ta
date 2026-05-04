// api/whisper.js
// Receives audio blob from tablet, sends to OpenAI Whisper, returns transcript
// POST /api/whisper
// Body: multipart/form-data with field "audio" (webm/ogg/mp4 blob)

import { createReadStream } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import FormData from 'form-data';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

  try {
    // Vercel passes raw body as Buffer when content-type is multipart
    // We write to a temp file then pass to Whisper as a stream
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const audioBuffer = Buffer.concat(chunks);

    // Determine extension from content-type header
    const contentType = req.headers['content-type'] || 'audio/webm';
    const ext = contentType.includes('mp4') ? 'mp4'
               : contentType.includes('ogg') ? 'ogg'
               : 'webm';

    const tmpPath = join(tmpdir(), `audio_${Date.now()}.${ext}`);
    await writeFile(tmpPath, audioBuffer);

    // Build multipart request to Whisper
    const form = new FormData();
    form.append('file', createReadStream(tmpPath), { filename: `audio.${ext}`, contentType });
    form.append('model', 'whisper-1');
    // Prompt helps Whisper with factory/technical vocabulary
    form.append('prompt', 'Packaging line, conveyor, sensor, pallet, robot, gripper, labeler, film wrapper, palletizer, VFD, PLC, fault, alarm');
    // Language hint - German primary but allow English technical terms
    form.append('language', 'de');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, ...form.getHeaders() },
      body: form
    });

    await unlink(tmpPath).catch(() => {}); // cleanup, ignore error if already gone

    if (!whisperRes.ok) {
      const err = await whisperRes.text();
      console.error('Whisper error:', err);
      return res.status(502).json({ error: 'Whisper API error', detail: err });
    }

    const { text } = await whisperRes.json();
    return res.status(200).json({ transcript: text.trim() });

  } catch (err) {
    console.error('whisper.js error:', err);
    return res.status(500).json({ error: err.message });
  }
}
