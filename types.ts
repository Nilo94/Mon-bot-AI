export const AgentStatus = {
  IDLE: 'IDLE',
  WORKING: 'WORKING',
  WAITING: 'WAITING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
} as const;

export type AgentStatus = typeof AgentStatus[keyof typeof AgentStatus];

export const AgentId = {
  A1_0: 'Agent 1.0',
  A1_1: 'Agent 1.1',
  A1_2: 'Agent 1.2',
  A1_3: 'Agent 1.3',
  A1_4: 'Agent 1.4',
  A1_5: 'Agent 1.5',
} as const;

export type AgentId = typeof AgentId[keyof typeof AgentId];

export interface AgentDef {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  icon: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  agentId: AgentId;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Prospect {
  id: string;
  email: string;
  organization: string;
  region: string;
  source: 'Web Scraping' | 'Indeed' | 'LinkedIn';
  status: 'PENDING' | 'DRAFTED' | 'VALIDATED' | 'REJECTED' | 'SENT';
  draftSubject?: string;
  draftBody?: string;
  qualityCheck?: {
    approved: boolean;
    feedback: string;
  };
}

export interface WorkflowStats {
  totalProspects: number;
  emailsDrafted: number;
  validationsPassed: number;
  cvOptimizations: number;
  startTime: number | null;
  endTime: number | null;
}

export interface SimulationState {
  isActive: boolean;
  currentAgent: AgentId | null;
  logs: LogEntry[];
  prospects: Prospect[];
  stats: WorkflowStats;
  optimizedCV: string | null;
  finalReport: string | null;
}