import React, { useState } from 'react';

const initialNodes = [
  { id: '1', label: 'Service A', position: { x: 100, y: 100 } },
  { id: '2', label: 'Module B', position: { x: 400, y: 100 } },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'depends on' },
];

const nodeDetails: { [key: string]: { issues: string[]; suggestions: string[] } } = {
  '1': {
    issues: ['Circular dependency'],
    suggestions: ['Refactor'],
  },
  '2': {
    issues: [],
    suggestions: ['Split module'],
  },
};

function Sidebar({ selected }: { selected: string | null }) {
  if (!selected) return <div>Select a node to see details.</div>;
  const details = nodeDetails[selected];
  const node = initialNodes.find(n => n.id === selected);
  return (
    <div>
      <h3>Details for {node?.label}</h3>
      <div>
        <strong>Issues:</strong>
        <ul>
          {details.issues.length ? details.issues.map((i, idx) => <li key={idx}>{i}</li>) : <li>None</li>}
        </ul>
      </div>
      <div>
        <strong>Suggestions:</strong>
        <ul>
          {details.suggestions.length ? details.suggestions.map((s, idx) => <li key={idx}>{s}</li>) : <li>None</li>}
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const filteredNodes = initialNodes.filter(n => n.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: 250, padding: 20, borderRight: '1px solid #eee', background: '#fafafa' }}>
        <h2>Dependency Visualizer</h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search nodes..."
          style={{ marginBottom: 10, width: '100%' }}
        />
        <ul>
          {filteredNodes.map(node => (
            <li
              key={node.id}
              style={{ cursor: 'pointer', fontWeight: selected === node.id ? 'bold' : 'normal' }}
              onClick={() => setSelected(node.id)}
            >
              {node.label}
            </li>
          ))}
        </ul>
        <Sidebar selected={selected} />
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        {/* SVG for edges */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
          {initialEdges.map(edge => {
            const source = initialNodes.find(n => n.id === edge.source);
            const target = initialNodes.find(n => n.id === edge.target);
            if (!source || !target) return null;
            return (
              <line
                key={edge.id}
                x1={source.position.x + 50}
                y1={source.position.y + 25}
                x2={target.position.x + 50}
                y2={target.position.y + 25}
                stroke="#888"
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
            );
          })}
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L10,5 L0,10" fill="#888" />
            </marker>
          </defs>
        </svg>
        {/* Render nodes */}
        {initialNodes.map(node => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.position.x,
              top: node.position.y,
              width: 100,
              height: 50,
              background: selected === node.id ? '#e0f7fa' : '#fff',
              border: '2px solid #888',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: selected === node.id ? '0 0 8px #00bcd4' : undefined,
            }}
            onClick={() => setSelected(node.id)}
          >
            {node.label}
          </div>
        ))}
      </div>
    </div>
  );
}