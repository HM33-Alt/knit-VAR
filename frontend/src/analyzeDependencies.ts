import { DependencyData, Node, Edge } from './types';

/**
 * Analyzes dependencies for Knit DI Kotlin files.
 */
export function analyzeDependencies(data: DependencyData): DependencyData {
  // Copy nodes and edges
  const nodesMap: Record<string, Node> = {};
  const edges: Edge[] = data.edges.map(e => ({ ...e }));

  data.nodes.forEach(n => {
    nodesMap[n.id] = {
      ...n,
      issues: n.issues ?? [],
      suggestions: n.suggestions ?? [],
      x: n.x ?? 0,
      y: n.y ?? 0
    };
  });

  // --- 1. Detect cycles ---
  const visited: Record<string, boolean> = {};
  const stack: string[] = [];
  const cycles: string[][] = [];

  function dfs(nodeId: string) {
    if (stack.includes(nodeId)) {
      const start = stack.indexOf(nodeId);
      cycles.push([...stack.slice(start), nodeId]);
      return;
    }
    if (visited[nodeId]) return;
    visited[nodeId] = true;
    edges
      .filter(e => e.source === nodeId)
      .forEach(e => dfs(e.target));
    stack.pop();
  }

  Object.keys(nodesMap).forEach(nodeId => {
    Object.keys(visited).forEach(k => (visited[k] = false));
    dfs(nodeId);
  });

  // --- 2. Mark edge issues (cycles, unnecessary edges) ---
  const edgeIssues: Record<string, string[]> = {};

  // Cycle edges
  cycles.forEach(cycle => {
    for (let i = 0; i < cycle.length - 1; i++) {
      const edge = edges.find(e => e.source === cycle[i] && e.target === cycle[i + 1]);
      if (edge) {
        edgeIssues[edge.id] = edgeIssues[edge.id] || [];
        edgeIssues[edge.id].push('Circular dependency');
      }
    }
  });

  // Necessary edges check (basic BFS)
  const necessaryEdges = new Set<string>();
  Object.values(nodesMap).forEach(start => {
    const queue: { id: string }[] = [{ id: start.id }];
    const visitedNodes: Record<string, boolean> = {};
    while (queue.length) {
      const { id } = queue.shift()!;
      if (visitedNodes[id]) continue;
      visitedNodes[id] = true;
      edges
        .filter(e => e.source === id)
        .forEach(e => {
          necessaryEdges.add(e.id);
          queue.push({ id: e.target });
        });
    }
  });

  edges.forEach(e => {
    if (!necessaryEdges.has(e.id)) {
      edgeIssues[e.id] = edgeIssues[e.id] || [];
      edgeIssues[e.id].push('Unnecessary edge');
    }
  });

  // --- 3. Node suggestions ---
  const suggestionsByNode: Record<string, string[]> = {};
  Object.values(nodesMap).forEach(node => {
    const outgoing = edges.filter(e => e.source === node.id).length;
    if (outgoing > 3) {
      suggestionsByNode[node.id] = [`Consider grouping ${outgoing} dependencies.`];
    }
  });

  // --- 4. Edge suggestions ---
  const suggestionsByEdge: Record<string, string[]> = {};
  edges.forEach(e => {
    if (edgeIssues[e.id]?.includes('Unnecessary edge')) {
      suggestionsByEdge[e.id] = ['Remove unnecessary edge for clarity/performance.'];
    }
  });

  // --- 5. Return processed data ---
  return {
    nodes: Object.values(nodesMap).map((n, idx) => ({
      ...n,
      issues: (cycles.some(cycle => cycle.includes(n.id)) ? ['Part of cycle'] : n.issues) ?? [],
      suggestions: (suggestionsByNode[n.id] || n.suggestions) ?? [],
      x: n.x ?? 100 + (idx % 5) * 200,
      y: n.y ?? 100 + Math.floor(idx / 5) * 200
    })),
    edges: edges.map(e => ({
      ...e,
      issues: (edgeIssues[e.id] || e.issues) ?? [],
      suggestions: (suggestionsByEdge[e.id] || e.suggestions) ?? [],
      label: e.label || 'depends on'
    }))
  };
}
