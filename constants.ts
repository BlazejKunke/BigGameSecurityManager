import { Gate } from './types';

export const NUM_GATES = 12;
export const INITIAL_REPUTATION = 100;
export const INITIAL_BUDGET = 6000;
export const POST_EVENT_INCOME = 1500;
export const GAME_HOUR_START = 18;
export const GAME_HOUR_END = 24;
export const GAME_MINUTES_PER_REAL_SECOND = 0.2; // 1 real minute = 12 game minutes

export const EVENT_TIMELINE = {
  externalGatesOpen: 18 * 60,
  securityGatesOpen: 18 * 60 + 45,
  gameStart: 20 * 60 + 30,
  halftime: 21 * 60 + 15,
  gameEnd: 22 * 60,
  securityGatesClose: 23 * 60,
  finalSweepEnd: 24 * 60,
};

export const INITIAL_GATES: Gate[] = Array.from({ length: NUM_GATES }, (_, i) => ({
  id: i + 1,
  isOpen: false,
  isSecurityGate: true, // For simplicity, all gates are security gates
  queue: [],
  assignedStaff: [],
}));

export const EVENT_PHASE_DESCRIPTIONS: { [key: number]: string } = {
  [EVENT_TIMELINE.externalGatesOpen]: "Gates Opening",
  [EVENT_TIMELINE.securityGatesOpen]: "Peak Rush",
  [EVENT_TIMELINE.gameStart]: "Game Started",
  [EVENT_TIMELINE.halftime]: "Halftime",
  [EVENT_TIMELINE.gameEnd]: "Game End Rush",
  [EVENT_TIMELINE.securityGatesClose]: "Gates Closed",
  [EVENT_TIMELINE.finalSweepEnd]: "Final Sweep",
};

export const GUEST_COUNT = 1500;