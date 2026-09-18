'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, Crown, Shield, LogOut, PlusCircle, CreditCard, LogIn, Zap, Lock } from 'lucide-react';

import { UserProfileModal } from '@/components/ui/UserProfileModal';
import { MonthlyLimitModal } from '@/components/ui/MonthlyLimitModal';
import { UpgradeToProModal } from '@/components/ui/UpgradeToProModal';

export const Navbar: React.FC = () => {
  const {
    user,
    logout,
    systemSettings,
    monthlyGenerationsCount,
    showMonthlyLimitModal,
    setShowMonthlyLimitModal,
    showUpgradeModal,
    setShowUpgradeModal,
  } = useAuth();

  const pathname = usePathname();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (pathname && pathname.startsWith('/vendas')) {
    return null;
  }

  const isProUser =
    user &&
    (user.role === 'PRODUTOR_PRO' ||
      user.role === 'AGENCIA_COPRODUCAO' ||
      user.role === 'MASTER' ||
      user.role === 'EQUIPE_SUPORTE' ||
      user.role === 'admin' ||
      user.plan === 'pro' ||
      user.plan === 'produtorPro' ||
      user.plan === 'agencia' ||
      user.isExempt);

  const isIniciante = user && (user.role === 'PRODUTOR_INICIANTE' || user.plan === 'iniciante' || user.plan === 'free');

  return (
    <>
      <header className="no-print border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Fábrica Bits
              </span>
              <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 ml-1.5">
                SaaS v3.5
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <Link
              href="/criar-produto"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                pathname === '/criar-produto'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Criar Infoproduto</span>
            </Link>

            <Link
              href="/planos"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                pathname === '/planos'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Planos SaaS</span>
            </Link>

            <Link
              href="/afiliados"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                pathname === '/afiliados'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Afiliados (Em Breve)</span>
            </Link>

            {user && (user.role === 'admin' || user.role === 'MASTER' || user.role === 'EQUIPE_SUPORTE') && (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                    pathname === '/admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                      : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/40'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Painel Admin</span>
                </Link>
                {(() => {
                  const masterOn = systemSettings?.apiIntegrations?.masterSwitchEnabled !== false;
                  const statusLed = systemSettings?.apiIntegrations?.statusLed || 'green';

                  if (!masterOn || statusLed === 'red') {
                    return (
                      <span title="Chave Mestra Desativada / Motor Local 100%" className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-extrabold">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span>Motor Local</span>
                      </span>
                    );
                  }

                  if (statusLed === 'yellow') {
                    return (
                      <span title="IA Híbrida / Alerta de API" className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>IA Híbrida</span>
                      </span>
                    );
                  }

                  return (
                    <span title="IA OpenAI Conectada & Ativa" className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>IA API</span>
                    </span>
                  );
                })()}
              </div>
            )}
          </nav>

          {/* User Session Bar */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Contextual Badges */}
                {isIniciante ? (
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Cota: {monthlyGenerationsCount}/1 no mês</span>
                    </span>
                    <Link
                      href="/planos"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-[11px] font-black shadow-md transition-transform hover:scale-105"
                    >
                      <Crown className="w-3 h-3" />
                      <span>Upgrade PRO</span>
                    </Link>
                  </div>
                ) : isProUser ? (
                  <Link
                    href="/planos"
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] font-black hover:bg-indigo-500/30 transition-colors shadow-sm"
                  >
                    <Crown className="w-3 h-3 text-amber-300" />
                    <span>⭐ PRODUTOR PRO (Ilimitado)</span>
                  </Link>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold">
                      <Crown className="w-3 h-3 text-amber-300" />
                      <span>PLANO PRODUTOR</span>
                    </span>
                    <Link
                      href="/planos"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black shadow-md transition-transform hover:scale-105"
                    >
                      <Crown className="w-3 h-3 text-amber-300" />
                      <span>Upgrade PRO</span>
                    </Link>
                  </div>
                )}

                {/* User Profile Trigger */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 pl-2.5 pr-1.5 py-1 rounded-xl">
                  <div
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    title="Clique para editar Meus Dados & Senha"
                  >
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                    />
                    <div className="hidden sm:block text-left text-[11px] leading-tight">
                      <p className="font-bold text-slate-100 line-clamp-1">{user.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{user.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors ml-1"
                    title="Sair da Conta"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-transform hover:scale-[1.02]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      {isProfileModalOpen && <UserProfileModal onClose={() => setIsProfileModalOpen(false)} />}
      {showMonthlyLimitModal && <MonthlyLimitModal onClose={() => setShowMonthlyLimitModal(false)} />}
      {showUpgradeModal && <UpgradeToProModal onClose={() => setShowUpgradeModal(false)} />}
    </>
  );
};
