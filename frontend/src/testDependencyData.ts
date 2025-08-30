export const testDependencyData = {
  nodes: [
    { id: 'A', label: 'Module A', x: 100, y: 100, issues: [], suggestions: [] },
    { id: 'B', label: 'Module B', x: 300, y: 100, issues: [], suggestions: [] },
    { id: 'C', label: 'Module C', x: 200, y: 300, issues: [], suggestions: [] },
  ],
  edges: [
    { id: 'e1', source: 'A', target: 'B', label: 'A depends on B', issues: [], suggestions: [] },
    { id: 'e2', source: 'B', target: 'C', label: 'B depends on C', issues: [], suggestions: [] },
    { id: 'e3', source: 'C', target: 'A', label: 'C depends on A', issues: [], suggestions: [] }, // cycle
    { id: 'e4', source: 'A', target: 'C', label: 'A directly depends on C', issues: [], suggestions: [] }, // unnecessary
  ],
};