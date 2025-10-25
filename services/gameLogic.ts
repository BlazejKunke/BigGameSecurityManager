
import { Gate, Guest, LogSeverity, StaffMember } from '../types';
import { EVENT_TIMELINE } from '../constants';

interface GameTickResult {
  newGates: Gate[];
  newReputation: number;
  logs: { message: string, severity: LogSeverity }[];
  guestsProcessedThisTick: number;
  incidentsPreventedThisTick: number;
  incidentsMissedThisTick: number;
}

function createGuest(): Guest {
  return {
    id: `guest-${Date.now()}-${Math.random()}`,
    state: 'WaitingOutside',
    hasFakeId: Math.random() < 0.1,
    hasFakeTicket: Math.random() < 0.15,
    isMTE: Math.random() < 0.02,
    aggression: Math.floor(Math.random() * 10) + 1,
  };
}

export function runGameTick(
  gameTime: number,
  currentGates: Gate[],
  totalGuests: number,
  currentReputation: number
): GameTickResult {
  let newGates = JSON.parse(JSON.stringify(currentGates)) as Gate[];
  let newReputation = currentReputation;
  const logs: { message: string, severity: LogSeverity }[] = [];
  let guestsProcessedThisTick = 0;
  let incidentsPreventedThisTick = 0;
  let incidentsMissedThisTick = 0;

  // 1. Guest Arrival
  if (gameTime > EVENT_TIMELINE.externalGatesOpen && gameTime < EVENT_TIMELINE.gameEnd) {
    const arrivalRate = Math.sin((gameTime - EVENT_TIMELINE.externalGatesOpen) / (EVENT_TIMELINE.gameEnd - EVENT_TIMELINE.externalGatesOpen) * Math.PI) * 0.2;
    if (Math.random() < arrivalRate) {
        const guestCount = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < guestCount; i++) {
            const guest = createGuest();
            // Distribute guests randomly among gates
            const gateIndex = Math.floor(Math.random() * newGates.length);
            newGates[gateIndex].queue.push(guest);
        }
    }
  }

  // 2. Process Gates
  newGates.forEach(gate => {
    if (gate.isOpen && gate.queue.length > 0) {
      const staff = gate.assignedStaff[0]; // Simple logic for now, uses first staff member
      if (staff) {
        const guest = gate.queue[0];
        
        // Processing logic based on staff observation
        const effectiveObservation = staff.stats.observation * (staff.currentFocus / 100);
        let detected = false;

        if (guest.hasFakeTicket && Math.random() * 10 < effectiveObservation) {
          logs.push({ message: `Gate ${gate.id}: Fake ticket detected. Guest denied.`, severity: LogSeverity.Info });
          gate.queue.shift();
          detected = true;
          incidentsPreventedThisTick++;
          newReputation = Math.min(100, newReputation + 0.5);
        } else if (guest.hasFakeTicket) {
          logs.push({ message: `Gate ${gate.id}: Fake ticket missed!`, severity: LogSeverity.Warning });
          incidentsMissedThisTick++;
          newReputation -= 2;
        }

        if (!detected && guest.hasFakeId && Math.random() * 10 < effectiveObservation) {
          logs.push({ message: `Gate ${gate.id}: Fake ID detected. Guest denied.`, severity: LogSeverity.Info });
          gate.queue.shift();
          detected = true;
          incidentsPreventedThisTick++;
          newReputation = Math.min(100, newReputation + 0.5);
        } else if (guest.hasFakeId) {
            logs.push({ message: `Gate ${gate.id}: Fake ID missed!`, severity: LogSeverity.Warning });
            incidentsMissedThisTick++;
            newReputation -= 2;
        }

        if (!detected && guest.isMTE && Math.random() * 15 < effectiveObservation) {
            logs.push({ message: `Gate ${gate.id}: MTE detected and apprehended!`, severity: LogSeverity.Critical });
            gate.queue.shift();
            detected = true;
            incidentsPreventedThisTick++;
            newReputation = Math.min(100, newReputation + 5);
        } else if (guest.isMTE) {
            logs.push({ message: `Gate ${gate.id}: MTE slipped through security!`, severity: LogSeverity.Critical });
            incidentsMissedThisTick++;
            newReputation -= 10;
        }
        
        if(!detected) {
            gate.queue.shift();
            guestsProcessedThisTick++;
        }

      }
    }

    // Reputation loss for long queues
    if (gate.queue.length > 10) {
        newReputation -= 0.05;
    }
    
    // Staff focus degradation
    gate.assignedStaff.forEach(staff => {
        const focusDrop = 100 / ((EVENT_TIMELINE.finalSweepEnd - EVENT_TIMELINE.externalGatesOpen) / 60) / 100;
        const sustainabilityFactor = staff.stats.focusSustainability / 100;
        staff.currentFocus = Math.max(0, staff.currentFocus - (focusDrop * (2 - sustainabilityFactor)));
    });

  });

  return {
    newGates,
    newReputation: Math.max(0, newReputation),
    logs,
    guestsProcessedThisTick,
    incidentsPreventedThisTick,
    incidentsMissedThisTick
  };
}
