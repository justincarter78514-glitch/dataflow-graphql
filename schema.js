const { buildSchema } = require('graphql');

const schema = buildSchema(`
  enum NodeShape {
    DIAMOND
    CIRCLE
    RECTANGLE
  }

  enum EdgeStyle {
    SOLID
    DASHED
  }

  type NodeData {
    id: ID!
    label: String!
    shape: NodeShape!
    imageUrl: String!
    x: Float!
    y: Float!
  }

  type Edge {
    id: ID!
    source: ID!
    target: ID!
    style: EdgeStyle!
  }

  type DataFlowGraph {
    nodes: [NodeData!]!
    edges: [Edge!]!
  }

  type Query {
    graph: DataFlowGraph!
    node(id: ID!): NodeData
    edges(nodeId: ID): [Edge!]!
  }
`);

// Each cluster uses a distinct placeholder image color via picsum/via.placeholder
// Replace imageUrl values with any real URL you like
const nodes = [
  // ── LEFT CLUSTER (blue tones) ──────────────────────────────────────
  { id: 'L1', label: 'Auth Service',   shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4f80c8/fff?text=L1', x: 175, y: 148 },
  { id: 'L2', label: 'API Gateway',    shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4f80c8/fff?text=L2', x: 390, y: 148 },
  { id: 'L3', label: 'Cache Layer',    shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4f80c8/fff?text=L3', x: 175, y: 400 },
  { id: 'L4', label: 'Load Balancer',  shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4f80c8/fff?text=L4', x: 390, y: 400 },

  // ── CENTER (orange tones) ──────────────────────────────────────────
  { id: 'C1', label: 'Message Broker', shape: 'CIRCLE',    imageUrl: 'https://via.placeholder.com/56x40/e07b39/fff?text=HUB', x: 565, y: 270 },
  { id: 'C2', label: 'Data Store',     shape: 'RECTANGLE', imageUrl: 'https://via.placeholder.com/64x36/e07b39/fff?text=DB',  x: 565, y: 470 },

  // ── RIGHT CLUSTER (green tones) ────────────────────────────────────
  { id: 'R1', label: 'Analytics',      shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4caf7d/fff?text=R1', x: 730, y: 148 },
  { id: 'R2', label: 'Reporting',      shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4caf7d/fff?text=R2', x: 940, y: 148 },
  { id: 'R3', label: 'Processor A',    shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4caf7d/fff?text=R3', x: 720, y: 295 },
  { id: 'R4', label: 'Processor B',    shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4caf7d/fff?text=R4', x: 820, y: 310 },
  { id: 'R5', label: 'Processor C',    shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4caf7d/fff?text=R5', x: 915, y: 295 },
  { id: 'R6', label: 'Event Stream',   shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4caf7d/fff?text=R6', x: 720, y: 415 },
  { id: 'R7', label: 'Output Handler', shape: 'DIAMOND',   imageUrl: 'https://via.placeholder.com/48x32/4caf7d/fff?text=R7', x: 940, y: 390 },
];

const edges = [
  // ── LEFT CLUSTER internal (solid, no direction arrow) ──────────────
  { id: 'e1',  source: 'L1', target: 'L2', style: 'SOLID' },
  { id: 'e2',  source: 'L1', target: 'L3', style: 'SOLID' },
  { id: 'e3',  source: 'L3', target: 'L4', style: 'SOLID' },

  // ── CENTER internal (solid) ────────────────────────────────────────
  { id: 'e4',  source: 'C1', target: 'C2', style: 'SOLID' },

  // ── RIGHT CLUSTER internal (solid) ────────────────────────────────
  { id: 'e5',  source: 'R1', target: 'R2', style: 'SOLID' },
  { id: 'e6',  source: 'R2', target: 'R7', style: 'SOLID' },
  { id: 'e7',  source: 'R3', target: 'R4', style: 'SOLID' },
  { id: 'e8',  source: 'R4', target: 'R5', style: 'SOLID' },
  { id: 'e9',  source: 'R6', target: 'R7', style: 'SOLID' },
  { id: 'e10', source: 'R3', target: 'R6', style: 'SOLID' },

  // ── DASHED directed: source → target (arrowhead at target) ─────────
  // Change source/target here to control flow direction
  { id: 'd1', source: 'C1', target: 'L2', style: 'DASHED' },  // hub → top-left
  { id: 'd2', source: 'C1', target: 'L4', style: 'DASHED' },  // bottom-left → hub
  { id: 'd3', source: 'C1', target: 'R1', style: 'DASHED' },  // hub → top-right
  { id: 'd4', source: 'R6', target: 'C1', style: 'DASHED' },  // bottom-right → hub
];

const root = {
  graph: () => ({ nodes, edges }),
  node: ({ id }) => nodes.find(n => n.id === id) || null,
  edges: ({ nodeId }) =>
    nodeId ? edges.filter(e => e.source === nodeId || e.target === nodeId) : edges,
};

module.exports = { schema, root };
