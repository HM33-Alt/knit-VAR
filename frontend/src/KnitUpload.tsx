import React, { useState } from 'react';

export const KnitUpload: React.FC = () => {
  const [result, setResult] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    const res = await fetch('/api/knit/analyze', {
      method: 'POST',
      body: formData,
    });
    setResult(await res.json());
  };

  return (
    <div>
      <input type="file" accept=".kt" onChange={handleFileChange} />
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};