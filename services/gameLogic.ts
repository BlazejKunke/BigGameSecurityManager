
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

    newGates.forEach((gate, gateIndex) => {
        // Only check guests in longer queues or at closed gates for efficiency
        if (gate.queue.length > 5 || !gate.isOpen) {
            gate.queue.forEach((guest, guestIndex) => {
                // Give each guest a chance to consider switching
                if (Math.random() < 0.15) { // 15% chance
                    const adjacentIndices = [gateIndex - 1, gateIndex + 1].filter(i => i >= 0 && i < newGates.length);
                    let bestGateIndex = -1;
                    // Current gate score: queue length + heavy penalty if closed
                    let bestGateScore = gate.queue.length + (gate.isOpen ? 0 : 10); 

                    adjacentIndices.forEach(adjIndex => {
                        const adjGate = newGates[adjIndex];
                        const adjGateScore = adjGate.queue.length + (adjGate.isOpen ? 0 : 10);
                        
                        // Switch if the other gate is significantly better (threshold of 2 to prevent rapid back-and-forth)
                        if (adjGateScore < bestGateScore - 2) { 
                            bestGateScore = adjGateScore;
                            bestGateIndex = adjIndex;
                        }
                    });

                    if (bestGateIndex !== -1) {
                        movers.push({ guest, fromGateIndex: gateIndex, toGateIndex: bestGateIndex, guestIndex });
                    }
                }
            });
        }
    });
    
    // Process movers, sorted descending by index to prevent splice issues
    movers.sort((a, b) => b.guestIndex - a.guestIndex).forEach(move => {
        const [movedGuest] = newGates[move.fromGateIndex].queue.splice(move.guestIndex, 1);
        if (movedGuest) {
            newGates[move.toGateIndex].queue.push(movedGuest);
        }
    });


  // 3. Process Gates
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