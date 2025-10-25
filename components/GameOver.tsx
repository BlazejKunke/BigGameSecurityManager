import React from 'react';
import { EventReport } from '../types';
import Button from './common/Button';
import { ArrowPathIcon, ExclamationTriangleIcon } from './icons';

interface GameOverProps {
  report: EventReport;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ report, onRestart }) => {
  return (
    <div className="max-w-2xl mx-auto bg-black border-2 border-red-500 p-8 text-center">
      <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-red-400 mb-4" />
      <h2 className="text-4xl font-bold text-red-300 mb-2 text-glow">GAME OVER</h2>
      <p className="text-lg text-red-200 mb-6">Your reputation has reached zero. You have been fired from the Security Director position.</p>

      <div className="bg-black p-6 border border-green-700 mb-8">
        <h3 className="text-xl font-semibold text-green-400 text-glow mb-4">Final Performance Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-green-400">
          <p>Final Reputation: <span className="font-bold">{report.finalReputation}</span></p>
          <p>Total Guests Processed: <span className="font-bold">{report.guestsProcessed}</span></p>
          <p>Incidents Prevented: <span className="font-bold text-green-400">{report.incidentsPrevented}</span></p>
          <p>Incidents Missed: <span className="font-bold text-red-400">{report.incidentsMissed}</span></p>
        </div>
      </div>

      <Button onClick={onRestart} variant="primary" size="lg">
        <ArrowPathIcon className="w-6 h-6 mr-2" />
        Start New Career
      </Button>
    </div>
  );
};

export default GameOver;