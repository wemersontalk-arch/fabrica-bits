import React, { useState, useEffect } from 'react';
import { GeneratedInfoproduct, Chapter, StudentCertificateInfo } from '@/types/infoproduct';
import { validateCPF, formatCPF } from '@/lib/cpf-validator';
import { slugify } from '@/lib/slugify';
import {
  BookOpen,
  ShoppingBag,
  Download,
  Sparkles,
  CheckSquare,
  AlertTriangle,
  Lightbulb,
  FileText,
  Copy,
  Check,
  Layers,
  ChevronRight,
  Share2,
  Image as ImageIcon,
  Award,
  Lock,
  HelpCircle,
  Layout,
  ExternalLink,
  ShieldCheck,
  Eye,
  UserCheck,
  Crown,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Video,
  Globe,
  Play,
  Edit3,
  Save,
  Zap,
  X
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { ExportModal } from '@/components/export/ExportModal';
import { EbookPrintTemplate } from '@/components/export/EbookPrintTemplate';
import { FunnelPreviewModal } from '@/components/sales/FunnelPreviewModal';
import { IntegrationModal } from '@/components/sales/IntegrationModal';
import { PromoCopySection } from '@/components/sales/PromoCopySection';

import { useAuth } from '@/lib/auth-context';
import { canAccessLMS } from '@/lib/permissions';
import { useRouter } from 'next/navigation';

interface StepWorkspaceProps {
  product: GeneratedInfoproduct;
  onReset: () => void;
}

export const StepWorkspace: React.FC<StepWorkspaceProps> = ({ product, onReset }) => {
  const { user, setShowUpgradeModal } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'chapters' | 'sales' | 'copys' | 'certificate'>('chapters');

  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [completedChecklists, setCompletedChecklists] = useState<Record<string, boolean>>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFunnelModalOpen, setIsFunnelModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  // Persistir produto gerado/editado no localStorage sob o slug correspondente
  useEffect(() => {
    if (!product || !product.methodName) return;
    try {
      const slug = slugify(product.methodName);
      localStorage.setItem('infoproduct_current_product', JSON.stringify(product));
      localStorage.setItem(`infoproduct_slug_${slug}`, JSON.stringify(product));

      const historyRaw = localStorage.getItem('infoproduct_history');
      let historyArr: GeneratedInfoproduct[] = historyRaw ? JSON.parse(historyRaw) : [];
      if (!Array.isArray(historyArr)) historyArr = [];
      const idx = historyArr.findIndex((p) => p && p.methodName && slugify(p.methodName) === slug);
      if (idx >= 0) {
        historyArr[idx] = product;
      } else {
        historyArr.unshift(product);
      }
      localStorage.setItem('infoproduct_history', JSON.stringify(historyArr));
    } catch (e) {
      console.error('Erro ao salvar produto no localStorage:', e);
    }
  }, [product]);

  // Edição In-Place do Módulo
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [editChapterForm, setEditChapterForm] = useState<Chapter | null>(null);

  const handleStartEditChapter = (ch: Chapter) => {
    setEditChapterForm(JSON.parse(JSON.stringify(ch)));
    setIsEditingChapter(true);
  };

  const handleSaveChapterEdit = () => {
    if (!editChapterForm) return;
    product.chapters[selectedChapterIndex] = editChapterForm;
    setIsEditingChapter(false);
  };

  // Papéis: 'producer' (Dono) vs 'student' (Aluno)
  const [userRole, setUserRole] = useState<'producer' | 'student'>('producer');
  // Modo de teste: 'creator' (Preview Livre) vs 'student_gated' (Trava 60%)
  const [viewMode, setViewMode] = useState<'creator' | 'student_gated'>('creator');

  // Cadastro do Aluno e Emissão de Certificado com CPF Válido
  const [studentFullName, setStudentFullName] = useState('Amanda Souza Santos');
  const [studentCPF, setStudentCPF] = useState('123.456.789-00');
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [certificateData, setCertificateData] = useState<StudentCertificateInfo | null>(null);

  // Quiz e pontuações
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Record<number, number>>>({});
  const [unlockedModules, setUnlockedModules] = useState<Record<number, boolean>>({ 1: true });
  const [quizScores, setQuizScores] = useState<Record<number, number>>({});

  const chapter: Chapter = product.chapters[selectedChapterIndex] || product.chapters[0];

  const toggleChecklist = (id: string) => {
    setCompletedChecklists((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSelectQuizOption = (chapterId: number, questionIdx: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [chapterId]: {
        ...(prev[chapterId] || {}),
        [questionIdx]: optionIdx,
      },
    }));
  };

  const handleEvaluateQuiz = (ch: Chapter) => {
    if (!ch.quiz || ch.quiz.length === 0) return;

    const userAns = quizAnswers[ch.id] || {};
    let correctCount = 0;

    ch.quiz.forEach((q, idx) => {
      if (userAns[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / ch.quiz.length) * 100);
    setQuizScores((prev) => ({ ...prev, [ch.id]: scorePct }));

    if (scorePct >= 60) {
      const nextId = ch.id + 1;
      if (nextId <= product.chapters.length) {
        setUnlockedModules((prev) => ({ ...prev, [nextId]: true }));
      }
    }
  };

  const isCourseFullyCompleted =
    viewMode === 'creator' ||
    product.chapters.every((ch) => {
      if (!product.input.enableQuiz) return true;
      return (quizScores[ch.id] || 0) >= 60;
    });

  const handleCPFChange = (val: string) => {
    const formatted = formatCPF(val);
    setStudentCPF(formatted);
    if (formatted.length === 14) {
      if (!validateCPF(formatted)) {
        setCpfError('CPF inválido de acordo com o padrão brasileiro (dígito verificador incorreto).');
      } else {
        setCpfError(null);
      }
    } else {
      setCpfError(null);
    }
  };

  const handleEmitCertificate = () => {
    if (!studentFullName.trim()) {
      alert('Por favor, informe seu Nome Completo.');
      return;
    }
    if (!validateCPF(studentCPF)) {
      setCpfError('CPF inválido. Por favor, insira um CPF válido para autenticar o certificado.');
      return;
    }

    setCpfError(null);
    setCertificateData({
      fullName: studentFullName.trim(),
      cpf: formatCPF(studentCPF),
      issuedAt: new Date().toLocaleDateString('pt-BR'),
      certificateId: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Role Switcher Bar */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-400 uppercase tracking-wider">Visão Atual da Plataforma:</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setUserRole('producer');
                setViewMode('creator');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userRole === 'producer'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Visão do Produtor (Dono)</span>
            </button>

            <button
              onClick={() => {
                setUserRole('student');
                setViewMode('student_gated');
                setActiveTab('chapters');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                userRole === 'student'
                  ? 'bg-emerald-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Visão do Aluno (Área de Membros)</span>
            </button>
          </div>
        </div>

        {userRole === 'producer' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'creator' ? 'student_gated' : 'creator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                viewMode === 'creator'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {viewMode === 'creator' ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Modo Teste do Criador (Sem Trava)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Modo Simulação do Aluno (Trava 60%)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Top Header */}
      <div className="no-print bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
              {product.chapters.length} MÓDULOS • {product.input.format.replace('_', ' ').toUpperCase()}
            </span>
            {userRole === 'student' && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                ÁREA EXCLUSIVA DO ALUNO
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            {product.methodName}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">{product.tagline}</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {userRole === 'producer' && (
            <>
              <button
                onClick={() => {
                  const check = canAccessLMS(user);
                  if (check.allowed) {
                    router.push(`/estudo/${product.id}`);
                  } else {
                    setShowUpgradeModal(true);
                  }
                }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Área de Membros (LMS)</span>
                {!canAccessLMS(user).allowed && <Lock className="w-3.5 h-3.5 text-amber-300 ml-0.5" />}
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Exportar PDF (E-book A4)</span>
              </button>
            </>
          )}

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
          >
            <span>Novo</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="no-print flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('chapters')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'chapters'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Módulos ({product.chapters.length})</span>
        </button>

        {userRole === 'producer' && (
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'sales'
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Kit de Vendas & Funil</span>
          </button>
        )}


        {product.input.enableQuiz && (
          <button
            onClick={() => setActiveTab('certificate')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'certificate'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificado {isCourseFullyCompleted ? '🏆' : '🔒'}</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="no-print">
        {activeTab === 'chapters' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> Módulos ({product.chapters.length})
                </h3>
              </div>

              <div className="space-y-2">
                {product.chapters.map((ch, idx) => {
                  const isSelected = selectedChapterIndex === idx;
                  const isUnlocked = viewMode === 'creator' || !product.input.enableQuiz || unlockedModules[ch.id];
                  const score = quizScores[ch.id];

                  return (
                    <button
                      key={ch.id}
                      onClick={() => isUnlocked && setSelectedChapterIndex(idx)}
                      disabled={!isUnlocked}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                        !isUnlocked
                          ? 'bg-slate-950/20 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-indigo-950/60 border-indigo-500/70 text-indigo-200 shadow-sm shadow-indigo-500/10'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-bold">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            {ch.id}
                          </span>
                          <span>Módulo {ch.id}</span>
                          {score !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${score >= 60 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                              {score}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium line-clamp-1 text-slate-200">{ch.title}</p>
                      </div>
                      {isUnlocked ? (
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'}`} />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-700" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Chapter Content Viewer */}
            <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 backdrop-blur-sm">
              {/* Unsplash Image */}
              {chapter.imageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 group h-56 sm:h-64">
                  <img src={chapter.imageUrl} alt={chapter.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-xs text-slate-200 font-medium bg-slate-950/80 backdrop-blur-sm p-2.5 rounded-lg border border-slate-800/80">
                    <ImageIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{chapter.imageCaption}</span>
                  </div>
                </div>
              )}

              {/* Title & Framework Header */}
              <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-800 pb-6">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Framework: {chapter.frameworkName}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">{chapter.title}</h2>
                  <p className="text-sm text-slate-400 italic">"{chapter.subtitle}"</p>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <strong className="text-indigo-400">Objetivo Prático:</strong> {chapter.objective}
                  </div>
                </div>

                {userRole === 'producer' && (
                  <button
                    onClick={() => handleStartEditChapter(chapter)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-extrabold rounded-xl transition-all hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4 text-indigo-400" />
                    <span>Editar Conteúdo do Módulo</span>
                  </button>
                )}
              </div>

              {/* Mentor Virtual Speech Bubbles */}
              <div className="space-y-3 p-5 bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-extrabold text-white text-sm shadow-md shadow-indigo-600/30">
                    🤖
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-300">Mentor Virtual da IA</h4>
                    <p className="text-[11px] text-slate-400">Orientação prática e alertas do especialista para este módulo</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-indigo-500/20 text-indigo-200">
                    {chapter.mentorCallouts.tip}
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/20 text-amber-200">
                    {chapter.mentorCallouts.warning}
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/20 text-emerald-200">
                    {chapter.mentorCallouts.challenge}
                  </div>
                </div>
              </div>

              {/* YouTube Videos Section */}
              {chapter.youtubeVideos && chapter.youtubeVideos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-500" /> 🎥 Vídeos Práticos Recomendados do YouTube
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {chapter.youtubeVideos.map((vid, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-red-400">
                            <span>YouTube • {vid.duration}</span>
                            <span>{vid.channel}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-100">{vid.title}</h4>
                        </div>

                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-transform hover:scale-[1.02]"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Assistir Vídeo no YouTube</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Link References Section */}
              {chapter.externalLinks && chapter.externalLinks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400" /> 🔗 Fontes & Leituras de Referência de Mercado
                  </h3>
                  <div className="space-y-2">
                    {chapter.externalLinks.map((link, idx) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                              {link.domain}
                            </span>
                            <h4 className="text-xs font-bold text-slate-200">{link.title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-400">{link.description}</p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg flex-shrink-0"
                        >
                          <span>Acessar</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Detailed Lesson Content (Material Didático Completo) */}
              {chapter.fullLessonContent && (
                <div className="space-y-6 bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-base font-extrabold text-white">📖 Leitura da Aula & Material Didático Completo</h3>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                      Conteúdo de Leitura da Aula
                    </span>
                  </div>

                  {/* Intro */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-indigo-300 tracking-wider">01. Visão Geral & Desafios da Aula</h4>
                    <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                      {chapter.fullLessonContent.introduction}
                    </div>
                  </div>

                  {/* Core Theory */}
                  <div className="space-y-2 pt-4 border-t border-slate-800/80">
                    <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">02. Fundamentos Teóricos & Conceitos-Chave</h4>
                    <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-sans bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                      {chapter.fullLessonContent.coreTheory}
                    </div>
                  </div>

                  {/* Practical Execution */}
                  <div className="space-y-2 pt-4 border-t border-slate-800/80">
                    <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider">03. Guia de Aplicação Prática no Dia a Dia</h4>
                    <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-sans bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                      {chapter.fullLessonContent.practicalExecution}
                    </div>
                  </div>

                  {/* Pro Tips */}
                  <div className="space-y-2 pt-4 border-t border-slate-800/80">
                    <h4 className="text-xs font-bold uppercase text-purple-400 tracking-wider">04. Segredos do Especialista & Alertas Finais</h4>
                    <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-sans bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                      {chapter.fullLessonContent.proTips}
                    </div>
                  </div>
                </div>
              )}

              {/* Step by Step Execution */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" /> Passo a Passo Operacional
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {chapter.stepByStep.map((step) => (
                    <div key={step.stepNumber} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 font-medium">
                        🎯 <strong>Ação Direta:</strong> {step.actionItem}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              <div className="p-5 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Alerta de Erros Comuns
                </h4>
                <div className="space-y-3">
                  {chapter.commonMistakes.map((m, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/20 text-xs space-y-1">
                      <p className="text-amber-200 font-semibold">❌ Erro: {m.mistake}</p>
                      <p className="text-emerald-400 font-medium">✅ Solução: {m.solution}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklists */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400" /> Checklist de Verificação Acelerada
                </h3>
                <div className="space-y-2">
                  {chapter.checklists.map((chk) => {
                    const isChecked = !!completedChecklists[chk.id];
                    return (
                      <div
                        key={chk.id}
                        onClick={() => toggleChecklist(chk.id)}
                        className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                          isChecked ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-900'}`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${isChecked ? 'line-through opacity-80' : ''}`}>{chk.item}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{chk.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Quiz */}
              {product.input.enableQuiz && chapter.quiz && chapter.quiz.length > 0 && (
                <div className="p-6 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">Avaliação do Módulo {chapter.id}</h4>
                        <p className="text-xs text-slate-400">Acerte pelo menos 60% para desbloquear o próximo módulo</p>
                      </div>
                    </div>
                    {quizScores[chapter.id] !== undefined && (
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${quizScores[chapter.id] >= 60 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                        {quizScores[chapter.id]}% de Aproveitamento ({quizScores[chapter.id] >= 60 ? 'APROVADO ✅' : 'REFAZER ❌'})
                      </span>
                    )}
                  </div>

                  <div className="space-y-6">
                    {chapter.quiz.map((q, qIdx) => {
                      const selectedOpt = quizAnswers[chapter.id]?.[qIdx];
                      return (
                        <div key={q.id} className="space-y-3">
                          <p className="text-xs font-bold text-slate-200">
                            {qIdx + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = selectedOpt === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectQuizOption(chapter.id, qIdx, oIdx)}
                                  className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 font-semibold'
                                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <span>({String.fromCharCode(65 + oIdx)}) {opt}</span>
                                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                    <span className="text-xs text-slate-400">
                      Responda às 3 questões para calcular sua nota.
                    </span>
                    <button
                      onClick={() => handleEvaluateQuiz(chapter)}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all"
                    >
                      Enviar Respostas do Módulo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'sales' && userRole === 'producer' ? (
          /* Sales Kit for Producer */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                  Área do Produtor • Kit de Vendas
                </span>
                <h2 className="text-xl font-bold text-slate-100 mt-1">Copywriting & Construtor de Funil</h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsIntegrationModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Conectar Hotmart / Kiwify / Eduzz</span>
                </button>

                <button
                  onClick={() => setIsFunnelModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                >
                  <Layout className="w-4 h-4" />
                  <span>Gerar Landing Page Funil de Vendas</span>
                </button>
              </div>
            </div>

            {/* Headline */}
            <div className="p-5 bg-gradient-to-r from-indigo-950/60 to-slate-950 border border-indigo-500/30 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-indigo-400">Headline Principal</span>
              <h3 className="text-lg font-extrabold text-white leading-snug">{product.salesKit.landingPageCopy.headline}</h3>
              <p className="text-xs text-slate-300">{product.salesKit.landingPageCopy.subheadline}</p>
            </div>

            {/* Objeções e FAQs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-indigo-400">Quebra de Objeções</h4>
                {product.salesKit.landingPageCopy.objectionHandling.map((o, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <p className="font-semibold text-slate-200">❓ {o.objection}</p>
                    <p className="text-slate-400">💡 {o.answer}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-emerald-400">Bio do Autor & CTA</h4>
                <p className="text-xs text-slate-300">{product.salesKit.landingPageCopy.authorBio}</p>
                <div className="p-3 bg-emerald-600 text-slate-950 font-extrabold text-center text-xs rounded-xl shadow-lg">
                  {product.salesKit.landingPageCopy.ctaText}
                </div>
              </div>
            </div>

            {/* WhatsApp Sequence */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" /> Sequência de 3 Mensagens Persuasivas de WhatsApp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.salesKit.whatsappSequence.map((msg) => {
                  const whatsappApiUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg.text)}`;
                  return (
                    <div key={msg.messageNumber} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                            Mensagem #{msg.messageNumber}
                          </span>
                          <button onClick={() => copyToClipboard(msg.text, `wsp_${msg.messageNumber}`)} className="text-slate-400 hover:text-white" title="Copiar Texto">
                            {copiedText === `wsp_${msg.messageNumber}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400">{msg.objective}</p>
                        <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-200 whitespace-pre-wrap font-sans border border-slate-800">
                          {msg.text}
                        </div>
                      </div>

                      <a
                        href={whatsappApiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-transform hover:scale-[1.02]"
                      >
                        <span>Enviar no WhatsApp 💬</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 10 Variações de Copy Promocional Integradas */}
            <div className="pt-8 border-t border-slate-800">
              <PromoCopySection product={product} />
            </div>
          </div>
        ) : (
          /* Certificate Generator & Student Validation Tab */

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 text-center backdrop-blur-sm max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                <Award className="w-4 h-4" /> Validação & Emissão Oficial de Certificado
              </div>
              <h2 className="text-2xl font-bold text-white">Certificado Oficial de Formação Profissional</h2>
              <p className="text-xs text-slate-400">
                Insira seu Nome Completo e CPF para validação pelo padrão brasileiro antes de emitir seu documento.
              </p>
            </div>

            {/* Formulário do Aluno com CPF Válido */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl max-w-lg mx-auto space-y-4 text-left shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Dados do Aluno para o Certificado
              </h4>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nome Completo do Aluno</label>
                <input
                  type="text"
                  required
                  value={studentFullName}
                  onChange={(e) => setStudentFullName(e.target.value)}
                  placeholder="Ex: Amanda Souza Santos"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>CPF do Aluno (padrão brasileiro 000.000.000-00)</span>
                  {studentCPF.length === 14 && !cpfError && (
                    <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> CPF VÁLIDO
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  maxLength={14}
                  value={studentCPF}
                  onChange={(e) => handleCPFChange(e.target.value)}
                  placeholder="000.000.000-00"
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none ${
                    cpfError ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
                {cpfError && (
                  <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {cpfError}
                  </p>
                )}
              </div>

              <button
                onClick={handleEmitCertificate}
                disabled={!isCourseFullyCompleted}
                className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isCourseFullyCompleted
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:scale-[1.02]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Confirmar Dados e Gerar Certificado</span>
              </button>
            </div>

            {/* Certificado Renderizado */}
            {certificateData && (
              <div className="p-8 sm:p-12 rounded-3xl border-4 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-amber-500/60 shadow-2xl shadow-amber-500/10 animate-fadeIn">
                <div className="flex justify-between items-center text-xs text-amber-400 font-bold uppercase tracking-widest border-b border-slate-800 pb-4">
                  <span>Certificado Oficial • ID: {certificateData.certificateId}</span>
                  <span>Carga Horária: {product.chapters.length * 4} Horas</span>
                </div>

                <div className="space-y-3 my-6">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Certificamos que</p>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-amber-300 font-serif tracking-wide">
                    {certificateData.fullName}
                  </h3>
                  <p className="text-xs text-emerald-400 font-bold">
                    Inscrito sob o CPF: {certificateData.cpf} (Autenticado)
                  </p>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto">
                    Concluiu com êxito todos os <strong>{product.chapters.length} Módulos</strong> da formação profissional no método <strong>{product.methodName}</strong>.
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-slate-800 pt-6 text-xs text-slate-400">
                  <div className="text-left space-y-1">
                    <p className="text-slate-200 font-bold">{product.input.authorName || 'Especialista Líder'}</p>
                    <p className="text-[10px]">Instrutor & Mestre Arquiteto</p>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 font-extrabold text-xs shadow-inner">
                    SELO 100%
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-slate-200 font-bold">{certificateData.issuedAt}</p>
                    <p className="text-[10px]">Data de Emissão</p>
                  </div>
                </div>
              </div>
            )}

            {certificateData && (
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Imprimir / Baixar Certificado em PDF
              </button>
            )}
          </div>
        )}
      </div>

      {/* PRINT VIEW ONLY */}
      <div className="hidden print:block space-y-8 bg-white text-black p-8 font-sans">
        {certificateData ? (
          <div className="text-center space-y-8 p-12 border-4 border-amber-600 rounded-2xl my-auto page-break-after">
            <h1 className="text-3xl font-extrabold">CERTIFICADO DE CONCLUSÃO</h1>
            <p className="text-base text-gray-700">Certificamos para os devidos fins que</p>
            <h2 className="text-4xl font-extrabold text-amber-800">{certificateData.fullName}</h2>
            <p className="text-sm font-bold text-gray-900">Portador do CPF: {certificateData.cpf}</p>
            <p className="text-sm text-gray-800 max-w-lg mx-auto">
              Concluiu a formação de {product.chapters.length * 4} horas no <strong>{product.methodName}</strong>.
            </p>
            <div className="pt-12 flex justify-between text-xs text-gray-600 border-t border-gray-300">
              <p>ID do Documento: {certificateData.certificateId}</p>
              <p>Data: {certificateData.issuedAt}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 text-slate-900">
            {/* CAPA DO CURSO */}
            <div className="text-center space-y-6 py-12 border-b-2 border-slate-300 min-h-[90vh] flex flex-col justify-between" style={{ pageBreakAfter: 'always' }}>
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Formação Profissional • Método Exclusivo
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                  {product.methodName}
                </h1>
                <p className="text-lg font-medium text-slate-700 max-w-2xl mx-auto italic">
                  "{product.tagline}"
                </p>
              </div>

              <div className="max-w-xl mx-auto my-6 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-lg">
                <img src={product.coverImage} alt="Capa do Curso" className="w-full h-80 object-cover" />
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-6">
                <p className="text-sm font-bold text-slate-900">🎯 Promessa Principal: {product.promise}</p>
                <div className="flex justify-center gap-6 text-xs text-slate-600 font-semibold pt-2">
                  <span>Módulos: {product.chapters.length} Aulas Didáticas</span>
                  <span>•</span>
                  <span>Nicho: {product.input.niche}</span>
                  <span>•</span>
                  <span>Data: {product.createdAt}</span>
                </div>
              </div>
            </div>

            {/* SUMÁRIO DE CONTEÚDO */}
            <div className="space-y-6 py-8 border-b-2 border-slate-300" style={{ pageBreakAfter: 'always' }}>
              <h2 className="text-2xl font-black text-slate-950 uppercase border-b-2 border-slate-900 pb-2">
                📚 Índice de Módulos Didáticos
              </h2>
              <div className="space-y-3">
                {product.chapters.map((ch) => (
                  <div key={ch.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-700 uppercase">Módulo {ch.id}</span>
                      <h3 className="text-base font-bold text-slate-900">{ch.title}</h3>
                      <p className="text-xs text-slate-600">{ch.subtitle}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                      {ch.frameworkName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MÓDULOS DETALHADOS (100% DO CONTEÚDO) */}
            {product.chapters.map((ch) => (
              <div key={ch.id} className="space-y-6 py-6 border-b-2 border-slate-200" style={{ pageBreakAfter: 'always' }}>
                <div className="space-y-2 border-b border-slate-300 pb-3">
                  <span className="text-xs font-extrabold uppercase bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded">
                    Módulo {ch.id} • {ch.frameworkName}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-950">{ch.title}</h2>
                  <p className="text-sm font-medium text-slate-700">{ch.subtitle}</p>
                  <p className="text-xs text-indigo-900 font-bold bg-indigo-50 p-2.5 rounded-lg border border-indigo-200 mt-2">
                    🎯 <strong>Objetivo Prático:</strong> {ch.objective}
                  </p>
                </div>

                {ch.imageUrl && (
                  <div className="my-4 rounded-xl overflow-hidden border border-slate-300 max-w-lg mx-auto">
                    <img src={ch.imageUrl} alt={ch.title} className="w-full h-60 object-cover" />
                    {ch.imageCaption && <p className="text-[11px] text-center italic text-slate-600 p-2 bg-slate-50">{ch.imageCaption}</p>}
                  </div>
                )}

                {/* Material Didático Completo */}
                {ch.fullLessonContent && (
                  <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-300 space-y-4">
                    <h3 className="text-sm font-black uppercase text-indigo-900 border-b border-slate-300 pb-2">
                      📖 Leitura da Aula & Conteúdo Teórico-Prático
                    </h3>
                    
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase">01. Visão Geral & Desafios da Aula</h4>
                      <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">{ch.fullLessonContent.introduction}</p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 uppercase">02. Fundamentos Teóricos & Conceitos-Chave</h4>
                      <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">{ch.fullLessonContent.coreTheory}</p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 uppercase">03. Guia de Aplicação Prática no Dia a Dia</h4>
                      <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">{ch.fullLessonContent.practicalExecution}</p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 uppercase">04. Segredos do Especialista & Alertas Finais</h4>
                      <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">{ch.fullLessonContent.proTips}</p>
                    </div>
                  </div>
                )}

                {/* Passo a Passo Operacional */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Passo a Passo Operacional:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ch.stepByStep.map((st) => (
                      <div key={st.stepNumber} className="p-3 bg-white border border-slate-300 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-indigo-700 uppercase">Passo {st.stepNumber}: {st.title}</span>
                        <p className="text-xs text-slate-700">{st.description}</p>
                        <p className="text-[11px] font-bold text-emerald-800 pt-1">🎯 Ação: {st.actionItem}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alerta de Erros Comuníssimos */}
                {ch.commonMistakes && ch.commonMistakes.length > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold uppercase text-amber-900">⚠️ Alerta de Erros Comuns & Soluções:</h4>
                    {ch.commonMistakes.map((m, idx) => (
                      <div key={idx} className="text-xs space-y-0.5">
                        <p className="text-red-700 font-bold">❌ Erro: {m.mistake}</p>
                        <p className="text-emerald-800 font-semibold">✅ Solução: {m.solution}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checklists */}
                {ch.checklists && ch.checklists.length > 0 && (
                  <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-900">☑️ Checklist de Verificação:</h4>
                    {ch.checklists.map((c) => (
                      <p key={c.id} className="text-xs text-slate-800">
                        [ ] <strong>{c.item}</strong> — {c.explanation}
                      </p>
                    ))}
                  </div>
                )}

                {/* Avaliação Prática (Quiz) */}
                {ch.quiz && ch.quiz.length > 0 && (
                  <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-3">
                    <h4 className="text-xs font-extrabold uppercase text-indigo-900">📝 Avaliação Prática de Fixação do Módulo {ch.id}:</h4>
                    {ch.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="text-xs space-y-1">
                        <p className="font-bold text-slate-900">{qIdx + 1}. {q.question}</p>
                        <div className="pl-4 space-y-0.5">
                          {q.options.map((opt, oIdx) => (
                            <p key={oIdx} className="text-slate-700">({String.fromCharCode(65 + oIdx)}) {opt}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* GABARITO OFICIAL */}
            {product.gabarito && product.gabarito.length > 0 && (
              <div className="space-y-6 py-6 border-b-2 border-slate-300" style={{ pageBreakAfter: 'always' }}>
                <h2 className="text-2xl font-black text-slate-950 uppercase border-b-2 border-slate-950 pb-2">
                  📝 Gabarito Oficial de Respostas
                </h2>
                <div className="space-y-4">
                  {product.gabarito.map((g) => (
                    <div key={g.chapterNumber} className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                      <h3 className="text-sm font-bold text-indigo-900">Módulo {g.chapterNumber}: {g.chapterTitle}</h3>
                      {g.answers.map((ans) => (
                        <div key={ans.questionNumber} className="text-xs space-y-0.5 pl-2 border-l-2 border-indigo-300">
                          <p className="font-bold text-slate-900">Questão {ans.questionNumber}: Resposta Correta ({ans.correctOption})</p>
                          <p className="text-slate-600 italic">{ans.explanation}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals usando React Portal */}
      {isExportModalOpen && <ExportModal product={product} onClose={() => setIsExportModalOpen(false)} />}
      {isFunnelModalOpen && <FunnelPreviewModal product={product} onClose={() => setIsFunnelModalOpen(false)} />}
      {isIntegrationModalOpen && (
        <IntegrationModal
          product={product}
          onClose={() => setIsIntegrationModalOpen(false)}
          onSaveCheckoutUrl={(url) => {
            product.salesKit.funnelCheckoutUrl = url;
            setIsIntegrationModalOpen(false);
          }}
        />
      )}

      {/* Modal de Edição In-Place do Módulo para o Produtor */}
      {isEditingChapter && editChapterForm && createPortal(
        <div className="fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Editar Conteúdo do Módulo {editChapterForm.id}</h3>
                  <p className="text-xs text-slate-400">Altere textos didáticos, títulos, vídeos e passos operacionais em tempo real</p>
                </div>
              </div>
              <button onClick={() => setIsEditingChapter(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-left">
              {/* Informações Gerais */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">1. Informações do Módulo</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Título do Módulo</label>
                    <input
                      type="text"
                      value={editChapterForm.title}
                      onChange={(e) => setEditChapterForm({ ...editChapterForm, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Nome do Framework</label>
                    <input
                      type="text"
                      value={editChapterForm.frameworkName}
                      onChange={(e) => setEditChapterForm({ ...editChapterForm, frameworkName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Subtítulo do Módulo</label>
                  <input
                    type="text"
                    value={editChapterForm.subtitle}
                    onChange={(e) => setEditChapterForm({ ...editChapterForm, subtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Objetivo Prático</label>
                  <input
                    type="text"
                    value={editChapterForm.objective}
                    onChange={(e) => setEditChapterForm({ ...editChapterForm, objective: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Material Didático Completo */}
              {editChapterForm.fullLessonContent && (
                <div className="space-y-4 border-t border-slate-800 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">2. Material Didático Completo da Aula</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">01. Visão Geral & Desafios</label>
                    <textarea
                      rows={3}
                      value={editChapterForm.fullLessonContent.introduction}
                      onChange={(e) =>
                        setEditChapterForm({
                          ...editChapterForm,
                          fullLessonContent: { ...editChapterForm.fullLessonContent!, introduction: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">02. Fundamentos Teóricos & Conceitos-Chave</label>
                    <textarea
                      rows={4}
                      value={editChapterForm.fullLessonContent.coreTheory}
                      onChange={(e) =>
                        setEditChapterForm({
                          ...editChapterForm,
                          fullLessonContent: { ...editChapterForm.fullLessonContent!, coreTheory: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">03. Guia de Aplicação Prática no Dia a Dia</label>
                    <textarea
                      rows={4}
                      value={editChapterForm.fullLessonContent.practicalExecution}
                      onChange={(e) =>
                        setEditChapterForm({
                          ...editChapterForm,
                          fullLessonContent: { ...editChapterForm.fullLessonContent!, practicalExecution: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">04. Segredos do Especialista & Alertas Finais</label>
                    <textarea
                      rows={3}
                      value={editChapterForm.fullLessonContent.proTips}
                      onChange={(e) =>
                        setEditChapterForm({
                          ...editChapterForm,
                          fullLessonContent: { ...editChapterForm.fullLessonContent!, proTips: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800 sticky bottom-0 bg-slate-900 pb-2">
              <button
                type="button"
                onClick={() => setIsEditingChapter(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveChapterEdit}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações do Módulo</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* TEMPLATE DEDICADO DE IMPRESSÃO A4 (EXCLUSIVO PARA WINDOW.PRINT() / PDF) */}
      <div className="hidden print:block font-sans text-slate-900 bg-white">
        <EbookPrintTemplate product={product} />
      </div>
    </div>
  );
};
