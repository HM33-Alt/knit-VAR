import React, { useState } from 'react';
import { analyzeDependencies } from './analyzeDependencies';
import { DependencyData, Node } from './types';

interface KnitUploadProps {
  onDataLoaded?: (data: DependencyData) => void;
}

export const KnitUpload: React.FC<KnitUploadProps> = ({ onDataLoaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DependencyData | null>(null);
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
      if (!res.ok) throw new Error('Upload failed');

      const rawData: DependencyData = await res.json();
      // Analyze immediately and assign default positions
      const analyzedData = analyzeDependencies(rawData);

      const positionedNodes = analyzedData.nodes.map((node: Node, idx: number) => ({
        ...node,
        x: node.x ?? 400 + (idx % 5) * 200, // shift right
        y: node.y ?? 300 + Math.floor(idx / 5) * 200, // shift down
      }));

      const finalData: DependencyData = { ...analyzedData, nodes: positionedNodes };

      setResult(finalData);
      if (onDataLoaded) onDataLoaded(finalData);

    } catch (err) {
      setError('Upload failed');
    }
  };

  return (
    <div>
      <input type="file" accept=".kt" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>Upload</button>
      {result && <div style={{ color: 'green' }}>Upload successful!</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );

};
