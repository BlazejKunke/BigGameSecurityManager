
import React from 'react';
import { StaffMember } from '../types';
import ProgressBar from './common/ProgressBar';
import { ShieldCheckIcon, ChatBubbleLeftRightIcon, EyeIcon, ClockIcon, Battery75Icon, ArrowRightOnRectangleIcon } from './icons';


interface CVCardProps {
  staffMember: StaffMember;
}

const StatDisplay: React.FC<{ icon: React.ReactNode; label: string; value: number; max?: number; isPercent?: boolean }> = ({ icon, label, value, max = 10, isPercent = false }) => (
    <div className="flex items-center">
        <div className="w-8 text-green-400">{icon}</div>
        <div className="w-1/3 text-sm">{label}</div>
        <div className="w-2/3">
            <ProgressBar value={value} max={max} text={isPercent ? `${value}%` : `${value}/${max}`} />
        </div>
    </div>
);


const CVCard: React.FC<CVCardProps> = ({ staffMember }) => {
  return (
    <div className="bg-black p-6 border-2 border-green-500 h-full">
      <div className="text-center border-b border-green-700 pb-4 mb-4">
        <h3 className="text-2xl font-bold text-green-400 text-glow">{staffMember.firstName} {staffMember.lastName}</h3>
        <p className="text-green-600">{staffMember.age}, {staffMember.gender}</p>
         <div className="mt-2 bg-green-900/50 inline-block px-3 py-1 border border-green-700">
            <span className="text-green-400 font-bold text-lg">Salary: ${staffMember.salary}</span>
        </div>
        <p className="text-xs text-green-700/50 mt-2">ID: {staffMember.id.substring(4, 12)}</p>
      </div>
      <div className="space-y-3">
          <StatDisplay icon={<ShieldCheckIcon className="w-6 h-6" />} label="Strength" value={staffMember.stats.physicalStrength} />
          <StatDisplay icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Communication" value={staffMember.stats.communication} />
          <StatDisplay icon={<EyeIcon className="w-6 h-6" />} label="Observation" value={staffMember.stats.observation} />
          <StatDisplay icon={<ClockIcon className="w-6 h-6" />} label="Reliability" value={staffMember.stats.reliability} max={100} isPercent />
          <StatDisplay icon={<Battery75Icon className="w-6 h-6" />} label="Focus" value={staffMember.stats.focusSustainability} max={100} isPercent />
          <StatDisplay icon={<ArrowRightOnRectangleIcon className="w-6 h-6" />} label="Quit Risk" value={staffMember.stats.quitRisk} max={100} isPercent />
      </div>
    </div>
  );
};

export default CVCard;