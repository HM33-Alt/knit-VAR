import React, { useState, useEffect, useRef } from 'react';

// Types
type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  issues: string[];
  suggestions: string[];
};
type Edge = {
  id: string;
  source: string;
  target: string;
  label: string;
  issues: string[];
  suggestions: string[];
};
type DependencyData = {
  nodes: Node[];
  edges: Edge[];
};

// Help Modal
function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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

// Sidebar
function Sidebar({ selectedNode, selectedEdge }: { selectedNode: Node | null; selectedEdge: Edge | null }) {
  if (selectedEdge) {
    return (
      <div>
        <h3>Edge Details</h3>
        <div>
          <strong>{selectedEdge.label}</strong>
        </div>
        <div>
          <strong>Issues:</strong>
          <ul>
            {selectedEdge.issues.length ? selectedEdge.issues.map((i, idx) => <li key={idx}>{i}</li>) : <li>None</li>}
          </ul>
        </div>
        <div>
          <strong>Suggestions:</strong>
          <ul>
            {selectedEdge.suggestions.length ? selectedEdge.suggestions.map((s, idx) => <li key={idx}>{s}</li>) : <li>None</li>}
          </ul>
        </div>
      </div>
    );
  }
  if (!selectedNode) return <div>Select a node or edge to see details.</div>;
  return (
    <div>
      <h3>Details for {selectedNode.label}</h3>
      <div>
        <strong>Issues:</strong>
        <ul>
          {selectedNode.issues.length ? selectedNode.issues.map((i, idx) => <li key={idx}>{i}</li>) : <li>None</li>}
        </ul>
      </div>
      <div>
        <strong>Suggestions:</strong>
        <ul>
          {selectedNode.suggestions.length ? selectedNode.suggestions.map((s, idx) => <li key={idx}>{s}</li>) : <li>None</li>}
        </ul>
      </div>
    </div>
  );
}

