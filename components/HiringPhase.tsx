
import React, { useState, useEffect, useCallback } from 'react';
import { StaffMember } from '../types';
import { generateCv } from '../services/cvGenerator';
import { NUM_GATES } from '../constants';
import Button from './common/Button';
import CVCard from './CVCard';
import { UserPlusIcon, ArrowRightIcon, UsersIcon } from './icons';

interface HiringPhaseProps {
  onHiringComplete: (staff: StaffMember[]) => void;
  hiredStaff: StaffMember[];
}

const HiringPhase: React.FC<HiringPhaseProps> = ({ onHiringComplete, hiredStaff: initialHiredStaff }) => {
  const [hiredStaff, setHiredStaff] = useState<StaffMember[]>(initialHiredStaff);
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
      setHiredStaff([...hiredStaff, currentCv]);
      fetchNewCv();
    }
  };

  const handleReject = () => {
    fetchNewCv();
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full bg-gray-800 p-6 rounded-lg shadow-2xl mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-300 mb-2">Hiring Phase</h2>
        <p className="text-center text-gray-400 mb-4">
          Your success depends on your team. Hire at least {NUM_GATES} staff members to cover all gates.
        </p>
        <div className="flex justify-center items-center space-x-4 bg-gray-900 p-3 rounded-md">
           <UsersIcon className="w-6 h-6 text-green-400" />
          <span className="text-lg font-semibold">Hired Staff: {hiredStaff.length} / {NUM_GATES} (min)</span>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 w-full">
            {isLoading && <div className="flex justify-center items-center h-96 bg-gray-800 rounded-lg shadow-inner"><div className="text-xl">Generating Applicant CV...</div></div>}
            {!isLoading && currentCv && <CVCard staffMember={currentCv} />}
        </div>
        <div className="md:w-1/3 w-full flex flex-col space-y-4">
            <Button onClick={handleAccept} disabled={isLoading} className="w-full">
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Accept
            </Button>
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
