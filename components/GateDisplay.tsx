
import React from 'react';
import { Gate } from '../types';
import ProgressBar from './common/ProgressBar';
import { UsersIcon, UserIcon, Battery75Icon } from './icons';

interface GateDisplayProps {
  gate: Gate;
  onToggle: () => void;
}

const GateDisplay: React.FC<GateDisplayProps> = ({ gate, onToggle }) => {
  const gateStatusColor = gate.isOpen ? 'bg-green-500' : 'bg-red-500';
  const gateStatusText = gate.isOpen ? 'OPEN' : 'CLOSED';

  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg flex flex-col justify-between border border-gray-700 h-full">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-lg">Gate {gate.id}</h4>
          <button onClick={onToggle} className={`px-3 py-1 text-xs font-bold rounded-full text-white ${gateStatusColor}`}>
            {gateStatusText}
          </button>
        </div>
        <div className="flex items-center text-gray-400 mb-2">
          <UsersIcon className="w-5 h-5 mr-2" />
          <span>Queue: {gate.queue.length}</span>
        </div>
      </div>
      <div className="space-y-2 mt-2">
        {gate.assignedStaff.length > 0 ? (
          gate.assignedStaff.map(staff => (
            <div key={staff.id} className="bg-gray-900 p-2 rounded-md text-xs">
              <div className="flex items-center mb-1">
                  <UserIcon className="w-4 h-4 mr-1 text-blue-300"/>
                  <p className="font-semibold">{staff.firstName} {staff.lastName}</p>
              </div>
              <div className="flex items-center">
                  <Battery75Icon className="w-4 h-4 mr-1 text-yellow-400"/>
                  <ProgressBar value={staff.currentFocus} max={100} text={`${Math.round(staff.currentFocus)}%`} small />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-sm py-4">Unassigned</div>
        )}
      </div>
    </div>
  );
};

export default GateDisplay;
