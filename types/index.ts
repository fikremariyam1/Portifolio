// ─── Core OS Types ───────────────────────────────────────────────────────────

export type AppId =
  | 'projects'
  | 'about'
  | 'lab'
  | 'skills'
  | 'creative'
  | 'contact'
  | 'terminal'
  | 'secret';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

// ─── Project Types ────────────────────────────────────────────────────────────

export type ProjectCategory = 'PRODUCTION' | 'ENGINEERING' | 'EXPERIMENTS' | 'CREATIVE';

export interface ArchNode {
  id: string;
  label: string;
  type: 'frontend' | 'backend' | 'api' | 'database' | 'auth' | 'ai' | 'webrtc' | 'external' | 'processing';
  description: string;
  technologies: string[];
  x: number;
  y: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface ProjectArchitecture {
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: ProjectCategory;
  overview: string;
  problem: string;
  solution: string;
  technologies: string[];
  engineeringDecisions: string[];
  challenges: string[];
  architecture: ProjectArchitecture;
  githubUrl?: string;
  demoUrl?: string;
  status: 'live' | 'development' | 'archived';
  year: number;
}

// ─── Skills Types ─────────────────────────────────────────────────────────────

export type SkillCategory =
  | 'FULL STACK'
  | 'BACKEND'
  | 'FRONTEND'
  | 'AI'
  | 'SYSTEMS'
  | 'NETWORKING'
  | 'DATABASES'
  | 'DEVOPS'
  | 'CREATIVE';

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  usedIn: string[]; // project ids
  connectedTo: string[]; // skill ids
  context: string;
  confidence: 'proficient' | 'experienced' | 'familiar';
}

// ─── Portfolio / About Types ───────────────────────────────────────────────────

export interface TimelineEntry {
  year: number;
  title: string;
  description: string;
  tags: string[];
}

export interface ContactLink {
  label: string;
  value: string;
  url: string;
  icon: string;
}

// ─── Command Palette Types ────────────────────────────────────────────────────

export interface Command {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  action: () => void;
  icon?: string;
}

// ─── Easter Egg Types ─────────────────────────────────────────────────────────

export interface EasterEgg {
  id: string;
  name: string;
  description: string;
  discovered: boolean;
}

// ─── Network Simulator Types ──────────────────────────────────────────────────

export type NetworkNodeType = 'PC' | 'ROUTER' | 'SWITCH' | 'SERVER';

export interface NetworkNode {
  id: string;
  type: NetworkNodeType;
  label: string;
  x: number;
  y: number;
}

export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
}

export interface PacketTrace {
  source: string;
  destination: string;
  hops: string[];
  latency: number;
  status: 'sending' | 'delivered' | 'failed';
}

// ─── Chat / AI Types ──────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
