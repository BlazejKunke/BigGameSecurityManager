
import React from 'react';
import Button from './common/Button';
import { ArrowRightIcon, CalendarIcon, ExclamationTriangleIcon, ClockIcon } from './icons';

interface EventBriefingProps {
  onStartEvent: () => void;
  day: number;
}

const EventBriefing: React.FC<EventBriefingProps> = ({ onStartEvent, day }) => {
  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold text-center text-blue-300 mb-4">Event Briefing</h2>
      <div className="flex justify-center items-center space-x-2 text-lg text-gray-400 mb-6">
        <CalendarIcon className="w-6 h-6" />
        <span>Day: {day} - Standard Match Day</span>
      </div>

      <div className="space-y-4 text-left">
        <div className="bg-gray-900 p-4 rounded-md">
          <h3 className="font-semibold text-xl mb-2 flex items-center"><ExclamationTriangleIcon className="w-5 h-5 mr-2 text-yellow-400" />Known Risks</h3>
          <p className="text-gray-300">Intelligence suggests a standard level of activity. Expect attempts to use fake tickets and IDs. Stay vigilant for overly aggressive individuals, especially around halftime.</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-md">
           <h3 className="font-semibold text-xl mb-2 flex items-center"><ClockIcon className="w-5 h-5 mr-2 text-green-400" />Gate Schedule</h3>
           <ul className="list-disc list-inside text-gray-300 space-y-1">
             <li><span className="font-bold">18:00:</span> External Gates Open</li>
             <li><span className="font-bold">18:45:</span> Security Gates Open</li>
             <li><span className="font-bold">22:00:</span> Game Ends</li>
             <li><span className="font-bold">23:00:</span> Security Gates Close</li>
             <li><span className="font-bold">24:00:</span> Final Sweep Complete</li>
           </ul>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button onClick={onStartEvent} variant="success" size="lg">
          Start Event
          <ArrowRightIcon className="w-6 h-6 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default EventBriefing;
