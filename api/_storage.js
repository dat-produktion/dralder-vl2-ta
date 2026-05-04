// api/_storage.js
// Shared S3-compatible client for Hetzner Object Storage.
// All functions are async. Import selectively in each function.
//
// Required environment variables (set in Vercel dashboard):
//   HETZNER_ACCESS_KEY_ID
//   HETZNER_SECRET_ACCESS_KEY
//   HETZNER_BUCKET_NAME
//   HETZNER_ENDPOINT  (e.g. https://fsn1.your-objectstorage.com)

import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

function getClient() {
  const endpoint = process.env.HETZNER_ENDPOINT;
  const region   = process.env.HETZNER_REGION || 'fsn1';
  if (!endpoint) throw new Error('HETZNER_ENDPOINT env var not set');
  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId:     process.env.HETZNER_ACCESS_KEY_ID,
      secretAccessKey: process.env.HETZNER_SECRET_ACCESS_KEY
    },
    forcePathStyle: true   // required for Hetzner (not AWS-style virtual-hosted buckets)
  });
}

function getBucket() {
  const bucket = process.env.HETZNER_BUCKET_NAME;
  if (!bucket) throw new Error('HETZNER_BUCKET_NAME env var not set');
  return bucket;
}

// Stream to Buffer helper
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

/**
 * Get object as UTF-8 text string.
 * Throws if object not found.
 */
export async function getObjectText(key) {
  const client = getClient();
  const res = await client.send(new GetObjectCommand({ Bucket: getBucket(), Key: key }));
  const buf = await streamToBuffer(res.Body);
  return buf.toString('utf-8');
}

/**
 * Get object as base64 string (for binary files like PDFs/images).
 * Throws if object not found.
 */
export async function getObjectBase64(key) {
  const client = getClient();
  const res = await client.send(new GetObjectCommand({ Bucket: getBucket(), Key: key }));
  const buf = await streamToBuffer(res.Body);
  return buf.toString('base64');
}

/**
 * Put raw bytes to object storage.
 */
export async function putObject(key, body, contentType = 'application/octet-stream') {
  const client = getClient();
  await client.send(new PutObjectCommand({
    Bucket:      getBucket(),
    Key:         key,
    Body:        body,
    ContentType: contentType
  }));
}

/**
 * Put UTF-8 text string to object storage.
 */
export async function putObjectText(key, text) {
  await putObject(key, Buffer.from(text, 'utf-8'), 'text/markdown; charset=utf-8');
}
