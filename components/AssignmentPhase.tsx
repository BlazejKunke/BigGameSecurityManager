import React, { useState, useMemo } from 'react';
import { StaffMember, Gate } from '../types';
import Button from './common/Button';
import { ArrowRightIcon, UserIcon, TrashIcon } from './icons';

interface AssignmentPhaseProps {
  hiredStaff: StaffMember[];
  gates: Gate[];
  onAssignmentComplete: (gates: Gate[]) => void;
}

const AssignmentPhase: React.FC<AssignmentPhaseProps> = ({ hiredStaff, gates: initialGates, onAssignmentComplete }) => {
  const [gates, setGates] = useState<Gate[]>(() => 
    initialGates.map(gate => ({
        ...gate,
        assignedStaff: gate.assignedStaff || []
    }))
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const unassignedStaff = useMemo(() => {
    const assignedIds = new Set(gates.flatMap(g => g.assignedStaff.map(s => s.id)));
    return hiredStaff.filter(s => !assignedIds.has(s.id));
  }, [hiredStaff, gates]);

  const handleSelectStaff = (staffId: string) => {
    setSelectedStaffId(prevId => (prevId === staffId ? null : staffId));
  };

  const handleAssignToGate = (gateId: number) => {
    if (!selectedStaffId) return;

    const staffToAssign = hiredStaff.find(s => s.id === selectedStaffId);
    if (!staffToAssign) return;

    setGates(prevGates => {
      return prevGates.map(gate => {
        if (gate.id === gateId && gate.assignedStaff.length === 0) {
          return { ...gate, assignedStaff: [staffToAssign] };
        }
        return gate;
      });
    });
    setSelectedStaffId(null);
  };

  const handleUnassign = (staffId: string) => {
    setGates(prevGates => {
        return prevGates.map(gate => ({
            ...gate,
            assignedStaff: gate.assignedStaff.filter(s => s.id !== staffId)
        }));
    });
  };

  const isAssignmentComplete = useMemo(() => gates.every(g => g.assignedStaff.length > 0), [gates]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="w-full bg-black p-6 border-2 border-green-500 mb-6 text-center">
        <h2 className="text-2xl font-bold text-green-400 text-glow mb-2">Staff Assignment</h2>
        <p className="text-green-600">Assign one staff member to each gate. Click a staff member, then click an empty gate.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Unassigned Staff List */}
        <div className="md:w-1/3 border-2 border-green-500 p-4">
          <h3 className="text-xl font-bold text-green-400 text-glow mb-4">Available Staff ({unassignedStaff.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {unassignedStaff.map(staff => (
              <div
                key={staff.id}
                onClick={() => handleSelectStaff(staff.id)}
                className={`p-3 border cursor-pointer transition-colors ${selectedStaffId === staff.id ? 'bg-green-500 text-black border-green-500' : 'border-green-700 hover:bg-green-900/50'}`}
              >
                <p className="font-bold">{staff.firstName} {staff.lastName}</p>
                <p className="text-xs opacity-70">OBS: {staff.stats.observation} | STR: {staff.stats.physicalStrength} | COM: {staff.stats.communication}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gates Grid */}
        <div className="md:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {gates.map(gate => (
            <div
              key={gate.id}
              onClick={() => handleAssignToGate(gate.id)}
              className={`border-2 h-32 p-3 flex flex-col justify-between transition-colors ${gate.assignedStaff.length === 0 && selectedStaffId ? 'cursor-pointer hover:bg-green-900/50 border-dashed border-green-400' : 'border-green-700'}`}
            >
              <h4 className="font-bold text-lg text-green-400 text-glow">Gate {gate.id}</h4>
              {gate.assignedStaff.length > 0 ? (
                gate.assignedStaff.map(staff => (
                  <div key={staff.id} className="bg-green-900/50 p-2 text-sm flex justify-between items-center">
                    <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" />
                        <span>{staff.firstName} {staff.lastName.charAt(0)}.</span>
                    </div>
                    <button onClick={() => handleUnassign(staff.id)} className="text-red-500 hover:text-red-400">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-green-700">-- UNASSIGNED --</div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button onClick={() => onAssignmentComplete(gates)} disabled={!isAssignmentComplete} size="lg">
            Proceed to Event Briefing
            <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default AssignmentPhase;