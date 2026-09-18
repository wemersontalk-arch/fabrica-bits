'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Crown, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface MonthlyLimitModalProps {
  onClose: () => void;
}

export const MonthlyLimitModal: React.FC<MonthlyLimitModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Cota Mensal Atingida (1/1 no Mês)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Você atingiu o limite do Plano Produtor Iniciante
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            No plano <strong>Produtor Iniciante</strong>, você tem direito a 1 geração completa por mês. Para criar novos infoprodutos ilimitados agora mesmo, faça o upgrade para o plano <strong>Produtor PRO</strong>!
          </p>
        </div>

        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs">
          <p className="font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Benefícios do Plano Produtor PRO:
          </p>
          <ul className="space-y-1.5 text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Geração de Infoprodutos 100% Ilimitada com IA
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Liberação Completa da Área de Membros do Aluno (LMS)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Suporte Prioritário VIP & Exportações ILIMITADAS
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/planos"
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-amber-500/20 text-center flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <Crown className="w-4 h-4" />
            <span>Fazer Upgrade para Produtor PRO</span>
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
