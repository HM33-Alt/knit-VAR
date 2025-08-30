import { DependencyData, Node, Edge } from './types';

/**
 * Analyzes dependencies for Knit DI Kotlin files and enriches them with:
 * - Circular dependency detection
 * - Unused dependency detection
 * - Suggestions for large number of outgoing edges
 * - Severity assignment for critical vs warning
 */
export function analyzeDependencies(data: DependencyData): DependencyData {
  // Map nodes by id for quick lookup
  const nodesMap: Record<string, Node> = {};
  // Clone edges to avoid mutating input
  const edges: Edge[] = data.edges.map(e => ({ ...e }));

  // Initialize nodes with default properties
  data.nodes.forEach(n => {
    nodesMap[n.id] = {
      ...n,
      issues: n.issues ?? [],
      suggestions: n.suggestions ?? [],
      x: n.x ?? 0,
      y: n.y ?? 0,
      severity: 'default'
    };
  });

  // --- 1. Detect cycles using DFS ---
  const visited: Record<string, boolean> = {};
  const stack: string[] = [];
  const cycles: string[][] = [];

  // Recursive DFS to detect cycles
  function dfs(nodeId: string) {
    if (stack.includes(nodeId)) {
      // Found a cycle
      const start = stack.indexOf(nodeId);
      cycles.push([...stack.slice(start), nodeId]);
      return;
    }
    if (visited[nodeId]) return;

    visited[nodeId] = true;
    stack.push(nodeId);
    // Recurse through outgoing edges
    edges.filter(e => e.source === nodeId).forEach(e => dfs(e.target));
    stack.pop();
  }

  // Run DFS on all nodes
  Object.keys(nodesMap).forEach(nodeId => {
    Object.keys(visited).forEach(k => (visited[k] = false));
    dfs(nodeId);
  });

  // --- 2. Detect unused edges ---
  const necessaryEdges = new Set<string>();

  // Mark all edges reachable from any node as necessary
  Object.values(nodesMap).forEach(start => {
    const queue: string[] = [start.id];
    const visitedNodes: Record<string, boolean> = {};
    while (queue.length) {
      const id = queue.shift()!;
      if (visitedNodes[id]) continue;
      visitedNodes[id] = true;
      edges.filter(e => e.source === id).forEach(e => {
        necessaryEdges.add(e.id);
        queue.push(e.target);
      });
    }
  });

  // --- 3. Assign issues and suggestions ---
  const edgeIssues: Record<string, string[]> = {};
  const suggestionsByNode: Record<string, string[]> = {};
  const suggestionsByEdge: Record<string, string[]> = {};

  // Check each edge for cycles or unnecessary dependencies
  edges.forEach(e => {
    const issues: string[] = [];

    // Check if edge is part of a cycle
    if (cycles.some(cycle => cycle.some((n, i) => i < cycle.length - 1 && cycle[i] === e.source && cycle[i + 1] === e.target))) {
      issues.push('Circular dependency');
    }

    // Check if edge is unused
    if (!necessaryEdges.has(e.id)) {
      issues.push('Unused dependency');
      suggestionsByEdge[e.id] = ['Consider removing this dependency.'];
    }

    if (issues.length > 0) {
      edgeIssues[e.id] = issues;
    }
  });

  // Add suggestions for nodes with many outgoing edges
  Object.values(nodesMap).forEach(node => {
    const outgoing = edges.filter(e => e.source === node.id).length;
    if (outgoing > 3) {
      suggestionsByNode[node.id] = [`Consider grouping ${outgoing} dependencies.`];
    }
  });

  // Assign severity for nodes
  Object.values(nodesMap).forEach(node => {
    const nodeInCycle = cycles.some(cycle => cycle.includes(node.id));
    if (nodeInCycle) {
      node.severity = 'critical';
    } else if ((edges.filter(e => e.source === node.id).length || 0) > 3) {
      node.severity = 'warning';
    } else {
      node.severity = 'default';
    }
  });

  // --- 4. Return enriched data ---
  return {
    nodes: Object.values(nodesMap).map((n, idx) => ({
      ...n,
      issues: (cycles.some(cycle => cycle.includes(n.id)) ? ['Part of cycle'] : n.issues) ?? [],
      suggestions: suggestionsByNode[n.id] ?? n.suggestions,
      // Set default grid positions if missing
      x: n.x ?? 100 + (idx % 5) * 200,
      y: n.y ?? 100 + Math.floor(idx / 5) * 200
    })),
    edges: edges.map(e => ({
      ...e,
      issues: edgeIssues[e.id] ?? e.issues ?? [],
      suggestions: suggestionsByEdge[e.id] ?? e.suggestions ?? [],
      label: e.label || 'depends on',
      // Thicker edge for cycles
      thickness: edgeIssues[e.id]?.includes('Circular dependency') ? 4 : 2
    }))
  };
}