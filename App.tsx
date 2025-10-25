
import React, { useState, useCallback, useMemo } from 'react';
import { GamePhase, StaffMember, Gate, EventLogMessage, EventReport } from './types';
import { INITIAL_GATES, INITIAL_REPUTATION, NUM_GATES, INITIAL_BUDGET, POST_EVENT_INCOME } from './constants';
import HiringPhase from './components/HiringPhase';
import AssignmentPhase from './components/AssignmentPhase';
import EventPhase from './components/EventPhase';
import PostEventPhase from './components/PostEventPhase';
import EventBriefing from './components/EventBriefing';
import GameOver from './components/GameOver';

const App: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.Hiring);
  const [reputation, setReputation] = useState<number>(INITIAL_REPUTATION);
  const [budget, setBudget] = useState<number>(INITIAL_BUDGET);
  const [hiredStaff, setHiredStaff] = useState<StaffMember[]>([]);
  const [gates, setGates] = useState<Gate[]>(INITIAL_GATES);
  const [eventLog, setEventLog] = useState<EventLogMessage[]>([]);
  const [eventReport, setEventReport] = useState<EventReport | null>(null);
  const [day, setDay] = useState(1);
  
  const handleHireStaff = useCallback((staff: StaffMember) => {
    if (budget >= staff.salary) {
      setHiredStaff(prev => [...prev, staff]);
      setBudget(prev => prev - staff.salary);
    }
  }, [budget]);

  const handleHiringComplete = useCallback((staff: StaffMember[]) => {
    // Staff is already updated via handleHireStaff, we just need to change phase
    setGamePhase(GamePhase.Assignment);
  }, []);

  const handleAssignmentComplete = useCallback((assignedGates: Gate[]) => {
    setGates(assignedGates);
    setGamePhase(GamePhase.EventBriefing);
  }, []);

  const handleStartEvent = useCallback(() => {
    setEventLog([]);
    setGamePhase(GamePhase.Event);
  }, []);

  const handleEventComplete = useCallback((finalReputation: number, report: EventReport) => {
    setReputation(finalReputation);
    setEventReport(report);
    if (finalReputation <= 0) {
      setGamePhase(GamePhase.GameOver);
    } else {
      setGamePhase(GamePhase.PostEvent);
    }
  }, []);
  
  const handleNextEvent = useCallback(() => {
    setDay(prevDay => prevDay + 1);
    setBudget(prevBudget => prevBudget + POST_EVENT_INCOME);
    setGates(INITIAL_GATES.map(gate => ({ ...gate, assignedStaff: [] })));
    setGamePhase(GamePhase.Hiring);
  }, []);

  const restartGame = useCallback(() => {
    setReputation(INITIAL_REPUTATION);
    setBudget(INITIAL_BUDGET);
    setHiredStaff([]);
    setGates(INITIAL_GATES);
    setEventLog([]);
    setEventReport(null);
    setDay(1);
    setGamePhase(GamePhase.Hiring);
  }, []);

  const phaseContent = useMemo(() => {
    switch (gamePhase) {
      case GamePhase.Hiring:
        return (
          <HiringPhase
            onHiringComplete={handleHiringComplete}
            hiredStaff={hiredStaff}
            budget={budget}
            onHireStaff={handleHireStaff}
          />
        );
      case GamePhase.Assignment:
        return (
          <AssignmentPhase
            hiredStaff={hiredStaff}
            gates={gates}
            onAssignmentComplete={handleAssignmentComplete}
          />
        );
      case GamePhase.EventBriefing:
        return <EventBriefing onStartEvent={handleStartEvent} day={day} />;
      case GamePhase.Event:
        return (
          <EventPhase
            initialGates={gates}
            initialReputation={reputation}
            budget={budget}
            onEventComplete={handleEventComplete}
            eventLog={eventLog}
            setEventLog={setEventLog}
          />
        );
      case GamePhase.PostEvent:
        return (
          eventReport && (
            <PostEventPhase
              report={eventReport}
              onNextEvent={handleNextEvent}
              currentBudget={budget}
              eventIncome={POST_EVENT_INCOME}
            />
          )
        );
      case GamePhase.GameOver:
        return eventReport && <GameOver report={eventReport} onRestart={restartGame} />;
      default:
        return <div>Loading...</div>;
    }
  }, [
    budget,
    day,
    eventLog,
    eventReport,
    gamePhase,
    gates,
    handleAssignmentComplete,
    handleEventComplete,
    handleHireStaff,
    handleHiringComplete,
    handleNextEvent,
    handleStartEvent,
    hiredStaff,
    reputation,
    restartGame,
  ]);

  return (
    <div className="min-h-screen">
      <header className="bg-black p-4 text-center border-b-2 border-green-500">
        <h1 className="text-3xl font-bold tracking-wider text-green-400 text-glow">BigGameSecurity</h1>
        <p className="text-sm text-green-600">Security Director Management Simulation</p>
      </header>
      <main className="p-4 md:p-8">
        {phaseContent}
      </main>
    </div>
  );
};

export default App;