'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import { PromoCopySection } from '@/components/sales/PromoCopySection';
import { useAuth } from '@/lib/auth-context';
import { Crown, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CopysPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header currentStep={1} />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-2xl backdrop-blur-md animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500/40 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
              <Crown className="w-8 h-8 text-amber-300" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Acesso Restrito • Autenticação Necessária
              </span>
              <h1 className="text-2xl font-extrabold text-white">Faça Login para Gerar Copys Promocionais</h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Você precisa estar logado na sua conta para utilizar o gerador de variações de copy promocionais.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                <span>Entrar na Minha Conta</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header currentStep={1} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PromoCopySection />
      </main>
    </div>
  );
}
