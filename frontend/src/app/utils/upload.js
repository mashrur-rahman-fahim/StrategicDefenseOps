// utils/upload.js
import { put } from '@vercel/blob';

export async function uploadFile(file) {
  const blob = await put(file.name, file, {
    access: 'public', // Make the file publicly accessible
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url; // Returns the CDN URL
}