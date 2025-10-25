
import React, { useState, useCallback } from 'react';
import { GamePhase, StaffMember, Gate, EventLogMessage, EventReport } from './types';
import { INITIAL_GATES, INITIAL_REPUTATION, NUM_GATES } from './constants';
import HiringPhase from './components/HiringPhase';
import AssignmentPhase from './components/AssignmentPhase';
import EventPhase from './components/EventPhase';
import PostEventPhase from './components/PostEventPhase';
import EventBriefing from './components/EventBriefing';
import GameOver from './components/GameOver';
import { generateCv } from './services/cvGenerator';

const App: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.Hiring);
  const [reputation, setReputation] = useState<number>(INITIAL_REPUTATION);
  const [hiredStaff, setHiredStaff] = useState<StaffMember[]>([]);
  const [gates, setGates] = useState<Gate[]>(INITIAL_GATES);
  const [eventLog, setEventLog] = useState<EventLogMessage[]>([]);
  const [eventReport, setEventReport] = useState<EventReport | null>(null);
  const [day, setDay] = useState(1);

  const handleHiringComplete = useCallback((staff: StaffMember[]) => {
    setHiredStaff(staff);
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
    setGates(INITIAL_GATES.map(gate => ({ ...gate, assignedStaff: [] })));
    setGamePhase(GamePhase.Hiring);
  }, []);

  const restartGame = useCallback(() => {
    setReputation(INITIAL_REPUTATION);
    setHiredStaff([]);
    setGates(INITIAL_GATES);
    setEventLog([]);
    setEventReport(null);
    setDay(1);
    setGamePhase(GamePhase.Hiring);
  }, []);

  const renderPhase = () => {
    switch (gamePhase) {
      case GamePhase.Hiring:
        return <HiringPhase onHiringComplete={handleHiringComplete} hiredStaff={hiredStaff} />;
      case GamePhase.Assignment:
        return <AssignmentPhase hiredStaff={hiredStaff} gates={gates} onAssignmentComplete={handleAssignmentComplete} />;
      case GamePhase.EventBriefing:
        return <EventBriefing onStartEvent={handleStartEvent} day={day} />;
      case GamePhase.Event:
        return (
          <EventPhase
            initialGates={gates}
            initialReputation={reputation}
            onEventComplete={handleEventComplete}
            eventLog={eventLog}
            setEventLog={setEventLog}
          />
        );
      case GamePhase.PostEvent:
        return eventReport && <PostEventPhase report={eventReport} onNextEvent={handleNextEvent} />;
      case GamePhase.GameOver:
        return eventReport && <GameOver report={eventReport} onRestart={restartGame} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 p-4 shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wider text-blue-300">BigGameSecurity</h1>
        <p className="text-sm text-gray-400">Security Director Management Simulation</p>
      </header>
      <main className="p-4 md:p-8">
        {renderPhase()}
      </main>
    </div>
  );
};

export default App;
