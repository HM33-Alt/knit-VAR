import { DependencyData } from './types';

export const demoDependencyData: DependencyData = {
  nodes: [
    { id: 'A', label: 'ServiceA', issues: [], suggestions: ['Consider grouping 3 dependencies'], x: 100, y: 100, severity: 'warning' },
    { id: 'B', label: 'ServiceB', issues: ['Part of cycle'], suggestions: ['Refactor to remove circular dependency'], x: 300, y: 100, severity: 'critical' },
    { id: 'C', label: 'ServiceC', issues: ['Part of cycle'], suggestions: ['Refactor to remove circular dependency'], x: 500, y: 100, severity: 'critical' },
    { id: 'D', label: 'ServiceD', issues: [], suggestions: [], x: 200, y: 300, severity: 'default' },
    { id: 'E', label: 'ServiceE', issues: ['Unused dependency'], suggestions: ['Remove this node if not needed'], x: 400, y: 300, severity: 'warning' },
    { id: 'F', label: 'ServiceF', issues: [], suggestions: ['Too many outgoing edges, consider splitting'], x: 600, y: 300, severity: 'warning' },
    { id: 'G', label: 'ServiceG', issues: [], suggestions: [], x: 350, y: 500, severity: 'default' },
  ],
  edges: [
    { id: 'A_B', source: 'A', target: 'B', label: 'depends on', issues: [], suggestions: [], thickness: 2 },
    { id: 'B_C', source: 'B', target: 'C', label: 'depends on', issues: ['Circular dependency'], suggestions: ['Break the cycle'], thickness: 3 },
    { id: 'C_B', source: 'C', target: 'B', label: 'depends on', issues: ['Circular dependency'], suggestions: ['Break the cycle'], thickness: 3 },
    { id: 'C_D', source: 'C', target: 'D', label: 'depends on', issues: [], suggestions: [], thickness: 2 },
    { id: 'D_E', source: 'D', target: 'E', label: 'depends on', issues: [], suggestions: [], thickness: 2 },
    { id: 'E_F', source: 'E', target: 'F', label: 'depends on', issues: ['Unnecessary edge'], suggestions: ['Remove unnecessary edge'], thickness: 2 },
    { id: 'F_G', source: 'F', target: 'G', label: 'depends on', issues: [], suggestions: [], thickness: 2 },
    { id: 'F_A', source: 'F', target: 'A', label: 'depends on', issues: [], suggestions: [], thickness: 2 },
  ],
};
