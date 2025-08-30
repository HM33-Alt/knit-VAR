// Represents a node in the dependency graph
export type Node = {
  id: string;                       // Unique identifier for the node
  label: string;                    // Display name of the node
  x: number;                        // X position in the graph
  y: number;                        // Y position in the graph
  issues: string[];                 // List of issues related to this node
  suggestions: string[];            // List of suggestions for improvement
  severity: 'default' | 'warning' | 'critical'; // Visual severity level
};

// Represents an edge (dependency) between nodes
export type Edge = {
  id: string;                       // Unique identifier for the edge
  source: string;                   // ID of the source node
  target: string;                   // ID of the target node
  label: string;                    // Display label for the edge
  issues: string[];                 // List of issues related to this edge
  suggestions: string[];            // List of suggestions for improvement
  thickness: number;                // Visual thickness of the edge
};

// Overall structure containing all nodes and edges
export type DependencyData = {
  nodes: Node[];                    // Array of nodes in the graph
  edges: Edge[];                    // Array of edges in the graph
};
