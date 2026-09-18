'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Crown, CheckCircle2, X, Sparkles, BookOpen } from 'lucide-react';

interface UpgradeToProModalProps {
  onClose: () => void;
}

export const UpgradeToProModal: React.FC<UpgradeToProModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 w-fit">
            <BookOpen className="w-3 h-3 text-indigo-400" /> Recurso Exclusivo Produtor PRO
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Desbloqueie a Área de Membros do Aluno (LMS)
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Seu plano atual permite a geração e o download de e-books em PDF. Para disponibilizar a <strong>Área de Membros Interativa para seus Alunos</strong> com leitor web, checklists e certificados, faça o upgrade para o plano <strong>Produtor PRO</strong>.
          </p>
        </div>

        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2.5 text-xs">
          <p className="font-bold text-amber-300 flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400" /> Vantagens do Plano Produtor PRO:
          </p>
          <ul className="space-y-1.5 text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Plataforma de Membros Completa (LMS estilo Hotmart/Kiwify)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Matrícula ilimitada de alunos e acompanhamento de progresso
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Emissão de Certificados Automatizados ao atingir 100%
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> IA Ilimitada sem restrições de cota mensal
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/planos"
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-xs rounded-xl shadow-xl shadow-indigo-600/30 text-center flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Migrar para o Produtor PRO</span>
          </Link>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
