'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { PlanType } from '@/types/infoproduct';
import { Crown, Sparkles, Check, ArrowRight, ShieldCheck, Zap, Clock, X, MessageSquare, CheckCircle2, Lock, CreditCard } from 'lucide-react';

export default function PlanosPage() {
  const { user, addToWaitlist, switchPlan, migrateUserPlan, approveBetaUser } = useAuth();
  const router = useRouter();

  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [selectedIntendedPlan, setSelectedIntendedPlan] = useState<'pro' | 'agency'>('pro');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [niche, setNiche] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Modal Checkout Simulado
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<{
    id: PlanType;
    name: string;
    price: string;
  } | null>(null);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  const handleOpenWaitlist = (plan: 'pro' | 'agency') => {
    setSelectedIntendedPlan(plan);
    setIsWaitlistModalOpen(true);
    setIsSuccess(false);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !whatsapp.trim()) return;

    addToWaitlist(name.trim(), email.trim(), whatsapp.trim(), selectedIntendedPlan, niche.trim());
    setIsSuccess(true);
  };

  const handleSelectPlan = (planId: PlanType, planName: string, planPrice: string) => {
    if (!user) {
      router.push(`/cadastro?plan=${planId}`);
      return;
    }

    // Se já tiver o plano ativo
    if (user.plan === planId && user.status === 'active') {
      router.push('/criar-produto');
      return;
    }

    setSelectedCheckoutPlan({ id: planId, name: planName, price: planPrice });
    setIsCheckoutSuccess(false);
  };

  const handleConfirmCheckout = () => {
    if (!selectedCheckoutPlan || !user) return;

    // Liberar acesso e migrar plano
    migrateUserPlan(user.id, selectedCheckoutPlan.id);
    if (user.status === 'pending_beta') {
      approveBetaUser(user.id);
    }

    setIsCheckoutSuccess(true);
    setTimeout(() => {
      setSelectedCheckoutPlan(null);
      router.push('/criar-produto');
    }, 1500);
  };

  const plans: {
    id: PlanType;
    name: string;
    price: string;
    period: string;
    desc: string;
    popular?: boolean;
    isComingSoon?: boolean;
    features: string[];
    cta: string;
    badgeColor: string;
  }[] = [
    {
      id: 'iniciante',
      name: 'Produtor Iniciante',
      price: 'R$ 37',
      period: '/mês',
      desc: 'Ideal para quem está lançando seu primeiro infoproduto no modelo Pay-As-You-Go.',
      features: [
        'Carteira com Créditos de Geração de IA',
        'Geração de Infoproduto em 5 Módulos',
        'Modelos de Checklists e Alertas de Erros',
        'Exportação em PDF A4 Diagramado',
        'Suporte por e-mail',
      ],
      cta: 'Assinar Produtor Iniciante',
      badgeColor: 'border-slate-800 text-slate-300 bg-slate-900',
    },
    {
      id: 'produtor',
      name: 'Produtor',
      price: 'R$ 97',
      period: '/mês',
      desc: 'Para infoprodutores que buscam criar e vender cursos com suporte a Landing Page.',
      features: [
        'Geração de 5 e 7 Módulos Práticos',
        'Exportação em PDF A4 Premium Diagramado',
        'Vídeos Recomendados do YouTube & Fontes Oficiais',
        'Gerador de 10 Variações de Copy Promocional',
        'Construtor de Landing Page & Rota de Vendas',
        'Suporte via comunidade',
      ],
      cta: 'Assinar Plano Produtor',
      badgeColor: 'border-indigo-500 text-indigo-300 bg-indigo-950/60 shadow-lg shadow-indigo-500/20',
    },
    {
      id: 'pro',
      name: 'Produtor Pro',
      price: 'R$ 197',
      period: '/mês',
      desc: 'O plano definitivo com IA ilimitada, Área de Membros completa e emissão de Certificados.',
      popular: true,
      features: [
        'Criação Ilimitada em 5, 7 ou 10 Módulos',
        'Área de Membros com Trava de 60% e Simulação de Aluno',
        'Emissão de Certificado Oficial com Validador de CPF',
        'Landing Page Funil Builder + Rota de Vendas Oficial',
        'Integração Checkout (Hotmart, Kiwify & Eduzz)',
        'Edição In-Place completa do conteúdo dos módulos',
        'Suporte Prioritário no WhatsApp',
      ],
      cta: 'Assinar Produtor Pro',
      badgeColor: 'border-emerald-500 text-emerald-300 bg-emerald-950/60 shadow-lg shadow-emerald-500/20',
    },
    {
      id: 'agencia',
      name: 'Agência & Co-produção',
      price: 'R$ 497',
      period: '/mês',
      desc: 'Para agências e coprodutores que gerenciam múltiplos especialistas e Workspaces.',
      isComingSoon: true,
      features: [
        'Tudo do Plano Pro incluído para múltiplos autores',
        'Gestão de Workspaces de Co-produção Multi-Especialista',
        'Exportação de Pacotes em Lote (JSON / CSV)',
        'Integração de Webhook & API nativa',
        'Gerente de Conta dedicado no WhatsApp',
      ],
      cta: 'Disponível Em Breve / Lista VIP',
      badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-fadeIn flex flex-col min-h-screen justify-between">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Planos de Acesso Comercial • Fábrica Bits</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Escolha o Plano Ideal para Acelerar Seus Infoprodutos
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            De iniciante a grande produtor, escolha a estrutura que vai transformar o seu conhecimento em vendas diárias.
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((p) => {
            const isCurrent = user?.plan === p.id && user?.status === 'active';

            return (
              <div
                key={p.id}
                className={`relative rounded-3xl border p-6 flex flex-col justify-between space-y-6 backdrop-blur-md transition-all ${
                  p.popular
                    ? 'bg-slate-900/95 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105 z-10'
                    : p.isComingSoon
                    ? 'bg-slate-950/80 border-amber-500/40 opacity-90'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-indigo-600 text-slate-950 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md whitespace-nowrap">
                    🔥 MAIS POPULAR ENTRE INFOPRODUTORES
                  </div>
                )}

                {p.isComingSoon && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 whitespace-nowrap">
                    <Lock className="w-3 h-3" /> DISPONÍVEL EM BREVE
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center justify-between">
                      <span>{p.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-extrabold">
                          SEU PLANO ATUAL
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 border-b border-slate-800 pb-4">
                    <span className="text-3xl font-black text-white">{p.price}</span>
                    <span className="text-xs text-slate-400 font-semibold">{p.period}</span>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  {p.isComingSoon ? (
                    <button
                      onClick={() => handleOpenWaitlist('agency')}
                      className="w-full py-3.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-extrabold text-xs shadow transition-all flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Entrar na Lista VIP Agência</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(p.id, p.name, p.price)}
                      className={`w-full py-3.5 rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                        isCurrent
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : p.popular
                          ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 shadow-emerald-500/20 hover:scale-[1.02]'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                      }`}
                    >
                      <span>{isCurrent ? 'Acessar Sistema' : p.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Checkout & Liberação de Acesso */}
      {selectedCheckoutPlan && (
        <div className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Checkout & Liberação de Acesso</h3>
              </div>
              <button onClick={() => setSelectedCheckoutPlan(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isCheckoutSuccess ? (
              <div className="text-center space-y-4 py-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold text-white">Pagamento Aprovado & Acesso Liberado!</h4>
                  <p className="text-xs text-slate-300">
                    Seu plano <strong>{selectedCheckoutPlan.name}</strong> foi ativado com sucesso. Redirecionando para o criador de infoprodutos...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-left">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Plano Selecionado:</span>
                    <span className="font-extrabold text-white">{selectedCheckoutPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Valor da Assinatura:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{selectedCheckoutPlan.price} /mês</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-2">
                    <span className="text-slate-400">Status de Ativação:</span>
                    <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      IMEDIATO (LIBERAÇÃO INSTANTÂNEA)
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-2 text-xs text-indigo-200">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ambiente Seguro de Checkout</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Clique no botão abaixo para simular o pagamento e ativar imediatamente os recursos do plano na sua conta!
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleConfirmCheckout}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-xl transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Confirmar Pagamento & Liberar Acesso Agora</span>
                  </button>

                  <button
                    onClick={() => setSelectedCheckoutPlan(null)}
                    className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-semibold"
                  >
                    Voltar aos Planos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Lista de Espera / Solicitação de Plano */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Solicitação de Plano - {selectedIntendedPlan.toUpperCase()}
                </h3>
              </div>
              <button onClick={() => setIsWaitlistModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <div className="text-center space-y-4 py-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Solicitação Registrada!</h4>
                  <p className="text-xs text-slate-300">
                    Sua solicitação foi enviada com sucesso. Entraremos em contato via WhatsApp para confirmar seu acesso VIP.
                  </p>
                </div>
                <button
                  onClick={() => setIsWaitlistModalOpen(false)}
                  className="w-full py-3 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl"
                >
                  Concluído
                </button>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4 text-left">
                <p className="text-xs text-slate-300">
                  Preencha seus dados para receber o link direto de ativação e onboarding do plano.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">E-mail Principal</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">WhatsApp para Contato (DDD + Número)</label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Seu Nicho de Atuação (Opcional)</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Ex: Gastronomia, Finanças, Saúde"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-indigo-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  Enviar Solicitação
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 mt-12">
        Fábrica Bits © 2026 • É um sistema da UniversoBits.com.br
      </footer>
    </div>
  );
}
