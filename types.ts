
export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  salary: number;
  stats: {
    physicalStrength: number; // 1-10
    communication: number; // 1-10
    observation: number; // 1-10
    reliability: number; // %
    focusSustainability: number; // %
    quitRisk: number; // %
  };
  currentFocus: number; // Initially 100% of focusSustainability
}

export interface Gate {
  id: number;
  isOpen: boolean;
  isSecurityGate: boolean;
  queue: Guest[];
  assignedStaff: StaffMember[];
}

export interface Guest {
  id: string;
  state: 'WaitingOutside' | 'InQueue' | 'Processing' | 'Inside' | 'Rejected' | 'Ejected';
  hasFakeId: boolean;
  hasFakeTicket: boolean;
  isMTE: boolean; // Major Threat Entity
  aggression: number; // 1-10
}

export enum GamePhase {
  Hiring = 'HIRING',
  Assignment = 'ASSIGNMENT',
  EventBriefing = 'EVENT_BRIEFING',
  Event = 'EVENT',
  PostEvent = 'POST_EVENT',
  GameOver = 'GAME_OVER',
}

export enum LogSeverity {
  Info = 'INFO',
  Warning = 'WARNING',
  Critical = 'CRITICAL',
}

export interface EventLogMessage {
  id: string;
  time: string;
  message: string;
  severity: LogSeverity;
}

export interface EventReport {
  guestsProcessed: number;
  incidentsPrevented: number;
  incidentsMissed: number;
  reputationChange: number;
  finalReputation: number;
}