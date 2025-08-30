export type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  issues: string[];
  suggestions: string[];
  severity: 'default' | 'warning' | 'critical';
};

export type Edge = {
  id: string;
  source: string;
  target: string;
  label: string;
  issues: string[];
  suggestions: string[];
  thickness: number;
};

export type DependencyData = {
  nodes: Node[];
  edges: Edge[];
};