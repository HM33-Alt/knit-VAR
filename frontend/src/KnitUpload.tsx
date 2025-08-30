import React, { useState } from 'react';
import { analyzeDependencies } from './analyzeDependencies';
import { DependencyData, Node, Edge } from './types';

interface KnitUploadProps {
  onDataLoaded?: (data: DependencyData) => void; // Optional callback when data is loaded
}

/**
 * Component to handle uploading of Kotlin files, analyzing dependencies, and exporting results.
 */
export const KnitUpload: React.FC<KnitUploadProps> = ({ onDataLoaded }) => {
  // State to hold the selected file
  const [file, setFile] = useState<File | null>(null);
  // State to hold the analyzed dependency data
  const [result, setResult] = useState<DependencyData | null>(null);
  // State to hold any error messages
  const [error, setError] = useState<string | null>(null);
  // State to filter nodes/edges by severity
  const [severityFilter, setSeverityFilter] = useState<'all' | 'warning' | 'critical'>('all');

  /**
   * Handles file selection from input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setResult(null); // reset previous result
      setError(null);  // reset previous errors
    }
  };

  /**
   * Handles uploading the file to backend for analysis
   */
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
      const analyzedData = analyzeDependencies(rawData);

      // Assign positions to nodes if not already set
      const positionedNodes = analyzedData.nodes.map((node: Node, idx: number) => ({
        ...node,
        x: node.x ?? 400 + (idx % 5) * 200,
        y: node.y ?? 300 + Math.floor(idx / 5) * 200,
      }));

      const finalData: DependencyData = { ...analyzedData, nodes: positionedNodes };
      setResult(finalData);

      if (onDataLoaded) onDataLoaded(finalData);

    } catch (err) {
      setError('Upload failed');
    }
  };

  /**
   * Exports the analyzed data as a JSON file
   */
  const exportJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dependency_graph.json';
    link.click();
  };

  /**
   * Exports the analyzed data as a CSV file
   */
  const exportCSV = () => {
    if (!result) return;
    let csv = 'type,id,source,target,label,issues,suggestions,severity\n';

    // Serialize nodes
    result.nodes.forEach(n => {
      csv += `node,${n.id},,,${n.label},"${n.issues.join(';')}","${n.suggestions.join(';')}",${n.severity}\n`;
    });

    // Serialize edges
    result.edges.forEach(e => {
      csv += `edge,${e.id},${e.source},${e.target},${e.label},"${e.issues.join(';')}","${e.suggestions.join(';')}",${e.thickness ?? 'default'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dependency_graph.csv';
    link.click();
  };

  // Apply severity filter to nodes and edges
  const filteredResult = severityFilter === 'all'
    ? result
    : result && {
        nodes: result.nodes.filter(n => n.severity === severityFilter),
        edges: result.edges.filter(e => e.issues.some(i => i.toLowerCase().includes(severityFilter))),
      };

  return (
    <div>
      {/* File input */}
      <input type="file" accept=".kt" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>Upload</button>

      {/* Show results and export options */}
      {result && (
        <>
          <div style={{ marginTop: 8 }}>
            <label>Filter by severity: </label>
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value as any)}>
              <option value="all">All</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div style={{ marginTop: 8 }}>
            <button onClick={exportJSON}>Export JSON</button>
            <button onClick={exportCSV}>Export CSV</button>
          </div>

          <div style={{ color: 'green', marginTop: 4 }}>Upload successful!</div>
        </>
      )}

      {/* Display errors */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};
