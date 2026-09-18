'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { canAccessLMS } from '@/lib/permissions';
import { GeneratedInfoproduct, Chapter } from '@/types/infoproduct';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Award,
  Crown,
  Lock,
  ChevronRight,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  ArrowLeft,
  Share2,
  Printer,
  X,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

const DEFAULT_FALLBACK_PRODUCT: GeneratedInfoproduct = {
  id: 'metodo-lucro-digital-1',
  methodName: 'Método Lucro Digital 360',
  tagline: 'Construa e Escale seu Negócio Digital com Estratégia de Alto VGV',
  promise: 'Aprenda o passo a passo para criar e vender infoprodutos todos os dias',
  coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  targetAudienceProfile: 'Empreendedores e Criadores de Conteúdo que desejam monetizar seu conhecimento',
  input: {
    niche: 'Vendas & Marketing Digital',
    subniche: 'Criação e Lançamento de Infoprodutos do Zero',
    targetAudience: 'Iniciantes e Intermediários',
    painPoints: 'Falta de método estruturado e tráfego pago',
    hiddenDesires: 'Ter liberdade financeira e vendas automáticas',
    tone: 'pratico',
    format: 'ebook_guiado',
    moduleCount: 5,
    enableQuiz: true,
  },
  chapters: [
    {
      id: 1,
      title: 'Fundamentos do Posicionamento Único de Mercado',
      subtitle: 'Como validar sua promessa irresistível e encontrar o cliente ideal',
      objective: 'Definir o nicho rentável e criar uma oferta que elimina objeções',
      introduction: 'Para criar um infoproduto que vende todos os dias, a clareza da sua oferta é o pilar mais crítico...',
      frameworkName: 'Framework 3V (Visão, Valor, Venda)',
      mentorCallouts: {
        tip: 'Concentre-se em resolver 1 dor específica antes de tentar abraçar múltiplos problemas.',
        warning: 'Não crie um produto antes de validar se o público-alvo tem intenção de compra.',
        challenge: 'Escreva sua promessa central em no máximo 2 frases simples.',
      },
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Pesquisa de Objeções Reais',
          description: 'Analise comentários e perguntas frequentes do seu público no Instagram e YouTube.',
          actionItem: 'Mapear as 5 maiores dúvidas do seu nicho.',
        },
      ],
      commonMistakes: [],
      caseStudy: { title: 'Caso de Sucesso', scenario: 'Produtor do nicho de finanças', result: 'Faturou R$ 15.000 no primeiro mês' },
      checklists: [
        { id: 'chk_1_1', item: 'Identificar a dor número 1 do público-alvo', explanation: 'Garante que o infoproduto seja indispensável' },
        { id: 'chk_1_2', item: 'Validar a promessa em frase única', explanation: 'Comunicação clara vende mais rápido' },
      ],
      summaryTable: { headers: ['Etapa', 'Ação'], rows: [['Nicho', 'Definir subnicho específico']] },
    },
  ],
  salesKit: {
    landingPageCopy: {
      headline: 'Aprenda a Criar Infoprodutos de Alto Impacto',
      subheadline: 'O método prático para transformar seu conhecimento em receita recorrente',
      problemSection: ['Falta de tempo', 'Dificuldade de estruturação'],
      solutionSection: 'Fábrica Bits entrega a solução pronta em minutos',
      methodHighlights: ['IA Multi-step', 'Copy de alta conversão'],
      objectionHandling: [],
      authorBio: 'Especialistas em Engenharia de Infoprodutos',
      faq: [],
      ctaText: 'Quero Garantir Meu Acesso Agora',
    },
    whatsappSequence: [],
  },
  createdAt: '17/09/2026',
};

interface StudentLmsContentProps {
  cursoId: string;
}

