import React, { useState, useRef } from 'react';
import { KnitUpload } from './KnitUpload';
import { HelpModal } from './HelpModal';
import { Sidebar } from './Sidebar';
import { DependencyGraph } from './DependencyGraph';
import { DependencyData, Node, Edge } from './types';
import { demoDependencyData } from './demoDependencyData';

export default function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [data, setData] = useState<DependencyData>(demoDependencyData);
  const [helpOpen, setHelpOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'warning' | 'critical'>('all');
  const svgRef = useRef<SVGSVGElement>(null);

  const handleUpdateNode = async (updatedNode: Node) => {
    setData(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === updatedNode.id ? updatedNode : n)
    }));

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/nodes/${updatedNode.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNode)
      });
    } catch {}
  };

  const handleUpdateEdge = async (updatedEdge: Edge) => {
    setData(prev => ({
      ...prev,
      edges: prev.edges.map(e => e.id === updatedEdge.id ? updatedEdge : e)
    }));

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/edges/${updatedEdge.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEdge)
      });
    } catch {}
  };

  const handleSetData = (updater: React.SetStateAction<DependencyData>) => {
    setData(updater);
  };

  // Filter nodes by search & severity
  const filteredNodes = data.nodes.filter(n =>
    n.label.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || (filter === 'warning' && n.issues.includes('warning')) || (filter === 'critical' && n.issues.includes('critical')))
  );

  const filteredEdges = data.edges.filter(e =>
    filter === 'all' || (filter === 'warning' && e.issues.includes('warning')) || (filter === 'critical' && e.issues.includes('critical'))
  );

  const selectedNode = data.nodes.find(n => n.id === selectedNodeId) || null;
  const selectedEdge = data.edges.find(e => e.id === selectedEdgeId) || null;

  const bgColor = theme === 'dark' ? '#23272e' : '#f5f7fa';
  const sidebarBg = theme === 'dark' ? '#20232a' : '#fff';
  const sidebarBorder = theme === 'dark' ? '#2c313c' : '#eee';
  const mainBg = theme === 'dark' ? '#282c34' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#222';

  const handleExportSVG = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dependency-graph.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dependency-graph.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csv = 'source,target,label,issues,suggestions\n';
    data.edges.forEach(e => {
      csv += `${e.source},${e.target},${e.label},"${e.issues.join(';')}","${e.suggestions.join(';')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dependency-graph.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: 1 }}>Knit-VAR Visualizer</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
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
          <button
            onClick={handleExportSVG}
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
            Export SVG
          </button>
          <button
            onClick={handleExportJSON}
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
            Export JSON
          </button>
          <button
            onClick={handleExportCSV}
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
            Export CSV
          </button>
          <select value={filter} onChange={e => setFilter(e.target.value as any)} style={{ padding: 6, borderRadius: 4 }}>
            <option value="all">All</option>
            <option value="warning">Warnings</option>
            <option value="critical">Critical</option>
          </select>
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
          <Sidebar
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onUpdateNode={handleUpdateNode}
            onUpdateEdge={handleUpdateEdge}
          />
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
          <div style={{ marginBottom: 24 }}>
            <KnitUpload
              onDataLoaded={(processedData) => {
                const columns = 5;
                const spacingX = 200;
                const spacingY = 200;
                const startX = 800 - ((Math.min(processedData.nodes.length, columns) - 1) / 2) * spacingX;
                const startY = 500 - (Math.floor((processedData.nodes.length - 1) / columns) / 2) * spacingY;
                const positionedNodes = processedData.nodes.map((node, idx) => ({
                  ...node,
                  x: node.x ?? 100 + (idx % columns) * spacingX,
                  y: node.y ?? 100 + Math.floor(idx / columns) * spacingY,
                }));
                setData({ ...processedData, nodes: positionedNodes });
              }}
            />
          </div>
          <h3 style={{ color: '#00bcd4', marginBottom: 16 }}>Edges</h3>
          <ul>
            {filteredEdges.map(edge => (
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
              svgRef={svgRef}
              setData={handleSetData}
            />
          </div>
        </div>
      </div>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}