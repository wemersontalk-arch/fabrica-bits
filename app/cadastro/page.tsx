'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { PlanType, User } from '@/types/infoproduct';
import { Sparkles, Crown, CheckCircle2, UserPlus, Clock, MessageCircle, ShieldCheck } from 'lucide-react';

export default function CadastroPage() {
  const { registerFreeBeta, login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createdBetaUser, setCreatedBetaUser] = useState<User | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    const registered = registerFreeBeta(name.trim(), email.trim());
    setCreatedBetaUser(registered);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 w-full max-w-lg space-y-8 backdrop-blur-md shadow-2xl animate-fadeIn">
        {createdBetaUser ? (
          /* Success Screen for Pending Beta */
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-300 border-2 border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                FASE BETA • CADASTRO REALIZADO
              </span>
              <h2 className="text-2xl font-extrabold text-white">Conta Criada! Aguardando Ativação</h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Olá <strong>{createdBetaUser.name}</strong>, sua conta gratuita em fase beta foi criada com sucesso! Para garantir a estabilidade do sistema, o seu acesso precisa ser liberado pelo Administrador.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Status da Conta:</span>
                <span className="font-extrabold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  PENDENTE DE LIBERAÇÃO
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>E-mail Cadastrado:</span>
                <span className="font-mono text-slate-100">{createdBetaUser.email}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://api.whatsapp.com/send?phone=5511999999999&text=${encodeURIComponent(
                  `Olá! Me cadastrei na fase beta do Infoproduct Engine AI com o e-mail ${createdBetaUser.email} e gostaria de solicitar a liberação do meu acesso.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Solicitar Ativação via WhatsApp</span>
              </a>

              <Link
                href="/login"
                className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Ir para a Página de Login</span>
              </Link>

            </div>
          </div>
        ) : (
          /* Register Form */
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/30">
                <UserPlus className="w-6 h-6 text-amber-300" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Cadastro Gratuito - Fase Beta</h1>
              <p className="text-xs text-slate-400">Crie sua conta para solicitar acesso de degustação à plataforma</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Amanda Ramos"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Seu E-mail Principal</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aviso de Liberação Beta</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Novos cadastros gratuitos são analisados e liberados pelo Administrador da plataforma antes do primeiro acesso aos módulos.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                Criar Conta Gratuita Beta
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              Já possui uma conta?{' '}
              <Link href="/login" className="text-emerald-400 font-bold hover:underline">
                Fazer login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
