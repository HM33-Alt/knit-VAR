import React, { useState } from 'react';
import { Node, Edge, DependencyData } from './types';

export function DependencyGraph({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  setSelectedNodeId,
  setSelectedEdgeId,
  theme,
  svgRef,
  setData,
}: {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  theme: 'dark' | 'light';
  svgRef: React.RefObject<SVGSVGElement | null>;
  setData: React.Dispatch<React.SetStateAction<DependencyData>>;
}) {
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 600 });
  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  const nodesWithCoords = nodes.map((n, i) => ({
    ...n,
    x: n.x ?? (100 + (i % 5) * 200),
    y: n.y ?? (100 + Math.floor(i / 5) * 200),
    issues: n.issues ?? [],
    suggestions: n.suggestions ?? [],
    severity: n.severity ?? 'default', // new field from backend
  }));

  const edgesWithDefaults = edges.map(e => ({
    ...e,
    label: e.label ?? 'depends on',
    issues: e.issues ?? [],
    suggestions: e.suggestions ?? [],
    thickness: e.thickness ?? 2,
  }));

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

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    setDragging(id);
    setOffset({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setDragging(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - offset.x;
      const dy = e.clientY - offset.y;
      setOffset({ x: e.clientX, y: e.clientY });
      setData((prev: DependencyData) => ({
        ...prev,
        nodes: prev.nodes.map((n: Node) =>
          n.id === dragging ? { ...n, x: n.x + dx, y: n.y + dy } : n
        )
      }));
    }
  };

  const nodeColor = (node: Node) => {
    switch (node.severity) {
      case 'critical': return '#e53935';
      case 'warning': return '#ffa726';
      default: return theme === 'dark' ? '#263238' : '#e0f7fa';
    }
  };
  const edgeColor = (edge: Edge) => edge.issues.length > 0 ? '#e53935' : (theme === 'dark' ? '#00bcd4' : '#00796b');
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
      {edgesWithDefaults.map(edge => {
        const source = nodesWithCoords.find(n => n.id === edge.source);
        const target = nodesWithCoords.find(n => n.id === edge.target);
        if (!source || !target) return null;

        return (
          <g
            key={edge.id}
            tabIndex={0}
            aria-label={`Edge ${edge.label} from ${source.label} to ${target.label}`}
            onClick={() => { setSelectedEdgeId(edge.id); setSelectedNodeId(null); }}
            onMouseEnter={() => setHoveredEdgeId(edge.id)}
            onMouseLeave={() => setHoveredEdgeId(null)}
            style={{ cursor: 'pointer', outline: selectedEdgeId === edge.id ? '2px solid #00bcd4' : 'none' }}
          >
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={
                hoveredEdgeId === edge.id
                  ? '#00bcd4'
                  : selectedEdgeId === edge.id
                  ? '#ff9800'
                  : edgeColor(edge)
              }
              strokeWidth={
                hoveredEdgeId === edge.id
                  ? edge.thickness + 2
                  : selectedEdgeId === edge.id
                  ? edge.thickness + 1
                  : edge.thickness
              }
              markerEnd="url(#arrowhead)"
            />
            <text
              x={(source.x + target.x) / 2}
              y={(source.y + target.y) / 2 - 10}
              fill={textColor}
              fontSize={12}
              textAnchor="middle"
              fontWeight="bold"
            >
              {edge.label}
            </text>
            {edge.issues.length > 0 && (
              <circle cx={(source.x + target.x) / 2 + 22} cy={(source.y + target.y) / 2 - 22} r={8} fill="#e53935" />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodesWithCoords.map(node => (
        <g
          key={node.id}
          tabIndex={0}
          aria-label={`Node ${node.label}`}
          onClick={() => { setSelectedNodeId(node.id); setSelectedEdgeId(null); }}
          onMouseDown={e => handleMouseDown(node.id, e)}
          onMouseEnter={() => setHoveredNodeId(node.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
          style={{ cursor: 'pointer', outline: selectedNodeId === node.id ? '2px solid #00bcd4' : 'none' }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r={28}
            fill={hoveredNodeId === node.id ? '#00bcd4' : selectedNodeId === node.id ? '#ff9800' : nodeColor(node)}
            stroke={hoveredNodeId === node.id ? '#00bcd4' : selectedNodeId === node.id ? '#ff9800' : theme === 'dark' ? '#00bcd4' : '#00796b'}
            strokeWidth={hoveredNodeId === node.id ? 5 : selectedNodeId === node.id ? 4 : 2}
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
          {node.issues.length > 0 && (
            <circle cx={node.x + 22} cy={node.y - 22} r={8} fill="#e53935" />
          )}
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
          <polygon points="0 0, 10 3.5, 0 7" fill={theme === 'dark' ? '#00bcd4' : '#00796b'} />
        </marker>
      </defs>
    </svg>
  );
}