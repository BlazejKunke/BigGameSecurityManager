
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Gate, EventLogMessage, EventReport, LogSeverity } from '../types';
import { GAME_MINUTES_PER_REAL_SECOND, GAME_HOUR_START, EVENT_TIMELINE, EVENT_PHASE_DESCRIPTIONS, GUEST_COUNT } from '../constants';
import { runGameTick } from '../services/gameLogic';
import GateDisplay from './GateDisplay';
import EventLog from './EventLog';
import Hud from './Hud';
import Button from './common/Button';
import { LockClosedIcon, LockOpenIcon } from './icons';

interface EventPhaseProps {
  initialGates: Gate[];
  initialReputation: number;
  budget: number;
  onEventComplete: (finalReputation: number, report: EventReport) => void;
  eventLog: EventLogMessage[];
  setEventLog: React.Dispatch<React.SetStateAction<EventLogMessage[]>>;
}

const EventPhase: React.FC<EventPhaseProps> = ({ initialGates, initialReputation, budget, onEventComplete, eventLog, setEventLog }) => {
  const [gates, setGates] = useState<Gate[]>(initialGates);
  const [reputation, setReputation] = useState<number>(initialReputation);
  const [gameTime, setGameTime] = useState<number>(GAME_HOUR_START * 60); // in minutes
  const [eventPhase, setEventPhase] = useState<string>("Pre-Event");

  // FIX: Changed type from NodeJS.Timeout to number for browser compatibility
  // and initialized with null to address both type and argument errors for useRef.
  const gameLoopRef = useRef<number | null>(null);
  const gatesRef = useRef<Gate[]>(initialGates);
  const reputationRef = useRef<number>(initialReputation);
  const eventPhaseRef = useRef<string>("Pre-Event");
  const reportRef = useRef({
      guestsProcessed: 0,
      incidentsPrevented: 0,
      incidentsMissed: 0,
  });

  const totalQueueSize = useMemo(() => gates.reduce((sum, gate) => sum + gate.queue.length, 0), [gates]);

  const addLog = useCallback((message: string, severity: LogSeverity) => {
    const hours = Math.floor(gameTime / 60).toString().padStart(2, '0');
    const minutes = (gameTime % 60).toString().padStart(2, '0');
    const newLog: EventLogMessage = {
      id: `${Date.now()}-${Math.random()}`,
      time: `${hours}:${minutes}`,
      message,
      severity,
    };
    setEventLog(prev => [newLog, ...prev.slice(0, 99)]);
  }, [gameTime, setEventLog]);

  useEffect(() => {
    gatesRef.current = gates;
  }, [gates]);

  useEffect(() => {
    reputationRef.current = reputation;
  }, [reputation]);

  useEffect(() => {
    eventPhaseRef.current = eventPhase;
  }, [eventPhase]);

  useEffect(() => {
    const intervalMilliseconds = 1000 / GAME_MINUTES_PER_REAL_SECOND;
    // FIX: Explicitly use window.setInterval to avoid type conflicts with Node's setInterval, which returns NodeJS.Timeout instead of a number. This resolves the error.
    gameLoopRef.current = window.setInterval(() => {
      setGameTime(prevTime => prevTime + 1);
    }, intervalMilliseconds);

    return () => {
      if (gameLoopRef.current) {
        // FIX: Explicitly use window.clearInterval to match window.setInterval.
        window.clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameTime >= EVENT_TIMELINE.finalSweepEnd) {
      if (gameLoopRef.current) {
        // FIX: Explicitly use window.clearInterval.
        window.clearInterval(gameLoopRef.current);
      }
      
      const finalReputation = reputationRef.current;
      const finalReport: EventReport = {
          ...reportRef.current,
          reputationChange: finalReputation - initialReputation,
          finalReputation,
      };
      onEventComplete(finalReputation, finalReport);
      return;
    }

    const currentPhaseDescription = Object.entries(EVENT_PHASE_DESCRIPTIONS)
      .reverse()
      .find(([time]) => gameTime >= parseInt(time))?.[1];

    if (currentPhaseDescription && currentPhaseDescription !== eventPhaseRef.current) {
      setEventPhase(currentPhaseDescription);
      addLog(`Phase changed: ${currentPhaseDescription}`, LogSeverity.Info);
    }
    
    // Run game logic tick
    const tickResult = runGameTick(gameTime, gatesRef.current, GUEST_COUNT, reputationRef.current);

    setGates(tickResult.newGates);
    setReputation(tickResult.newReputation);
    reportRef.current.guestsProcessed += tickResult.guestsProcessedThisTick;
    reportRef.current.incidentsPrevented += tickResult.incidentsPreventedThisTick;
    reportRef.current.incidentsMissed += tickResult.incidentsMissedThisTick;

    tickResult.logs.forEach(log => addLog(log.message, log.severity));

    if (tickResult.newReputation <= 0) {
        if (gameLoopRef.current) {
          // FIX: Explicitly use window.clearInterval.
          window.clearInterval(gameLoopRef.current);
        }
        const finalReport: EventReport = {
            ...reportRef.current,
            reputationChange: 0 - initialReputation,
            finalReputation: 0,
        };
        onEventComplete(0, finalReport);
    }
  }, [gameTime, addLog]);

  const toggleGate = (gateId: number) => {
    setGates(prevGates => {
      const targetGate = prevGates.find(g => g.id === gateId);
      if (targetGate) {
        addLog(`Gate ${gateId} manually ${targetGate.isOpen ? 'closed' : 'opened'}.`, LogSeverity.Info);
      }
      return prevGates.map(gate =>
        gate.id === gateId ? { ...gate, isOpen: !gate.isOpen } : gate
      );
    });
  };

  const toggleAllGates = (open: boolean) => {
    setGates(prevGates => prevGates.map(gate => ({ ...gate, isOpen: open })));
    addLog(`All gates manually ${open ? 'opened' : 'closed'}.`, LogSeverity.Info);
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-150px)]">
      <div className="lg:w-3/4 flex flex-col gap-4">
        <Hud totalQueueSize={totalQueueSize} gameTime={gameTime} eventPhase={eventPhase} budget={budget} />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 flex-grow overflow-y-auto p-1">
          {gates.map(gate => (
            <GateDisplay key={gate.id} gate={gate} onToggle={() => toggleGate(gate.id)} />
          ))}
        </div>
        <div className="bg-black p-2 border-t-2 border-green-500 flex justify-center gap-4">
            <Button onClick={() => toggleAllGates(true)} variant='success'>
                <LockOpenIcon className="w-5 h-5 mr-2" /> Open All Gates
            </Button>
            <Button onClick={() => toggleAllGates(false)} variant='danger'>
                <LockClosedIcon className="w-5 h-5 mr-2" /> Close All Gates
            </Button>
        </div>
      </div>
      <div className="lg:w-1/4">
        <EventLog logs={eventLog} />
      </div>
    </div>
  );
};

export default EventPhase;