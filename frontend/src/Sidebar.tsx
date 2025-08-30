import React, { useState, useEffect } from 'react';
import { Node, Edge } from './types';

export function Sidebar({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge
}: {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onUpdateNode: (node: Node) => void;
  onUpdateEdge: (edge: Edge) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    setLabel(selectedNode?.label || selectedEdge?.label || '');
    setEditMode(false);
  }, [selectedNode, selectedEdge]);

  if (selectedEdge) {
    return (
      <div>
        <h3>Edge Details</h3>
        {editMode ? (
          <>
            <input value={label} onChange={e => setLabel(e.target.value)} />
            <button onClick={() => { onUpdateEdge({ ...selectedEdge, label }); setEditMode(false); }}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <div>
              <strong>{selectedEdge.label}</strong>
              <button onClick={() => setEditMode(true)} style={{ marginLeft: 8 }}>Edit</button>
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
          </>
        )}
      </div>
    );
  }
  if (!selectedNode) return <div>Select a node or edge to see details.</div>;
  return (
    <div>
      <h3>Details for {selectedNode.label}</h3>
      {editMode ? (
        <>
          <input value={label} onChange={e => setLabel(e.target.value)} />
          <button onClick={() => { onUpdateNode({ ...selectedNode, label }); setEditMode(false); }}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <div>
            <strong>Label:</strong> {selectedNode.label}
            <button onClick={() => setEditMode(true)} style={{ marginLeft: 8 }}>Edit</button>
          </div>
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
        </>
      )}
    </div>
  );
}