
import React from 'react';
import { StaffMember } from '../types';
import ProgressBar from './common/ProgressBar';
import { ShieldCheckIcon, ChatBubbleLeftRightIcon, EyeIcon, ClockIcon, Battery75Icon, ArrowRightOnRectangleIcon } from './icons';


interface CVCardProps {
  staffMember: StaffMember;
}

const StatDisplay: React.FC<{ icon: React.ReactNode; label: string; value: number; max?: number; isPercent?: boolean }> = ({ icon, label, value, max = 10, isPercent = false }) => (
    <div className="flex items-center">
        <div className="w-8 text-blue-300">{icon}</div>
        <div className="w-1/3 text-sm">{label}</div>
        <div className="w-2/3">
            <ProgressBar value={value} max={max} text={isPercent ? `${value}%` : `${value}/${max}`} />
        </div>
    </div>
);


const CVCard: React.FC<CVCardProps> = ({ staffMember }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 h-full">
      <div className="text-center border-b border-gray-700 pb-4 mb-4">
        <h3 className="text-2xl font-bold text-white">{staffMember.firstName} {staffMember.lastName}</h3>
        <p className="text-gray-400">{staffMember.age}, {staffMember.gender}</p>
        <p className="text-xs text-gray-500 mt-1">ID: {staffMember.id.substring(4, 12)}</p>
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