export const StudentLmsContent: React.FC<StudentLmsContentProps> = ({ cursoId }) => {
  const { user, setShowUpgradeModal } = useAuth();
  const effectiveCursoId = cursoId || 'metodo-lucro-digital-1';

  // Carregar infoproduto
  const [product, setProduct] = useState<GeneratedInfoproduct | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Estado dos Checklists do Aluno (persistidos no LocalStorage)
  const [completedChecklists, setCompletedChecklists] = useState<Record<string, boolean>>({});
  const [completedChapters, setCompletedChapters] = useState<Record<number, boolean>>({});
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const [bannedReason, setBannedReason] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 🔒 Validação de Autorização BOLA/IDOR no Servidor
    fetch(`/api/estudo/${effectiveCursoId}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 403 || (data && !data.success && data.error?.includes('BOLA'))) {
          setBannedReason(data.error || 'Acesso negado: Você não possui permissão ou matrícula ativa para este curso.');
          return;
        }
        if (data.success && data.product) {
          setProduct((prev) => {
            const base = prev || DEFAULT_FALLBACK_PRODUCT;
            return {
              ...base,
              id: data.product.id,
              methodName: data.product.title,
              tagline: data.product.description || base.tagline,
              promise: data.product.description || base.promise,
              chapters: data.product.content?.chapters || base.chapters,
            };
          });
        }
      })
      .catch(() => {});

    // Buscar no localStorage primeiro como fallback local
    let foundProduct: GeneratedInfoproduct | null = null;
    const storedList = localStorage.getItem('infoproduct_saved_products');
    if (storedList) {
      try {
        const list: GeneratedInfoproduct[] = JSON.parse(storedList);
        foundProduct = list.find((p) => p.id === effectiveCursoId || p.salesKit?.funnelCheckoutUrl?.includes(effectiveCursoId)) || null;
      } catch (e) {}
    }

    if (!foundProduct) {
      foundProduct = DEFAULT_FALLBACK_PRODUCT;
    }

    setProduct((prev) => prev || foundProduct);

    // Carregar progresso do checklist
    const storedChecklist = localStorage.getItem(`infoproduct_lms_checklist_${effectiveCursoId}`);
    if (storedChecklist) {
      try {
        setCompletedChecklists(JSON.parse(storedChecklist));
      } catch (e) {}
    }

    // Carregar capítulos concluídos
    const storedChapters = localStorage.getItem(`infoproduct_lms_chapters_${effectiveCursoId}`);
    if (storedChapters) {
      try {
        setCompletedChapters(JSON.parse(storedChapters));
      } catch (e) {}
    }
  }, [effectiveCursoId]);

  const accessCheck = canAccessLMS(user);

  if (bannedReason) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border-2 border-red-500/40 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-500/20 text-red-300 border border-red-500/30">
              Bloqueio de Segurança Server-Side (BOLA/IDOR)
            </span>
            <h1 className="text-xl font-black text-white">Acesso Negado ao Infoproduto</h1>
            <p className="text-xs text-slate-300 leading-relaxed">{bannedReason}</p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl block transition-colors"
            >
              Voltar ao Painel Inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!accessCheck.allowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Área de Membros Restrita
            </span>
            <h1 className="text-2xl font-black text-white">Recurso Exclusivo Produtor PRO</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {accessCheck.reason}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-xs rounded-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Desbloquear Acesso Produtor PRO</span>
            </button>

            <Link
              href="/planos"
              className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 font-bold text-xs rounded-xl block transition-colors"
            >
              Ver Comparativo de Planos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Carregando Área de Membros...</p>
        </div>
      </div>
    );
  }

  const currentChapter: Chapter = product.chapters[activeChapterIndex] || product.chapters[0];
  const totalChapters = product.chapters.length;

  // Toggle de Checklist Item
  const toggleChecklist = (id: string) => {
    const updated = { ...completedChecklists, [id]: !completedChecklists[id] };
    setCompletedChecklists(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`infoproduct_lms_checklist_${effectiveCursoId}`, JSON.stringify(updated));
    }
  };

  // Toggle de Conclusão do Capítulo
  const toggleChapterComplete = (chapterId: number) => {
    const updated = { ...completedChapters, [chapterId]: !completedChapters[chapterId] };
    setCompletedChapters(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`infoproduct_lms_chapters_${effectiveCursoId}`, JSON.stringify(updated));
    }
  };

  // Cálculo de Progresso
  const completedCount = Object.values(completedChapters).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);
  const is100Completed = progressPercent === 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header LMS Bar */}
      <header className="no-print border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Área de Membros do Aluno
              </span>
              <h1 className="text-base font-extrabold text-white line-clamp-1">{product.methodName}</h1>
            </div>
          </div>

          {/* Progress Bar & Certificate Button */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="space-y-1 w-44">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Progresso do Aluno</span>
                <span className="text-emerald-400 font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (is100Completed) {
                  setShowCertificateModal(true);
                } else {
                  alert(`Seu progresso atual é de ${progressPercent}%. Conclua todos os ${totalChapters} capítulos para desbloquear seu Certificado Oficial!`);
                }
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
                is100Completed
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105'
                  : 'bg-slate-950 text-slate-500 border border-slate-800 cursor-not-allowed opacity-80'
              }`}
            >
              <Award className={`w-4 h-4 ${is100Completed ? 'text-slate-950' : 'text-slate-600'}`} />
              <span>Certificado</span>
              {!is100Completed && <Lock className="w-3 h-3 text-slate-600 ml-1" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
        {/* Sidebar: Navigation Modules & Chapters */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-sm sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Módulos do Treinamento
              </h2>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                {totalChapters} Aulas
              </span>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 custom-scrollbar">
              {product.chapters.map((chap, idx) => {
                const isActive = activeChapterIndex === idx;
                const isCompleted = !!completedChapters[chap.id];

                return (
                  <button
                    key={chap.id}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isActive
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-indigo-400">
                          Módulo {idx + 1}
                        </span>
                        {isCompleted && (
                          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold rounded">
                            Concluído
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold leading-snug line-clamp-2">{chap.title}</p>
                    </div>

                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Reader Area: Active Chapter Content */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl backdrop-blur-sm">
            {/* Chapter Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Módulo {activeChapterIndex + 1} de {totalChapters}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{currentChapter.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300">{currentChapter.subtitle}</p>
              </div>

              <button
                onClick={() => toggleChapterComplete(currentChapter.id)}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow ${
                  completedChapters[currentChapter.id]
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completedChapters[currentChapter.id] ? 'Concluído' : 'Marcar como Concluído'}</span>
              </button>
            </div>

            {/* Framework Highlight Banner */}
            {currentChapter.frameworkName && (
              <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-slate-950 border border-indigo-500/30 rounded-2xl flex items-center gap-3">
                <Target className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-300">Framework Prático Aplicado:</span>
                  <p className="text-xs font-extrabold text-white">{currentChapter.frameworkName}</p>
                </div>
              </div>
            )}

            {/* Core Lesson Content */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                1. Visão Geral & Teoria Central
              </h3>
              <p className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl text-slate-300">
                {currentChapter.introduction}
              </p>

              {currentChapter.fullLessonContent && (
                <div className="space-y-3 pt-2">
                  <p>{currentChapter.fullLessonContent.coreTheory}</p>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Execução Prática Recomendada:</span>
                    <p className="text-xs text-slate-300">{currentChapter.fullLessonContent.practicalExecution}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mentor Callouts (Tips & Warnings) */}
            {currentChapter.mentorCallouts && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1 text-xs">
                  <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" /> Dica de Mentor:
                  </span>
                  <p className="text-slate-300">{currentChapter.mentorCallouts.tip}</p>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-1 text-xs">
                  <span className="font-extrabold text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" /> Cuidado com esse Erro:
                  </span>
                  <p className="text-slate-300">{currentChapter.mentorCallouts.warning}</p>
                </div>
              </div>
            )}

            {/* Step By Step Execution */}
            {currentChapter.stepByStep && currentChapter.stepByStep.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  2. Passo a Passo Operacional
                </h3>
                <div className="space-y-3">
                  {currentChapter.stepByStep.map((step) => (
                    <div key={step.stepNumber} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-[11px] flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <h4 className="font-extrabold text-white text-xs">{step.title}</h4>
                      </div>
                      <p className="text-slate-300 pl-8">{step.description}</p>
                      <div className="ml-8 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-semibold text-[11px]">
                        🎯 Ação: {step.actionItem}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Checklists Section */}
            {currentChapter.checklists && currentChapter.checklists.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" /> Checklist Prático de Validação do Módulo
                </h3>
                <div className="space-y-2">
                  {currentChapter.checklists.map((chk) => {
                    const isChecked = !!completedChecklists[chk.id];
                    return (
                      <label
                        key={chk.id}
                        className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChecklist(chk.id)}
                          className="mt-0.5 rounded border-slate-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                        />
                        <div className="space-y-0.5 text-xs">
                          <p className={`font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                            {chk.item}
                          </p>
                          <p className="text-[11px] text-slate-400">{chk.explanation}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chapter Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                disabled={activeChapterIndex === 0}
                onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 font-bold text-xs rounded-xl text-slate-300 transition-colors"
              >
                ← Aula Anterior
              </button>

              <button
                disabled={activeChapterIndex === totalChapters - 1}
                onClick={() => setActiveChapterIndex((prev) => Math.min(totalChapters - 1, prev + 1))}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-extrabold text-xs rounded-xl text-white shadow-lg shadow-indigo-600/20 transition-transform hover:scale-105"
              >
                Próxima Aula →
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DE CERTIFICADO DE CONCLUSÃO (DESBLOQUEADO A 100%) */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-amber-500/60 rounded-3xl w-full max-w-2xl p-8 space-y-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Frame do Certificado */}
            <div className="p-8 border-2 border-dashed border-amber-500/40 rounded-2xl bg-slate-950 space-y-6 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border-2 border-amber-500/40 flex items-center justify-center mx-auto shadow-xl">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  Certificado Oficial de Conclusão
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {product.methodName}
                </h2>
                <p className="text-xs text-slate-400">Certificamos que o aluno(a):</p>
                <p className="text-xl sm:text-2xl font-black text-amber-300 underline decoration-amber-500/50">
                  {user?.name || 'Aluno(a) de Excelência'}
                </p>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed pt-2">
                  concluiu com êxito 100% da carga horária e checklists práticos do método <strong>{product.methodName}</strong> na plataforma Fábrica Bits.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                <div>
                  <p>Emitido em: {new Date().toLocaleDateString('pt-BR')}</p>
                  <p>Código de Autenticação: CERT-{Date.now().toString(36).toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verificado Fábrica Bits</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir ou Salvar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
