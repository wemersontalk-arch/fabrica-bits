import React from 'react';
import { GenerationStep } from '@/types/infoproduct';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Cpu, CheckCircle2, Loader2, Sparkles, ShieldCheck, FileCode, Layers } from 'lucide-react';

interface StepGenerationProps {
  steps: GenerationStep[];
  currentStepIndex: number;
}

export const StepGeneration: React.FC<StepGenerationProps> = ({ steps, currentStepIndex }) => {
  const activeStep = steps[currentStepIndex] || steps[steps.length - 1];
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercentage = (completedCount / steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn py-6">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Cpu className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Pipeline de IA Multi-Step Ativo</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Gerando seu Infoproduto de Alta Profundidade
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Nossos 3 pipelines sequenciais estão desenhando o método exclusivo, desenvolvendo os capítulos operacionais e criando o kit de vendas.
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
        <ProgressBar progressPercentage={progressPercentage} currentLabel={activeStep?.detail || 'Processando...'} />

        {/* Dynamic Activity Log */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> Registros do Motor em Tempo Real
          </h4>
          <div className="space-y-2.5">
            {steps.map((step) => {
              const isRunning = step.status === 'running';
              const isCompleted = step.status === 'completed';

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                    isRunning
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                      : isCompleted
                      ? 'bg-slate-950/40 border-slate-800/80'
                      : 'bg-slate-950/20 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isRunning ? (
                      <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-800 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                        {step.id}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${isCompleted ? 'text-slate-200' : isRunning ? 'text-indigo-300' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          Concluído
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${isRunning ? 'text-slate-300 font-medium' : 'text-slate-400'}`}>
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Banner */}
        <div className="flex items-center gap-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            <strong className="text-slate-200">Qualidade Garantida:</strong> Todo capítulo gerado é forçado a conter método nomeado, estudo de caso, erro comum e checklist de ação.
          </span>
        </div>
      </div>
    </div>
  );
};
