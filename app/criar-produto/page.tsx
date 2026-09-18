'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';

import { StepDiagnosis } from '@/components/wizard/StepDiagnosis';
import { StepGeneration } from '@/components/wizard/StepGeneration';
import { StepWorkspace } from '@/components/wizard/StepWorkspace';
import { InfoproductInput, GeneratedInfoproduct, GenerationStep } from '@/types/infoproduct';
import { generateInfoproductPipeline } from '@/lib/generate-engine';

import { useAuth } from '@/lib/auth-context';
import { canGenerateProduct } from '@/lib/permissions';
import { Clock, MessageCircle, Crown } from 'lucide-react';

export default function CriarProdutoPage() {
  const {
    user,
    systemSettings,
    monthlyGenerationsCount,
    incrementGenerationCount,
    setShowMonthlyLimitModal,
  } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [productData, setProductData] = useState<GeneratedInfoproduct | null>(null);

  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: 1, label: 'Pipeline 1: Arquitetura do Método Exclusivo', status: 'idle', detail: 'Definindo nome do método e promessa central' },
    { id: 2, label: 'Pipeline 1: Ícones e Módulos Estratégicos', status: 'idle', detail: 'Desenhando índice com 5 capítulos operacionais' },
    { id: 3, label: 'Pipeline 2: Desenvolvimento de Conteúdo Técnico', status: 'idle', detail: 'Redigindo passo a passo, alertas de erros e checklists' },
    { id: 4, label: 'Pipeline 3: Kit de Vendas Integrado', status: 'idle', detail: 'Gerando copy de Landing Page e mensagens de WhatsApp' },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const handleDiagnosisSubmit = async (input: InfoproductInput) => {
    // Validar regras de negócio e cota mensal
    const check = canGenerateProduct(user, monthlyGenerationsCount);
    if (!check.allowed) {
      if (check.isMonthlyLimitReached) {
        setShowMonthlyLimitModal(true);
      } else {
        alert(check.reason || 'Você não tem permissão para gerar infoprodutos.');
      }
      return;
    }

    setCurrentStep(2);
    setCurrentStepIndex(0);

    try {
      const generated = await generateInfoproductPipeline(input, (stepId, status, detail) => {
        setSteps((prevSteps) =>
          prevSteps.map((s) => (s.id === stepId ? { ...s, status, detail } : s))
        );
        setCurrentStepIndex(stepId - 1);
      });

      // Incrementar gerações efetuadas no mês
      incrementGenerationCount();

      setProductData(generated);
      setCurrentStep(3);
    } catch (error) {
      console.error('Erro no pipeline:', error);
      alert('Ocorreu um erro no processamento. Tente novamente.');
      setCurrentStep(1);
    }
  };

  const handleReset = () => {
    setProductData(null);
    setCurrentStep(1);
    setSteps((prev) => prev.map((s) => ({ ...s, status: 'idle' })));
  };

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
              <h1 className="text-2xl font-extrabold text-white">Faça Login para Criar Infoprodutos</h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Você precisa estar logado na sua conta para utilizar a Inteligência Artificial e gerar seus infoprodutos completos.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                <span>Entrar na Minha Conta</span>
              </Link>

              <Link
                href="/cadastro"
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-extrabold text-xs rounded-xl transition-colors block"
              >
                Ainda não tem conta? Criar Conta Grátis
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const companyInfo = systemSettings?.companyInfo || {
    companyName: 'UniversoBits',
    supportEmail: 'suporte@universobits.com.br',
    whatsappContact: '',
    enableWhatsappActivation: false,
  };

  const whatsappClean = companyInfo.whatsappContact ? companyInfo.whatsappContact.replace(/\D/g, '') : '';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=55${whatsappClean}&text=${encodeURIComponent(
    `Olá! Meu e-mail é ${user.email} e gostaria de solicitar a aprovação do meu acesso à fase beta.`
  )}`;

  if (user && user.status === 'pending_beta') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header currentStep={1} />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-2xl backdrop-blur-md animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-300 border-2 border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Aguardando Liberação do Admin
              </span>
              <h1 className="text-2xl font-extrabold text-white">Sua Conta Está em Fase de Análise Beta</h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Olá <strong>{user.name}</strong> ({user.email}), sua solicitação de acesso gratuito à plataforma está registrada. Assim que o Administrador aprovar sua conta no painel, o gerador será liberado.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {companyInfo.enableWhatsappActivation && whatsappClean ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Solicitar Aprovação no WhatsApp</span>
                </a>
              ) : (
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1 text-left">
                  <p className="font-bold text-amber-400">📧 Suporte & Atendimento</p>
                  <p className="text-[11px] text-slate-400">
                    Sua conta está na fila de análise. Se precisar de ajuda, envie um e-mail para: <strong className="text-slate-200">{companyInfo.supportEmail}</strong>
                  </p>
                </div>
              )}

              <Link
                href="/login"
                className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Ir para a Página de Login</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header currentStep={currentStep} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentStep === 1 && <StepDiagnosis onSubmit={handleDiagnosisSubmit} />}

        {currentStep === 2 && (
          <StepGeneration steps={steps} currentStepIndex={currentStepIndex} />
        )}

        {currentStep === 3 && productData && (
          <StepWorkspace product={productData} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
