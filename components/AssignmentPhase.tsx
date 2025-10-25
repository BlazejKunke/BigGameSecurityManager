
import React, { useState } from 'react';
import { StaffMember, Gate } from '../types';
import Button from './common/Button';
import { ArrowRightIcon } from './icons';

interface AssignmentPhaseProps {
  hiredStaff: StaffMember[];
  gates: Gate[];
  onAssignmentComplete: (gates: Gate[]) => void;
}

const AssignmentPhase: React.FC<AssignmentPhaseProps> = ({ hiredStaff, gates: initialGates, onAssignmentComplete }) => {
  const [gates, setGates] = useState<Gate[]>(initialGates);
  const [unassignedStaff, setUnassignedStaff] = useState<StaffMember[]>(
    hiredStaff.filter(s => !initialGates.some(g => g.assignedStaff.some(gs => gs.id === s.id)))
  );

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, staff: StaffMember) => {
    e.dataTransfer.setData("staffId", staff.id);
  };

  const handleDropOnGate = (e: React.DragEvent<HTMLDivElement>, gateId: number) => {
    e.preventDefault();
    const staffId = e.dataTransfer.getData("staffId");
    const staffMember = unassignedStaff.find(s => s.id === staffId);
    if (staffMember) {
      setGates(prevGates => prevGates.map(gate => 
        gate.id === gateId 
          ? { ...gate, assignedStaff: [...gate.assignedStaff, staffMember] }
          : gate
      ));
      setUnassignedStaff(prevStaff => prevStaff.filter(s => s.id !== staffId));
    }
  };
  
  const handleDropOnRoster = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const staffId = e.dataTransfer.getData("staffId");
    
    let staffMember: StaffMember | undefined;
    let fromGateId: number | null = null;

    for (const gate of gates) {
        const foundStaff = gate.assignedStaff.find(s => s.id === staffId);
        if (foundStaff) {
            staffMember = foundStaff;
            fromGateId = gate.id;
            break;
        }
    }

    if (staffMember && fromGateId !== null) {
      setGates(prevGates => prevGates.map(gate => 
        gate.id === fromGateId
          ? { ...gate, assignedStaff: gate.assignedStaff.filter(s => s.id !== staffId) }
          : gate
      ));
      setUnassignedStaff(prevStaff => [...prevStaff, staffMember!]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const StaffPill: React.FC<{ staff: StaffMember }> = ({ staff }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, staff)}
      className="bg-blue-500 text-white p-2 rounded-md shadow-sm cursor-grab active:cursor-grabbing text-sm"
    >
      {staff.firstName} {staff.lastName}
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto">
       <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-300">Staff Assignment</h2>
          <p className="text-gray-400">Drag and drop staff to assign them to gates. Unassigned staff act as reserves.</p>
       </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div 
            className="md:w-1/4 w-full bg-gray-800 p-4 rounded-lg shadow-lg"
            onDrop={handleDropOnRoster}
            onDragOver={handleDragOver}
        >
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Unassigned Staff ({unassignedStaff.length})</h3>
          <div className="space-y-2 h-96 overflow-y-auto pr-2">
            {unassignedStaff.map(staff => <StaffPill key={staff.id} staff={staff} />)}
          </div>
        </div>
        <div className="md:w-3/4 w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gates.map(gate => (
            <div
              key={gate.id}
              onDrop={(e) => handleDropOnGate(e, gate.id)}
              onDragOver={handleDragOver}
              className="bg-gray-800 p-4 rounded-lg shadow-lg min-h-[120px] border-2 border-dashed border-gray-600 hover:border-blue-400 transition-colors"
            >
              <h4 className="font-bold text-lg text-center mb-2">Gate {gate.id}</h4>
              <div className="space-y-2">
                {gate.assignedStaff.map(staff => <StaffPill key={staff.id} staff={staff} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button onClick={() => onAssignmentComplete(gates)} variant="success">
          Confirm Assignments & Proceed
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default AssignmentPhase;
