import React from 'react';

export function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', color: '#222', borderRadius: 8, padding: 32, width: 500, boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
      }}>
        <h2>Dependency Visualizer IDE - Help</h2>
        <ul>
          <li><strong>Visualize:</strong> Shows dependency graph for Knit-based projects.</li>
          <li><strong>Issues:</strong> Highlights circular/unnecessary dependencies.</li>
          <li><strong>Suggestions:</strong> Offers performance/structural improvements.</li>
          <li><strong>Interaction:</strong> Zoom, pan, drag nodes, click for details.</li>
          <li><strong>Search:</strong> Filter nodes by name.</li>
          <li><strong>Docs:</strong> See usage, APIs, assets, libraries here.</li>
        </ul>
        <button onClick={onClose} style={{ marginTop: 24, padding: '8px 24px', borderRadius: 4, background: '#00bcd4', color: '#fff', border: 'none', fontWeight: 500 }}>Close</button>
      </div>
    </div>
  );
}