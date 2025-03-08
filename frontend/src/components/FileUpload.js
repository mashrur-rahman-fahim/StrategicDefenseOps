// components/FileUpload.js
'use client'; // Mark as a Client Component
import { useState } from 'react';
import { uploadFile } from '../utils/upload';

export default function FileUpload() {
  const [cdnUrl, setCdnUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setCdnUrl(url);
      console.log('File uploaded to:', url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file-input"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && <p>Uploading...</p>}
      {cdnUrl && (
        <div>
          <p>File uploaded successfully!</p>
          <a href={cdnUrl} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>
      )}
    </div>
  );
}