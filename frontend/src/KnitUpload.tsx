import React, { useState } from 'react';

export const KnitUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:8080/api/knit/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Upload failed');
      }
      setResult(await res.json());
    } catch (err) {
      setError('Upload failed');
    }
  };

  return (
    <div>
      <input type="file" accept=".kt" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>Upload</button>
      {result && <div style={{ color: 'green' }}>Upload successful!</div>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};