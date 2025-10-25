
import React from 'react';
import { EventReport } from '../types';
import Button from './common/Button';
import { ArrowRightIcon, ChartBarIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface PostEventPhaseProps {
  report: EventReport;
  onNextEvent: () => void;
}

const PostEventPhase: React.FC<PostEventPhaseProps> = ({ report, onNextEvent }) => {
  const reputationColor = report.reputationChange >= 0 ? 'text-green-400' : 'text-red-400';
  const reputationSign = report.reputationChange >= 0 ? '+' : '';

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold text-center text-blue-300 mb-4 flex items-center justify-center">
        <ChartBarIcon className="w-8 h-8 mr-3" />
        Post-Event Report
      </h2>
      
      <div className="text-center mb-6">
          <p className="text-lg text-gray-400">Final Reputation</p>
          <p className="text-5xl font-bold text-white">{report.finalReputation}</p>
          <p className={`text-2xl font-semibold ${reputationColor}`}>{reputationSign}{report.reputationChange}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg bg-gray-900 p-6 rounded-md">
        <div className="flex items-center space-x-3">
            <span className="text-gray-400">Guests Processed:</span>
            <span className="font-bold text-white">{report.guestsProcessed}</span>
        </div>
         <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
            <span className="text-gray-400">Incidents Prevented:</span>
            <span className="font-bold text-white">{report.incidentsPrevented}</span>
        </div>
        <div className="flex items-center space-x-3">
            <XCircleIcon className="w-6 h-6 text-red-500" />
            <span className="text-gray-400">Incidents Missed:</span>
            <span className="font-bold text-white">{report.incidentsMissed}</span>
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
