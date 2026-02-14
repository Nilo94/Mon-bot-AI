import React, { useEffect, useRef } from 'react';
import { LogEntry, AgentId } from '../types';

interface TerminalLogProps {
  logs: LogEntry[];
}

const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getAgentColor = (agentId: AgentId) => {
    switch (agentId) {
      case AgentId.A1_0: return 'text-purple-400';
      case AgentId.A1_1: return 'text-blue-400';
      case AgentId.A1_2: return 'text-yellow-400';
      case AgentId.A1_3: return 'text-red-400';
      case AgentId.A1_4: return 'text-green-400';
      case AgentId.A1_5: return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 h-96 overflow-y-auto font-mono text-xs md:text-sm shadow-inner shadow-black/50">
      <div className="sticky top-0 bg-gray-950/90 backdrop-blur-sm pb-2 border-b border-gray-800 mb-2 flex justify-between items-center">
        <span className="text-gray-400 uppercase tracking-widest font-bold">Journaux Système</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      <div className="space-y-1.5">
        {logs.length === 0 && <span className="text-gray-600 italic">En attente d'initialisation...</span>}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 break-all">
            <span className="text-gray-500 shrink-0">[{log.timestamp.toLocaleTimeString()}]</span>
            <span className={`font-bold shrink-0 w-24 ${getAgentColor(log.agentId)}`}>{log.agentId}</span>
            <span className={`${
              log.type === 'error' ? 'text-red-500 bg-red-900/10 px-1' : 
              log.type === 'success' ? 'text-green-400' : 
              log.type === 'warning' ? 'text-orange-400' : 'text-gray-300'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalLog;