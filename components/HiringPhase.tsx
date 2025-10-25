
import React, { useState, useEffect, useCallback } from 'react';
import { StaffMember } from '../types';
import { generateCv } from '../services/cvGenerator';
import { NUM_GATES } from '../constants';
import Button from './common/Button';
import CVCard from './CVCard';
import { UserPlusIcon, ArrowRightIcon, UsersIcon, BanknotesIcon } from './icons';

interface HiringPhaseProps {
  onHiringComplete: (staff: StaffMember[]) => void;
  hiredStaff: StaffMember[];
  budget: number;
  onHireStaff: (staff: StaffMember) => void;
}

const HiringPhase: React.FC<HiringPhaseProps> = ({ onHiringComplete, hiredStaff, budget, onHireStaff }) => {
  const [currentCv, setCurrentCv] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNewCv = useCallback(async () => {
    setIsLoading(true);
    const newCv = await generateCv();
    setCurrentCv(newCv);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchNewCv();
  }, [fetchNewCv]);

  const handleAccept = () => {
    if (currentCv) {
      onHireStaff(currentCv);
      fetchNewCv();
    }
  };

  const handleReject = () => {
    fetchNewCv();
  };

  const canAfford = currentCv ? budget >= currentCv.salary : false;

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full bg-black p-6 border-2 border-green-500 mb-6">
        <h2 className="text-2xl font-bold text-center text-green-400 text-glow mb-2">Hiring Phase</h2>
        <p className="text-center text-green-600 mb-4">
          Your success depends on your team. Hire at least {NUM_GATES} staff members to cover all gates.
        </p>
        <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 bg-black p-3 border border-green-700">
           <div className="flex items-center"><UsersIcon className="w-6 h-6 text-green-400 mr-2" /><span className="text-lg font-semibold">Hired: {hiredStaff.length} / {NUM_GATES} (min)</span></div>
           <div className="w-px h-6 bg-green-700 hidden md:block"></div>
           <div className="flex items-center"><BanknotesIcon className="w-6 h-6 text-green-400 mr-2" /><span className="text-lg font-semibold">Budget: ${budget}</span></div>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 w-full">
            {isLoading && <div className="flex justify-center items-center h-96 bg-black border border-green-700"><div className="text-xl">Generating Applicant CV...</div></div>}
            {!isLoading && currentCv && <CVCard staffMember={currentCv} />}
        </div>
        <div className="md:w-1/3 w-full flex flex-col space-y-4">
            <Button onClick={handleAccept} disabled={isLoading || !canAfford} className="w-full">
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Accept
            </Button>
            {!isLoading && !canAfford && (
                <p className="text-red-400 text-xs text-center -mt-2">Insufficient budget to hire.</p>
            )}
            <Button onClick={handleReject} disabled={isLoading} variant="danger" className="w-full">
                Reject
            </Button>
             {hiredStaff.length >= NUM_GATES && (
                <Button onClick={() => onHiringComplete(hiredStaff)} variant="success" className="w-full mt-auto">
                    Finish Hiring & Proceed
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default HiringPhase;