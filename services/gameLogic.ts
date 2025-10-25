
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

function cloneStaffMember(staff: StaffMember): StaffMember {
  return {
    ...staff,
    stats: { ...staff.stats },
  };
}

function cloneGate(gate: Gate): Gate {
  return {
    ...gate,
    queue: gate.queue.map(guest => ({ ...guest })),
    assignedStaff: gate.assignedStaff.map(cloneStaffMember),
  };
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
  const newGates = currentGates.map(cloneGate);
  let newReputation = currentReputation;
  const logs: { message: string, severity: LogSeverity }[] = [];
  let guestsProcessedThisTick = 0;
  let incidentsPreventedThisTick = 0;
  let incidentsMissedThisTick = 0;

  // 1. Guest Arrival
  if (gameTime > EVENT_TIMELINE.externalGatesOpen && gameTime < EVENT_TIMELINE.gameEnd) {
    // Increased arrival rate and guest count
    const arrivalRate = Math.sin((gameTime - EVENT_TIMELINE.externalGatesOpen) / (EVENT_TIMELINE.gameEnd - EVENT_TIMELINE.externalGatesOpen) * Math.PI) * 0.8;
    if (Math.random() < arrivalRate) {
        const guestCount = Math.floor(Math.random() * 20) + 6; // 6-25 guests
        for (let i = 0; i < guestCount; i++) {
            const guest = createGuest();
            // Distribute guests randomly among gates
            const gateIndex = Math.floor(Math.random() * newGates.length);
            newGates[gateIndex].queue.push(guest);
        }
    }
  }

  // 2. Guest Line Switching Logic
  const movers: { guest: Guest; fromGateIndex: number; toGateIndex: number; guestIndex: number }[] = [];
  const openGateIndices = newGates
    .map((gate, index) => (gate.isOpen ? index : -1))
    .filter(index => index !== -1);
  const anyGateOpen = openGateIndices.length > 0;

  newGates.forEach((gate, gateIndex) => {
    gate.queue.forEach((guest, guestIndex) => {
      const isGateClosed = !gate.isOpen;
      const queuePressure = Math.min(0.5, gate.queue.length / 30);
      const closedFrustration = isGateClosed ? (anyGateOpen ? 0.6 : 0.25) : 0;
      const willingness = 0.1 + queuePressure + closedFrustration;

      // Some guests are lazy – give them a chance to ignore moving even when it might be better.
      if (Math.random() > Math.min(0.9, willingness)) {
        return;
      }

      const currentScore = gate.queue.length + (gate.isOpen ? 0 : anyGateOpen ? 50 : 15);
      let bestGateIndex = -1;
      let bestGateScore = currentScore;

      newGates.forEach((otherGate, otherIndex) => {
        if (otherIndex === gateIndex) {
          return;
        }

        const distance = Math.abs(otherIndex - gateIndex);
        const distancePenalty = distance * 1.5 + Math.max(0, distance - 2) * 1.5; // prefer nearby lines
        const closurePenalty = otherGate.isOpen ? 0 : anyGateOpen ? 50 : 15;
        const imperfectDecision = Math.random(); // they are not fully rational
        const candidateScore =
          otherGate.queue.length +
          distancePenalty +
          closurePenalty -
          imperfectDecision;

        // Only move if the alternative is meaningfully better than the current gate
        if (candidateScore + 1 < bestGateScore) {
          bestGateScore = candidateScore;
          bestGateIndex = otherIndex;
        }
      });

      if (bestGateIndex !== -1) {
        movers.push({ guest, fromGateIndex: gateIndex, toGateIndex: bestGateIndex, guestIndex });
      }
    });
  });

  // Process movers, sorted descending by guest index within each gate to avoid splice issues
  movers
    .sort((a, b) => (a.fromGateIndex === b.fromGateIndex ? b.guestIndex - a.guestIndex : b.fromGateIndex - a.fromGateIndex))
    .forEach(move => {
      const [movedGuest] = newGates[move.fromGateIndex].queue.splice(move.guestIndex, 1);
      if (movedGuest) {
        newGates[move.toGateIndex].queue.push(movedGuest);
      }
    });


  // 3. Process Gates
  newGates.forEach(gate => {
    if (gate.isOpen && gate.queue.length > 0) {
      const staff = gate.assignedStaff.length > 0 ? gate.assignedStaff[0] : undefined; // Simple logic for now, uses first staff member
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
    if (gate.queue.length > 15) { // Increased threshold due to higher traffic
        newReputation -= 0.1;
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