import React from 'react';
import { Sparkles, BookOpen, Cpu, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  currentStep?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentStep }) => {
  return (
    <div className="w-full border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {currentStep ? (
          <div className="flex items-center gap-4 sm:gap-6 bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep === 1 ? 'bg-indigo-600 text-white font-bold' : currentStep > 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>1</span>
              <span className={currentStep === 1 ? 'text-slate-100 font-semibold' : 'text-slate-400'}>Diagnóstico</span>
            </div>
            <span className="text-slate-700">/</span>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep === 2 ? 'bg-indigo-600 text-white font-bold' : currentStep > 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>2</span>
              <span className={currentStep === 2 ? 'text-slate-100 font-semibold' : 'text-slate-400'}>Geração</span>
            </div>
            <span className="text-slate-700">/</span>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep === 3 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>3</span>
              <span className={currentStep === 3 ? 'text-slate-100 font-semibold' : 'text-slate-400'}>Workspace</span>
            </div>
          </div>
        ) : <div />}

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline font-medium">Motor Anti-Superficialidade Ativo</span>
        </div>
      </div>
    </div>
  );
};
