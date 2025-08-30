/**
 * Portions of this file may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */

import React, { useState, useEffect } from 'react';
import { Node, Edge } from './types';

/**
 * Sidebar component to display and edit details of selected Node or Edge.
 * @param selectedNode Currently selected Node (or null)
 * @param selectedEdge Currently selected Edge (or null)
 * @param onUpdateNode Callback to update node information
 * @param onUpdateEdge Callback to update edge information
 */
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
  // Local state for edit mode
  const [editMode, setEditMode] = useState(false);
  // Local state to store editable label
  const [label, setLabel] = useState('');

  // Whenever selection changes, reset edit mode and label
  useEffect(() => {
    setLabel(selectedNode?.label || selectedEdge?.label || '');
    setEditMode(false);
  }, [selectedNode, selectedEdge]);

  // If an edge is selected, display edge details
  if (selectedEdge) {
    return (
      <div>
        <h3>Edge Details</h3>
        {editMode ? (
          <>
            {/* Editable input for edge label */}
            <input value={label} onChange={e => setLabel(e.target.value)} />
            <button
              onClick={() => {
                onUpdateEdge({ ...selectedEdge, label });
                setEditMode(false);
              }}
            >
              Save
            </button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <div>
              <strong>{selectedEdge.label}</strong>
              <button onClick={() => setEditMode(true)} style={{ marginLeft: 8 }}>
                Edit
              </button>
            </div>
            <div>
              <strong>Issues:</strong>
              <ul>
                {selectedEdge.issues.length
                  ? selectedEdge.issues.map((i, idx) => <li key={idx}>{i}</li>)
                  : <li>None</li>}
              </ul>
            </div>
            <div>
              <strong>Suggestions:</strong>
              <ul>
                {selectedEdge.suggestions.length
                  ? selectedEdge.suggestions.map((s, idx) => <li key={idx}>{s}</li>)
                  : <li>None</li>}
              </ul>
            </div>
          </>
        )}
      </div>
    );
  }

  // If nothing is selected, show placeholder
  if (!selectedNode) return <div>Select a node or edge to see details.</div>;

  // Display details for selected node
  return (
    <div>
      <h3>Details for {selectedNode.label}</h3>
      {editMode ? (
        <>
          {/* Editable input for node label */}
          <input value={label} onChange={e => setLabel(e.target.value)} />
          <button
            onClick={() => {
              onUpdateNode({ ...selectedNode, label });
              setEditMode(false);
            }}
          >
            Save
          </button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <div>
            <strong>Label:</strong> {selectedNode.label}
            <button onClick={() => setEditMode(true)} style={{ marginLeft: 8 }}>
              Edit
            </button>
          </div>
          <div>
            <strong>Issues:</strong>
            <ul>
              {selectedNode.issues.length
                ? selectedNode.issues.map((i, idx) => <li key={idx}>{i}</li>)
                : <li>None</li>}
            </ul>
          </div>
          <div>
            <strong>Suggestions:</strong>
            <ul>
              {selectedNode.suggestions.length
                ? selectedNode.suggestions.map((s, idx) => <li key={idx}>{s}</li>)
                : <li>None</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
