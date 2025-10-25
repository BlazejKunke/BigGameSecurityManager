
import React from 'react';
import ProgressBar from './common/ProgressBar';
import { ShieldCheckIcon, ClockIcon, FlagIcon } from './icons';

interface HudProps {
  reputation: number;
  gameTime: number; // in minutes
  eventPhase: string;
}

const Hud: React.FC<HudProps> = ({ reputation, gameTime, eventPhase }) => {
  const hours = Math.floor(gameTime / 60).toString().padStart(2, '0');
  const minutes = (gameTime % 60).toString().padStart(2, '0');

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center w-full md:w-1/3">
        <ClockIcon className="w-8 h-8 mr-3 text-blue-300" />
        <div>
          <div className="text-gray-400 text-sm">In-Game Time</div>
          <div className="text-2xl font-bold font-mono">{hours}:{minutes}</div>
        </div>
      </div>

      <div className="flex items-center w-full md:w-1/3">
        <FlagIcon className="w-8 h-8 mr-3 text-blue-300" />
         <div>
            <div className="text-gray-400 text-sm">Event Phase</div>
            <div className="text-xl font-semibold">{eventPhase}</div>
         </div>
      </div>
      
      <div className="w-full md:w-1/3">
        <div className="flex items-center mb-1">
          <ShieldCheckIcon className="w-6 h-6 mr-2 text-green-400" />
          <span className="font-semibold">Reputation</span>
        </div>
        <ProgressBar value={reputation} max={100} text={`${Math.round(reputation)}/100`} />
      </div>

    </div>
  );
};

export default Hud;
