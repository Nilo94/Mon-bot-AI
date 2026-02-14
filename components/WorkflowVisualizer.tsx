import React, { useEffect, useState } from 'react';
import { AgentId, AgentDef, AgentStatus } from '../types';
import { AGENTS } from '../constants';
import { BrainCircuit, ScanSearch, Feather, ShieldCheck, FileUp, BarChart3, ArrowRight, ArrowDown } from 'lucide-react';

interface WorkflowVisualizerProps {
  currentAgent: AgentId | null;
}

const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ currentAgent }) => {
  
  const getAgentStyle = (id: AgentId) => {
    const isActive = currentAgent === id;
    const baseStyle = "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 w-32 md:w-40 h-32 md:h-40";
    
    if (isActive) {
      return `${baseStyle} bg-cyan-950/30 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-105 z-10`;
    }
    return `${baseStyle} bg-gray-800/50 border-gray-700 text-gray-500 grayscale opacity-80`;
  };

  const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    const icons: any = { BrainCircuit, ScanSearch, Feather, ShieldCheck, FileUp, BarChart3 };
    const LucideIcon = icons[name];
    return <LucideIcon className={className} />;
  };

  return (
    <div className="relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 flex flex-col items-center gap-8 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.5)_1px,transparent_1px)] bg-[size:20px_20px] -z-10" />

      {/* Level 1: Superviseur */}
      <div className={getAgentStyle(AgentId.A1_0)}>
        <IconComponent name={AGENTS[AgentId.A1_0].icon} className={`w-8 h-8 mb-2 ${currentAgent === AgentId.A1_0 ? 'text-purple-400 animate-pulse' : ''}`} />
        <span className="font-bold text-sm text-center">{AGENTS[AgentId.A1_0].name}</span>
        <span className="text-[10px] text-center mt-1">{AGENTS[AgentId.A1_0].role}</span>
      </div>

      <ArrowDown className="text-gray-600 animate-pulse" />

      {/* Level 2: Prospecteur */}
      <div className={getAgentStyle(AgentId.A1_1)}>
        <IconComponent name={AGENTS[AgentId.A1_1].icon} className={`w-8 h-8 mb-2 ${currentAgent === AgentId.A1_1 ? 'text-blue-400 animate-bounce' : ''}`} />
        <span className="font-bold text-sm text-center">{AGENTS[AgentId.A1_1].name}</span>
        <span className="text-[10px] text-center mt-1">{AGENTS[AgentId.A1_1].role}</span>
      </div>

      <ArrowDown className="text-gray-600 animate-pulse" />

      {/* Level 3: Rédacteur & Controleur loop */}
      <div className="flex gap-4 md:gap-12 items-center relative">
         {/* Connector for loop */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 -z-10"></div>

        <div className={getAgentStyle(AgentId.A1_2)}>
          <IconComponent name={AGENTS[AgentId.A1_2].icon} className={`w-8 h-8 mb-2 ${currentAgent === AgentId.A1_2 ? 'text-yellow-400 animate-spin-slow' : ''}`} />
          <span className="font-bold text-sm text-center">{AGENTS[AgentId.A1_2].name}</span>
        </div>

        <ArrowRight className="text-gray-600 animate-pulse" />

        <div className={getAgentStyle(AgentId.A1_3)}>
          <IconComponent name={AGENTS[AgentId.A1_3].icon} className={`w-8 h-8 mb-2 ${currentAgent === AgentId.A1_3 ? 'text-red-400' : ''}`} />
          <span className="font-bold text-sm text-center">{AGENTS[AgentId.A1_3].name}</span>
        </div>
      </div>

      {/* Parallel Branch: Optimizer */}
      <div className="absolute right-4 top-20 hidden md:flex flex-col items-center">
         <div className="h-20 w-1 bg-gray-800 border-l border-dashed border-gray-600"></div>
         <div className={getAgentStyle(AgentId.A1_4)}>
            <IconComponent name={AGENTS[AgentId.A1_4].icon} className={`w-8 h-8 mb-2 ${currentAgent === AgentId.A1_4 ? 'text-green-400' : ''}`} />
            <span className="font-bold text-sm text-center">{AGENTS[AgentId.A1_4].name}</span>
         </div>
         <span className="text-xs text-gray-500 mt-2 rotate-90 md:rotate-0">Processus Parallèle</span>
      </div>

      <ArrowDown className="text-gray-600 animate-pulse" />

      {/* Level 4: Analyste */}
      <div className={getAgentStyle(AgentId.A1_5)}>
        <IconComponent name={AGENTS[AgentId.A1_5].icon} className={`w-8 h-8 mb-2 ${currentAgent === AgentId.A1_5 ? 'text-cyan-400' : ''}`} />
        <span className="font-bold text-sm text-center">{AGENTS[AgentId.A1_5].name}</span>
      </div>
    </div>
  );
};

export default WorkflowVisualizer;