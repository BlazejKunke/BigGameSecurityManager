
import React from 'react';
import { EventReport } from '../types';
import Button from './common/Button';
import { ArrowRightIcon, ChartBarIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface PostEventPhaseProps {
  report: EventReport;
  onNextEvent: () => void;
  currentBudget: number;
  eventIncome: number;
}

const PostEventPhase: React.FC<PostEventPhaseProps> = ({ report, onNextEvent, currentBudget, eventIncome }) => {
  const reputationColor = report.reputationChange >= 0 ? 'text-green-400' : 'text-red-400';
  const reputationSign = report.reputationChange >= 0 ? '+' : '';

  return (
    <div className="max-w-2xl mx-auto bg-black p-8 border-2 border-green-500">
      <h2 className="text-3xl font-bold text-center text-green-400 text-glow mb-4 flex items-center justify-center">
        <ChartBarIcon className="w-8 h-8 mr-3" />
        Post-Event Report
      </h2>
      
      <div className="text-center mb-6">
          <p className="text-lg text-green-600">Final Reputation</p>
          <p className="text-5xl font-bold text-green-400 text-glow">{report.finalReputation}</p>
          <p className={`text-2xl font-semibold ${reputationColor}`}>{reputationSign}{report.reputationChange}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg bg-black p-6 border border-green-700">
        <div className="flex items-center space-x-3">
            <span className="text-green-600">Guests Processed:</span>
            <span className="font-bold text-green-400">{report.guestsProcessed}</span>
        </div>
         <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
            <span className="text-green-600">Incidents Prevented:</span>
            <span className="font-bold text-green-400">{report.incidentsPrevented}</span>
        </div>
        <div className="flex items-center space-x-3">
            <XCircleIcon className="w-6 h-6 text-red-500" />
            <span className="text-green-600">Incidents Missed:</span>
            <span className="font-bold text-green-400">{report.incidentsMissed}</span>
        </div>
      </div>

      <div className="bg-black p-6 border border-green-700 mt-6">
        <h3 className="text-xl font-semibold text-green-400 text-glow mb-4 text-center">Budget Update</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-lg">
            <span className="text-green-600 text-right">Previous Budget:</span>
            <span className="font-bold text-green-400">${currentBudget}</span>

            <span className="text-green-600 text-right">Event Income:</span>
            <span className="font-bold text-green-400">+ ${eventIncome}</span>
            
            <div className="col-span-2 border-t border-green-700 my-2"></div>

            <span className="text-green-600 text-right">New Budget:</span>
            <span className="font-bold text-green-400 text-2xl text-glow">${currentBudget + eventIncome}</span>
        </div>
    </div>

      <div className="mt-8 text-center">
        <Button onClick={onNextEvent} variant="primary" size="lg">
          Prepare for Next Event
          <ArrowRightIcon className="w-6 h-6 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PostEventPhase;