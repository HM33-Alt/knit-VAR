import React from 'react';

const knitPrinciples = [
  {
    title: "Shortest Path",
    description: "Dependency lookup stops at the first found provider in the chain."
  },
  {
    title: "Priority Principle",
    description: "Lookup order: self → inheritance → composition → global → multi-binding."
  },
  {
    title: "Conflict Detection",
    description: "Multiple providers for the same type (except multi-binding) cause a compile-time error."
  },
  {
    title: "Multi-binding",
    description: "List/Set/Map bindings may contain duplicates due to component combinations."
  }
];

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
        <h4 style={{ marginTop: 32 }}>Knit Dependency Lookup Principles</h4>
        <ul>
          {knitPrinciples.map(p => (
            <li key={p.title}>
              <strong>{p.title}:</strong> {p.description}
            </li>
          ))}
        </ul>
        <button onClick={onClose} style={{ marginTop: 24, padding: '8px 24px', borderRadius: 4, background: '#00bcd4', color: '#fff', border: 'none', fontWeight: 500 }}>Close</button>
      </div>
    </div>
  );
}