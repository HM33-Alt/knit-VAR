import React, { useState } from 'react';

const initialNodes = [
  { id: '1', label: 'Service A', x: 100, y: 100 },
  { id: '2', label: 'Module B', x: 300, y: 200 },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'depends on' },
];

const nodeDetails: { [key: string]: { issues: string[]; suggestions: string[] } } = {
  '1': { issues: ['Circular dependency'], suggestions: ['Refactor'] },
  '2': { issues: [], suggestions: ['Split module'] },
};

type SidebarProps = {
  selected: string | null;
  selectedEdge: string | null;
};

function Sidebar({ selected, selectedEdge }: SidebarProps) {
  if (selectedEdge) {
    const edge = initialEdges.find(e => e.id === selectedEdge);
    const source = initialNodes.find(n => n.id === edge?.source);
    const target = initialNodes.find(n => n.id === edge?.target);
    return (
      <div>
        <h3>Edge Details</h3>
        <div>
          <strong>{source?.label}</strong> <span style={{ color: '#00bcd4' }}>{edge?.label}</span> <strong>{target?.label}</strong>
        </div>
      </div>
    );
  }
  if (!selected) return <div>Select a node or edge to see details.</div>;
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

function DependencyGraph({
  nodes,
  edges,
  selected,
  selectedEdge,
  setSelected,
  setSelectedEdge,
  theme,
}: {
  nodes: typeof initialNodes;
  edges: typeof initialEdges;
  selected: string | null;
  selectedEdge: string | null;
  setSelected: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  theme: 'dark' | 'light';
}) {
  const nodeColor = theme === 'dark' ? '#263238' : '#e0f7fa';
  const edgeColor = theme === 'dark' ? '#00bcd4' : '#00796b';
  const textColor = theme === 'dark' ? '#fff' : '#222';

  return (
    <svg width={400} height={300} style={{ background: theme === 'dark' ? '#282c34' : '#f5f7fa', borderRadius: 8 }}>
      {/* Edges */}
      {edges.map(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return null;
        return (
          <g key={edge.id} onClick={() => { setSelectedEdge(edge.id); setSelected(null); }} style={{ cursor: 'pointer' }}>
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={selectedEdge === edge.id ? '#ff9800' : edgeColor}
              strokeWidth={selectedEdge === edge.id ? 4 : 2}
              markerEnd="url(#arrowhead)"
            />
            <text
              x={(source.x + target.x) / 2}
              y={(source.y + target.y) / 2 - 10}
              fill={textColor}
              fontSize={12}
              textAnchor="middle"
            >
              {edge.label}
            </text>
          </g>
        );
      })}
      {/* Nodes */}
      {nodes.map(node => (
        <g key={node.id} onClick={() => { setSelected(node.id); setSelectedEdge(null); }} style={{ cursor: 'pointer' }}>
          <circle
            cx={node.x}
            cy={node.y}
            r={28}
            fill={selected === node.id ? '#ff9800' : nodeColor}
            stroke={selected === node.id ? '#ff9800' : edgeColor}
            strokeWidth={selected === node.id ? 4 : 2}
          />
          <text
            x={node.x}
            y={node.y + 5}
            fill={textColor}
            fontSize={14}
            textAnchor="middle"
            fontWeight="bold"
          >
            {node.label}
          </text>
        </g>
      ))}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={edgeColor} />
        </marker>
      </defs>
    </svg>
  );
}

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const filteredNodes = initialNodes.filter(n =>
    n.label.toLowerCase().includes(search.toLowerCase())
  );

  const bgColor = theme === 'dark' ? '#23272e' : '#f5f7fa';
  const sidebarBg = theme === 'dark' ? '#20232a' : '#fff';
  const sidebarBorder = theme === 'dark' ? '#2c313c' : '#eee';
  const mainBg = theme === 'dark' ? '#282c34' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#222';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Segoe UI, sans-serif', background: bgColor }}>
      {/* Top Bar */}
      <div style={{
        height: 48,
        background: theme === 'dark' ? '#1a1d21' : '#e0f7fa',
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: 1 }}>Dependency Visualizer IDE</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
          <button
            style={{
              background: '#00bcd4',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '6px 16px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >Run Analysis</button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              background: theme === 'dark' ? '#fff' : '#23272e',
              color: theme === 'dark' ? '#23272e' : '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '6px 16px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 270,
          background: sidebarBg,
          color: textColor,
          borderRight: `1px solid ${sidebarBorder}`,
          padding: 24,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search nodes..."
            style={{
              marginBottom: 14,
              width: '100%',
              padding: 8,
              borderRadius: 4,
              border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
              background: bgColor,
              color: textColor
            }}
          />
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
            {filteredNodes.map(node => (
              <li
                key={node.id}
                style={{
                  cursor: 'pointer',
                  fontWeight: selected === node.id ? 'bold' : 'normal',
                  background: selected === node.id ? (theme === 'dark' ? '#263238' : '#e0f7fa') : undefined,
                  padding: '6px 10px',
                  borderRadius: 4,
                  marginBottom: 4,
                  transition: 'background 0.2s',
                  color: textColor
                }}
                onClick={() => {
                  setSelected(node.id);
                  setSelectedEdge(null);
                }}
              >
                {node.label}
              </li>
            ))}
          </ul>
          <Sidebar selected={selected} selectedEdge={selectedEdge} />
        </div>
        {/* Main Panel */}
        <div style={{
          flex: 1,
          background: mainBg,
          padding: 24,
          color: textColor,
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <h3 style={{ color: '#00bcd4', marginBottom: 16 }}>Edges</h3>
          <ul>
            {initialEdges.map(edge => (
              <li
                key={edge.id}
                style={{
                  cursor: 'pointer',
                  background: selectedEdge === edge.id ? (theme === 'dark' ? '#263238' : '#e0f7fa') : undefined,
                  padding: '6px 10px',
                  borderRadius: 4,
                  marginBottom: 4,
                  transition: 'background 0.2s',
                  color: textColor
                }}
                onClick={() => {
                  setSelectedEdge(edge.id);
                  setSelected(null);
                }}
              >
                {initialNodes.find(n => n.id === edge.source)?.label} &rarr; {initialNodes.find(n => n.id === edge.target)?.label} ({edge.label})
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 32 }}>
            <DependencyGraph
              nodes={initialNodes}
              edges={initialEdges}
              selected={selected}
              selectedEdge={selectedEdge}
              setSelected={setSelected}
              setSelectedEdge={setSelectedEdge}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
}