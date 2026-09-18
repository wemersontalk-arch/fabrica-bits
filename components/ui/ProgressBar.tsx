import React from 'react';

interface ProgressBarProps {
  progressPercentage: number;
  currentLabel: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progressPercentage, currentLabel }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs text-slate-300 font-medium">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{currentLabel}</span>
        </span>
        <span className="text-emerald-400 font-bold">{Math.round(progressPercentage)}%</span>
      </div>
      <div className="w-full h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
          style={{ width: `${Math.max(5, progressPercentage)}%` }}
        />
      </div>
    </div>
  );
};
