'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Crown,
  Share2,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
  Shield,
  Zap,
  Lock
} from 'lucide-react';

export default function AfiliadosPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 animate-fadeIn pb-24">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Lançamento em Breve</span>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Programa de Afiliados <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-indigo-300 bg-clip-text text-transparent">
              Fábrica Bits
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Estamos preparando nossa infraestrutura de comissões automáticas para alavancar suas vendas. Fique atento às notificações.
          </p>
        </div>
      </div>

      {/* Feature Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3 shadow-xl backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-white">Comissão Automática</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Split de pagamento em tempo real via Asaas/Kiwify. Receba sua comissão direto na carteira no instante em que a venda for efetuada.
          </p>
        </div>

        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3 shadow-xl backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-lg">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-white">Links Parametrizados</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Links de indicação exclusivos com rastreamento por cookies de até 180 dias e atribuição ao primeiro ou último clique.
          </p>
        </div>

        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3 shadow-xl backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-white">Dashboard de Métricas</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Acompanhe cliques, taxas de conversão por checkout, saldo a sacar e relatórios detalhados em um painel profissional.
          </p>
        </div>
      </div>

      {/* Early Access Form */}
      <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            Lista de Espera VIP
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">Seja um dos Primeiros Afiliados</h2>
          <p className="text-xs text-slate-400">
            Garanta taxas de comissão diferenciadas no pré-lançamento da nossa rede de afiliados.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto font-black shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-emerald-300">Inscrição Confirmada!</h3>
            <p className="text-xs text-slate-300">
              Obrigado, <strong>{name}</strong>! Entraremos em contato via <strong>{email}</strong> assim que as primeiras vagas do programa forem liberadas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Seu Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Silva"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">E-mail Principal</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos@exemplo.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Bell className="w-4 h-4" />
              <span>Quero Acesso VIP ao Programa de Afiliados</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
