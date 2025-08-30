export type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  issues: string[];
  suggestions: string[];
};
export type Edge = {
  id: string;
  source: string;
  target: string;
  label: string;
  issues: string[];
  suggestions: string[];
};
export type DependencyData = {
  nodes: Node[];
  edges: Edge[];
};