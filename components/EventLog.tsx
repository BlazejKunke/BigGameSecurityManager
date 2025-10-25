import React from 'react';
import { EventLogMessage, LogSeverity } from '../types';
import { InformationCircleIcon, ExclamationTriangleIcon, ShieldExclamationIcon } from './icons';

interface EventLogProps {
  logs: EventLogMessage[];
}

const severityConfig = {
    [LogSeverity.Info]: {
        color: 'text-green-400',
        icon: <InformationCircleIcon className="w-5 h-5 text-green-400" />
    },
    [LogSeverity.Warning]: {
        color: 'text-yellow-400',
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
    },
    [LogSeverity.Critical]: {
        color: 'text-red-400',
        icon: <ShieldExclamationIcon className="w-5 h-5 text-red-400" />
    }
};

const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  return (
    <div className="bg-black p-4 border-2 border-green-500 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-4 border-b border-green-700 pb-2 text-glow">Event Log</h3>
      <div className="flex-grow overflow-y-auto space-y-3 pr-2">
        {logs.map(log => (
            <div key={log.id} className={`flex items-start text-sm ${severityConfig[log.severity].color}`}>
               <div className="flex-shrink-0 mr-2 mt-0.5">{severityConfig[log.severity].icon}</div>
               <div>
                  <span className="font-mono text-green-700 mr-2">[{log.time}]</span>
                  <span>{log.message}</span>
               </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default EventLog;