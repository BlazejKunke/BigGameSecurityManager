
import React from 'react';
import ProgressBar from './common/ProgressBar';
import { UsersIcon, ClockIcon, FlagIcon, BanknotesIcon } from './icons';

interface HudProps {
  totalQueueSize: number;
  gameTime: number; // in minutes
  eventPhase: string;
  budget: number;
}

const Hud: React.FC<HudProps> = ({ totalQueueSize, gameTime, eventPhase, budget }) => {
  const hours = Math.floor(gameTime / 60).toString().padStart(2, '0');
  const minutes = (gameTime % 60).toString().padStart(2, '0');

  return (
    <div className="bg-black p-4 border-2 border-green-500 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
      <div className="flex items-center">
        <BanknotesIcon className="w-8 h-8 mr-3 text-green-400 flex-shrink-0" />
        <div>
          <div className="text-green-600 text-sm">Budget</div>
          <div className="text-2xl font-bold font-mono text-glow">${budget}</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <ClockIcon className="w-8 h-8 mr-3 text-green-400 flex-shrink-0" />
        <div>
          <div className="text-green-600 text-sm">In-Game Time</div>
          <div className="text-2xl font-bold font-mono text-glow">{hours}:{minutes}</div>
        </div>
      </div>

      <div className="flex items-center">
        <FlagIcon className="w-8 h-8 mr-3 text-green-400 flex-shrink-0" />
         <div>
            <div className="text-green-600 text-sm">Event Phase</div>
            <div className="text-xl font-semibold text-glow">{eventPhase}</div>
         </div>
      </div>
      
      <div className="flex items-center">
        <UsersIcon className="w-8 h-8 mr-3 text-green-400 flex-shrink-0" />
        <div>
          <div className="text-green-600 text-sm">Total Queue</div>
          <div className="text-2xl font-bold font-mono text-glow">{totalQueueSize}</div>
        </div>
      </div>

    </div>
  );
};

export default Hud;