// Dependency Graph with zoom/pan/drag
function DependencyGraph({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  setSelectedNodeId,
  setSelectedEdgeId,
  theme,
}: {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  theme: 'dark' | 'light';
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 600 });
  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Zoom/pan handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 0.9 : 1.1;
    setViewBox(vb => ({
      x: vb.x * factor,
      y: vb.y * factor,
      w: vb.w * factor,
      h: vb.h * factor,
    }));
  };

  // Drag node handlers
  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    setDragging(id);
    setOffset({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setDragging(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - offset.x;
      const dy = e.clientY - offset.y;
      const node = nodes.find(n => n.id === dragging);
      if (node) {
        node.x += dx;
        node.y += dy;
        setOffset({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const nodeColor = theme === 'dark' ? '#263238' : '#e0f7fa';
  const edgeColor = theme === 'dark' ? '#00bcd4' : '#00796b';
  const textColor = theme === 'dark' ? '#fff' : '#222';

  return (
    <svg
      ref={svgRef}
      width={800}
      height={600}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      style={{ background: theme === 'dark' ? '#282c34' : '#f5f7fa', borderRadius: 8, cursor: dragging ? 'grabbing' : 'default' }}
      onWheel={handleWheel}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {/* Edges */}
      {edges.map(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return null;
        const hasIssue = edge.issues.length > 0;
        return (
          <g key={edge.id} onClick={() => { setSelectedEdgeId(edge.id); setSelectedNodeId(null); }} style={{ cursor: 'pointer' }}>
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={selectedEdgeId === edge.id ? '#ff9800' : hasIssue ? '#e53935' : edgeColor}
              strokeWidth={selectedEdgeId === edge.id ? 4 : 2}
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
            {hasIssue && (
              <circle cx={(source.x + target.x) / 2} cy={(source.y + target.y) / 2} r={8} fill="#e53935" />
            )}
          </g>
        );
      })}
      {/* Nodes */}
      {nodes.map(node => {
        const hasIssue = node.issues.length > 0;
        return (
          <g
            key={node.id}
            onClick={() => { setSelectedNodeId(node.id); setSelectedEdgeId(null); }}
            onMouseDown={e => handleMouseDown(node.id, e)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={28}
              fill={selectedNodeId === node.id ? '#ff9800' : hasIssue ? '#e53935' : nodeColor}
              stroke={selectedNodeId === node.id ? '#ff9800' : edgeColor}
              strokeWidth={selectedNodeId === node.id ? 4 : 2}
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
            {hasIssue && (
              <circle cx={node.x + 22} cy={node.y - 22} r={8} fill="#e53935" />
            )}
          </g>
        );
      })}
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const [data, setData] = useState<DependencyData>({ nodes: [], edges: [] });
  const [helpOpen, setHelpOpen] = useState(false);

  // Fetch dependency data
  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/api/dependencies')
      .then(res => res.json())
      .then(setData)
      .catch(() => setData({ nodes: [], edges: [] }));
  }, []);

  // Backend health check
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const checkBackend = () => {
      setBackendStatus('Checking...');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      fetch(process.env.REACT_APP_BACKEND_URL + '/api/health', { signal: controller.signal })
        .then(res => res.text())
        .then(data => setBackendStatus(data.trim() === "OK" ? 'Connected' : data))
        .catch(() => setBackendStatus('Error connecting to backend'))
        .finally(() => clearTimeout(timeout));
    };

    checkBackend();
    interval = setInterval(checkBackend, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredNodes = data.nodes.filter(n =>
    n.label.toLowerCase().includes(search.toLowerCase())
  );
  const selectedNode = data.nodes.find(n => n.id === selectedNodeId) || null;
  const selectedEdge = data.edges.find(e => e.id === selectedEdgeId) || null;

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
        <div style={{ marginLeft: 32, padding: '4px 12px', background: '#e0f7fa', color: '#222', borderRadius: 4, fontWeight: 500 }}>
          Backend status: {backendStatus}
        </div>
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
            onClick={() => {
              // Re-run analysis
              fetch(process.env.REACT_APP_BACKEND_URL + '/api/dependencies')
                .then(res => res.json())
                .then(setData)
                .catch(() => setData({ nodes: [], edges: [] }));
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
          <button
            onClick={() => setHelpOpen(true)}
            style={{
              background: '#fff',
              color: '#00bcd4',
              border: '1px solid #00bcd4',
              borderRadius: 4,
              padding: '6px 16px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Help
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
                  fontWeight: selectedNodeId === node.id ? 'bold' : 'normal',
                  background: selectedNodeId === node.id ? (theme === 'dark' ? '#263238' : '#e0f7fa') : undefined,
                  padding: '6px 10px',
                  borderRadius: 4,
                  marginBottom: 4,
                  transition: 'background 0.2s',
                  color: textColor
                }}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  setSelectedEdgeId(null);
                }}
              >
                {node.label}
              </li>
            ))}
          </ul>
          <Sidebar selectedNode={selectedNode} selectedEdge={selectedEdge} />
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
            {data.edges.map(edge => (
              <li
                key={edge.id}
                style={{
                  cursor: 'pointer',
                  background: selectedEdgeId === edge.id ? (theme === 'dark' ? '#263238' : '#e0f7fa') : undefined,
                  padding: '6px 10px',
                  borderRadius: 4,
                  marginBottom: 4,
                  transition: 'background 0.2s',
                  color: textColor,
                  fontWeight: edge.issues.length ? 'bold' : 'normal'
                }}
                onClick={() => {
                  setSelectedEdgeId(edge.id);
                  setSelectedNodeId(null);
                }}
              >
                {data.nodes.find(n => n.id === edge.source)?.label} &rarr; {data.nodes.find(n => n.id === edge.target)?.label} ({edge.label})
                {edge.issues.length > 0 && <span style={{ color: '#e53935', marginLeft: 8 }}>⚠️</span>}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 32 }}>
            <DependencyGraph
              nodes={data.nodes}
              edges={data.edges}
              selectedNodeId={selectedNodeId}
              selectedEdgeId={selectedEdgeId}
              setSelectedNodeId={setSelectedNodeId}
              setSelectedEdgeId={setSelectedEdgeId}
              theme={theme}
            />
          </div>
        </div>
      </div>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}