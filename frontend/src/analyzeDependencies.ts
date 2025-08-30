// --- Analysis Logic ---
import { DependencyData } from './types';

export function analyzeDependencies(data: DependencyData): DependencyData {
  const cycles: string[][] = [];
  const visited: Record<string, boolean> = {};
  const stack: string[] = [];
  function dfs(nodeId: string) {
    if (stack.includes(nodeId)) {
      const cycleStart = stack.indexOf(nodeId);
      cycles.push([...stack.slice(cycleStart), nodeId]);
      return;
    }
    if (visited[nodeId]) return;
    visited[nodeId] = true;
    stack.push(nodeId);
    data.edges.filter(e => e.source === nodeId).forEach(e => dfs(e.target));
    stack.pop();
  }
  data.nodes.forEach(n => {
    Object.keys(visited).forEach(k => (visited[k] = false));
    dfs(n.id);
  });

  const edgeIssues: Record<string, string[]> = {};
  cycles.forEach(cycle => {
    for (let i = 0; i < cycle.length - 1; i++) {
      const edge = data.edges.find(e => e.source === cycle[i] && e.target === cycle[i + 1]);
      if (edge) {
        edgeIssues[edge.id] = edgeIssues[edge.id] || [];
        edgeIssues[edge.id].push('Circular dependency');
      }
    }
  });

  const necessaryEdges = new Set<string>();
  data.nodes.forEach(start => {
    const queue: { id: string; path: string[] }[] = [{ id: start.id, path: [] }];
    const visited: Record<string, boolean> = {};
    while (queue.length) {
      const { id, path } = queue.shift()!;
      if (visited[id]) continue;
      visited[id] = true;
      data.edges.filter(e => e.source === id).forEach(e => {
        necessaryEdges.add(e.id);
        queue.push({ id: e.target, path: path.concat([e.id]) });
      });
    }
  });
  data.edges.forEach(e => {
    if (!necessaryEdges.has(e.id)) {
      edgeIssues[e.id] = edgeIssues[e.id] || [];
      edgeIssues[e.id].push('Unnecessary edge');
    }
  });

  const suggestionsByNode: Record<string, string[]> = {};
  data.nodes.forEach(node => {
    const outgoing = data.edges.filter(e => e.source === node.id).map(e => e.target);
    if (outgoing.length > 3) {
      suggestionsByNode[node.id] = [`Consider grouping ${outgoing.length} dependencies.`];
    }
  });

  const suggestionsByEdge: Record<string, string[]> = {};
  data.edges.forEach(e => {
    if (e.issues.includes('Unnecessary edge')) {
      suggestionsByEdge[e.id] = ['Remove unnecessary edge for clarity/performance.'];
    }
  });

  return {
    nodes: data.nodes.map(n => ({
      ...n,
      issues: cycles.some(cycle => cycle.includes(n.id)) ? ['Part of cycle'] : [],
      suggestions: suggestionsByNode[n.id] || [],
    })),
    edges: data.edges.map(e => ({
      ...e,
      issues: edgeIssues[e.id] || [],
      suggestions: suggestionsByEdge[e.id] || [],
    })),
  };
}