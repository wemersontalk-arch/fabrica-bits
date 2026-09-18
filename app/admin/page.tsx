'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { User, UserRole, PlanType, UserStatus, SystemSettings } from '@/types/infoproduct';
import {
  Shield,
  Users,
  DollarSign,
  Crown,
  Zap,
  CheckCircle2,
  Search,
  Filter,
  UserCheck,
  Ban,
  Trash2,
  Edit3,
  Clock,
  MessageCircle,
  Lock,
  PlusCircle,
  Key,
  X,
  CreditCard,
  Settings,
  Activity,
  TrendingUp,
  Radio,
  Server,
  Database,
  Cpu,
  RefreshCw,
  Save,
  UserPlus,
  Building2,
  Share2,
  Globe,
  Sparkles,
  Bot,
  Sliders,
  BarChart3,
  Layers,
  Check
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    user,
    usersList,
    waitlist,
    systemSettings,
    approveBetaUser,
    registerFreeBeta,
    createUserManual,
    toggleUserBlock,
    toggleUserExempt,
    migrateUserPlan,
    updateUserData,
    updateSystemSettings,
    resetUserPassword,
    deleteUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'payments' | 'integrations' | 'health' | 'waitlist'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_beta' | 'active' | 'blocked' | 'exempt'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Status de salvamento das configurações
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Modal de Edição de Usuário
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('PRODUTOR');
  const [editPlan, setEditPlan] = useState<PlanType>('produtor');
  const [editPassword, setEditPassword] = useState('');
  const [editCredits, setEditCredits] = useState<number>(50);

  // Modal de Criação Manual de Usuário
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('PRODUTOR');
  const [newPlan, setNewPlan] = useState<PlanType>('produtor');
  const [newPassword, setNewPassword] = useState('123456');
  const [newCredits, setNewCredits] = useState(50);
  const [newIsExempt, setNewIsExempt] = useState(false);

  // Formulário local de Configurações do Sistema
  const [settingsForm, setSettingsForm] = useState<SystemSettings>(systemSettings);

  const isMasterAdmin = user && (user.role === 'admin' || user.role === 'MASTER' || user.role === 'EQUIPE_SUPORTE');

  const handleStartEdit = (u: User) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditPlan(u.plan);
    setEditPassword(u.password || '');
    setEditCredits(u.credits || 50);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserData(editingUser.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      role: editRole,
      plan: editPlan,
      credits: editCredits,
      ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
    });
    setEditingUser(null);
    triggerSaveMessage('Dados do usuário atualizados com sucesso!');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    createUserManual({
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      plan: newPlan,
      password: newPassword.trim() || '123456',
      credits: newCredits,
      isExempt: newIsExempt,
      status: 'active',
    });

    setShowCreateModal(false);
    setNewName('');
    setNewEmail('');
    setNewPassword('123456');
    setNewCredits(50);
    setNewIsExempt(false);
    triggerSaveMessage('Novo usuário criado com sucesso!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(settingsForm);
    triggerSaveMessage('Configurações globais do sistema salvas com sucesso!');
  };

  const triggerSaveMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => {
      setSaveMessage(null);
    }, 4000);
  };

  // FinOps Computations
  const totalUsersCount = usersList.length;
  const inicianteCount = usersList.filter((u) => u.plan === 'iniciante').length;
  const produtorCount = usersList.filter((u) => u.plan === 'produtor' || u.plan === 'pro').length;
  const produtorProCount = usersList.filter((u) => u.plan === 'produtorPro' || u.plan === 'pro').length;
  const agenciaCount = usersList.filter((u) => u.plan === 'agencia' || u.plan === 'agency').length;

  const mrr =
    inicianteCount * (systemSettings.pricing?.iniciante || 29.9) +
    produtorCount * (systemSettings.pricing?.produtor || 97) +
    produtorProCount * (systemSettings.pricing?.produtorPro || 197) +
    agenciaCount * (systemSettings.pricing?.agencia || 497);

  const arr = mrr * 12;

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'pending_beta') return u.status === 'pending_beta';
    if (statusFilter === 'active') return u.status === 'active';
    if (statusFilter === 'blocked') return u.status === 'blocked';
    if (statusFilter === 'exempt') return u.isExempt === true;

    if (roleFilter !== 'all') {
      if (u.role !== roleFilter) return false;
    }

    return true;
  });

  const pendingBetaCount = usersList.filter((u) => u.status === 'pending_beta').length;

  // LED Badge Status Resolver
  const masterSwitchOn = settingsForm.apiIntegrations?.masterSwitchEnabled ?? true;
  const hasOpenAIKey = !!(settingsForm.apiIntegrations?.openaiKey && settingsForm.apiIntegrations.openaiKey.trim().length > 0);

  const renderLedBadge = () => {
    if (!masterSwitchOn) {
      return (
        <span className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-2 shadow">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>🔴 API Desativada (Motor Local 100%)</span>
        </span>
      );
    }
    if (masterSwitchOn && hasOpenAIKey) {
      return (
        <span className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 shadow">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>🟢 API Conectada & Ativa (GPT-4o)</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-2 shadow">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        <span>🟡 Modo Híbrido / Fallback Local</span>
      </span>
    );
  };

  if (!isMasterAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Área Reservada Master
          </span>
          <h1 className="text-2xl font-extrabold text-white">Acesso Restrito ao Administrador</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Você precisa estar logado com a conta oficial de <strong>Master Admin</strong> (`master@infoproductengine.ai`) para acessar este centro de controle executivo.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-transform hover:scale-105"
        >
          <Lock className="w-4 h-4" />
          <span>Fazer Login como Master Admin</span>
        </Link>
      </div>
    );
  }

  const telemetry = settingsForm.telemetry || {
    inputTokensTotal: 98450,
    outputTokensTotal: 44130,
    estimatedCostUsd: 0.68,
    apiCallsSuccess: 14,
    apiCallsError: 0,
    localEngineRequests: 86,
    estimatedSavingsUsd: 42.50,
    averageLocalLatencyMs: 38,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn pb-24">
      {/* Toast Notice */}
      {saveMessage && (
        <div className="fixed top-20 right-6 z-[99999] bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-extrabold text-xs flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Central Executiva Master SaaS 360°</span>
            </div>
            {renderLedBadge()}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Painel Gerencial & FinOps da Fábrica Bits
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Telemetria de LLMs, faturamento MRR/ARR, matriz de feature flags por plano e controle mestre de integrações.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-transform hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Criar Novo Usuário</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-xs text-slate-300">
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Master: <strong>{user?.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Tabs Bar - Responsive Flex-Wrap Without Scrollbar Overflow */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
        {[
          { id: 'overview', label: '📊 Visão Geral & FinOps', icon: Activity },
          { id: 'users', label: `👥 Gestão de Usuários (${usersList.length})`, icon: Users, badge: pendingBetaCount },
          { id: 'payments', label: '💳 Pagamentos & Mensalidades', icon: CreditCard },
          { id: 'integrations', label: '🔑 Login Google & APIs', icon: Key },
          { id: 'health', label: '🟢 Telemetria & Saúde do Sistema', icon: Server },
          { id: 'waitlist', label: `⏳ Lista de Espera (${waitlist.length})`, icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold rounded-2xl transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40 rounded-full font-black">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* TAB 1: VISÃO GERAL & FINOPS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* FinOps Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-2 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400">
                <DollarSign className="w-20 h-20" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MRR (Receita Mensal Recorrente)</span>
              <p className="text-3xl font-black text-emerald-400">
                R$ {mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Baseado na contagem de assinantes ativos
              </p>
            </div>

            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-2 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-400">
                <TrendingUp className="w-20 h-20" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ARR (Receita Anual Projetada)</span>
              <p className="text-3xl font-black text-indigo-400">
                R$ {arr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-400">Previsão com taxa de retenção de 95%</p>
            </div>

            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-2 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-sky-400">
                <Zap className="w-20 h-20" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Economia Motor Local (Cost Savings)</span>
              <p className="text-3xl font-black text-sky-400">
                US$ {telemetry.estimatedSavingsUsd.toFixed(2)}
              </p>
              <p className="text-[11px] text-sky-300 font-bold">
                {telemetry.localEngineRequests} requisições processadas localmente
              </p>
            </div>

            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-2 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custo de IA OpenAI (USD)</span>
              <p className="text-3xl font-black text-amber-300">
                US$ {telemetry.estimatedCostUsd.toFixed(4)}
              </p>
              <p className="text-[11px] text-slate-400 font-semibold">
                {(telemetry.inputTokensTotal + telemetry.outputTokensTotal).toLocaleString('pt-BR')} tokens consumidos
              </p>
            </div>
          </div>

          {/* Telemetria de LLMs & FinOps Overview Block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" /> Tráfego Semanal & Taxa de Conversão de Assinantes
                </h3>
                <span className="text-xs text-slate-400 font-bold">Últimos 7 dias</span>
              </div>

              {/* Weekly Requests vs Subscribers Bar Chart Graphic */}
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 h-40 items-end border-b border-slate-800 pb-2 pt-4">
                  {[
                    { day: 'Seg', reqs: 45, subs: 3, heightReq: 'h-24', heightSub: 'h-8' },
                    { day: 'Ter', reqs: 62, subs: 5, heightReq: 'h-32', heightSub: 'h-12' },
                    { day: 'Qua', reqs: 78, subs: 8, heightReq: 'h-36', heightSub: 'h-16' },
                    { day: 'Qui', reqs: 54, subs: 4, heightReq: 'h-28', heightSub: 'h-10' },
                    { day: 'Sex', reqs: 90, subs: 11, heightReq: 'h-40', heightSub: 'h-24' },
                    { day: 'Sáb', reqs: 38, subs: 2, heightReq: 'h-20', heightSub: 'h-6' },
                    { day: 'Dom', reqs: 48, subs: 4, heightReq: 'h-24', heightSub: 'h-10' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                      <div className="flex items-end gap-1 w-full justify-center">
                        <div
                          className={`w-3.5 bg-indigo-500 rounded-t-md ${item.heightReq} group-hover:bg-indigo-400 transition-all`}
                          title={`Requisições: ${item.reqs}`}
                        />
                        <div
                          className={`w-3.5 bg-emerald-400 rounded-t-md ${item.heightSub} group-hover:bg-emerald-300 transition-all`}
                          title={`Novas Assinaturas: ${item.subs}`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-indigo-500 rounded-sm" />
                    <span>Requisições Totais de Infoprodutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-400 rounded-sm" />
                    <span>Novas Assinaturas Convertidas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stream with Badges */}
            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" /> Activity Feed em Tempo Real
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      [MOTOR LOCAL]
                    </span>
                    <span className="text-[10px] text-slate-500">Há 2 min</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-semibold">Carlos Oliveira gerou infoproduto via motor algorítmico local (Custo $0,00).</p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      [OPENAI API]
                    </span>
                    <span className="text-[10px] text-slate-500">Há 15 min</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-semibold">Amanda Ramos (Produtor PRO) gerou e-book via GPT-4o (4.500 tokens).</p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      [MOTOR LOCAL]
                    </span>
                    <span className="text-[10px] text-slate-500">Há 38 min</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-semibold">Geração instantânea concluída em 38ms com economia de US$ 0,50.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GESTÃO & CRIAÇÃO MANUAL DE USUÁRIOS */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'pending_beta', label: 'Pendente Beta' },
                  { id: 'active', label: 'Ativos' },
                  { id: 'blocked', label: 'Bloqueados' },
                  { id: 'exempt', label: 'VIP Isentos' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === f.id
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              <span className="text-xs font-bold text-slate-400 ml-2">Papel:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 px-3 py-1 rounded-xl focus:outline-none focus:border-amber-500"
              >
                <option value="all">Todos os Papéis (8 Roles)</option>
                <option value="MASTER">MASTER</option>
                <option value="EQUIPE_SUPORTE">EQUIPE_SUPORTE</option>
                <option value="AGENCIA_COPRODUCAO">AGENCIA_COPRODUCAO</option>
                <option value="PRODUTOR_PRO">PRODUTOR_PRO</option>
                <option value="PRODUTOR">PRODUTOR</option>
                <option value="PRODUTOR_INICIANTE">PRODUTOR_INICIANTE</option>
                <option value="AFILIADO">AFILIADO</option>
                <option value="ALUNO">ALUNO</option>
              </select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou role..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow whitespace-nowrap flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Manual</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Usuário</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Papel Hierárquico (Role)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Plano</th>
                  <th className="p-3">Isenção VIP</th>
                  <th className="p-3 text-right">Ações Master</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => {
                  const isBlocked = u.status === 'blocked';
                  const isPending = u.status === 'pending_beta';

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-950/40 transition-colors ${
                        isBlocked ? 'bg-red-950/20' : isPending ? 'bg-amber-950/20' : ''
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {(u.role === 'MASTER' || u.role === 'admin') && (
                            <span title="Dono Master">
                              <Crown className="w-3.5 h-3.5 text-amber-400" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">{u.id}</span>
                      </td>

                      <td className="p-3 text-slate-400 font-mono text-[11px]">{u.email}</td>

                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-950 text-amber-300 border border-slate-800">
                          {u.role}
                        </span>
                      </td>

                      <td className="p-3">
                        {isPending ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" /> Pendente Beta
                          </span>
                        ) : isBlocked ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
                            <Ban className="w-3 h-3" /> Bloqueado
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Ativo
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <select
                          value={u.plan}
                          onChange={(e) => migrateUserPlan(u.id, e.target.value as PlanType)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                        >
                          <option value="iniciante">Produtor Iniciante</option>
                          <option value="produtor">Produtor</option>
                          <option value="produtorPro">Produtor Pro</option>
                          <option value="agencia">Agência</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => toggleUserExempt(u.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border transition-all ${
                            u.isExempt
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                              : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                          }`}
                        >
                          {u.isExempt ? '🏆 VIP ISENTO' : 'Cobrança Normal'}
                        </button>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => approveBetaUser(u.id)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] rounded-lg shadow flex items-center gap-1 transition-transform hover:scale-105"
                              title="Aprovar Acesso na Fase Beta"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Aprovar</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleStartEdit(u)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                            title="Editar Dados do Usuário"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              const newPass = prompt(`Nova senha para ${u.name} (deixe em branco para '123456'):`, '123456');
                              if (newPass !== null) {
                                resetUserPassword(u.id, newPass.trim() || '123456');
                                triggerSaveMessage(`Senha de ${u.name} redefinida para '${newPass.trim() || '123456'}'`);
                              }
                            }}
                            className="p-1.5 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 rounded-lg"
                            title="Resetar Senha"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => toggleUserBlock(u.id)}
                            className={`p-1.5 rounded-lg border ${
                              isBlocked
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60'
                                : 'bg-red-950/40 text-red-400 border-red-500/30 hover:bg-red-900/60'
                            }`}
                            title={isBlocked ? 'Desbloquear Usuário' : 'Bloquear Usuário'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir permanentemente ${u.name}?`)) {
                                deleteUser(u.id);
                                triggerSaveMessage('Usuário excluído com sucesso.');
                              }
                            }}
                            className="p-1.5 bg-slate-950 hover:bg-red-900/40 text-slate-500 hover:text-red-400 rounded-lg border border-slate-800"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAGAMENTOS & MENSALIDADES */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" /> Gateway de Pagamentos & Mensalidades SaaS
                </h3>
                <p className="text-xs text-slate-400">Configure os meios de recebimento e os valores cobrados em cada plano</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações de Pagamento</span>
              </button>
            </div>

            {/* Price Editor */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">Editor de Preços dos Planos (R$)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300">Produtor Iniciante</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.pricing?.iniciante || 29.9}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        pricing: { ...settingsForm.pricing, iniciante: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold"
                  />
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300">Produtor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.pricing?.produtor || 97}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        pricing: { ...settingsForm.pricing, produtor: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold"
                  />
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300">Produtor Pro</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.pricing?.produtorPro || 197}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        pricing: { ...settingsForm.pricing, produtorPro: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold"
                  />
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300">Agência (Futuro)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.pricing?.agencia || 497}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        pricing: { ...settingsForm.pricing, agencia: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: LOGIN GOOGLE & APIS + MASTER SWITCH + FEATURE FLAGS MATRIX */}
      {activeTab === 'integrations' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" /> Controle Mestre de APIs & Integrações
                  </h3>
                  {renderLedBadge()}
                </div>
                <p className="text-xs text-slate-400 mt-1">Gerencie a chave master de IA, matriz de permissões por plano e autenticação social</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações Globais</span>
              </button>
            </div>

            {/* MASTER SWITCH TOGGLE CARD */}
            <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-2 border-indigo-500/40 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    MASTER SWITCH DE IA EXTERNA
                  </span>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    Chave Geral da API de Inteligência Artificial
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Ao LIGAR este switch, a plataforma utilizará a API da OpenAI (GPT-4o) para os planos autorizados. Quando DESLIGADO, todo o sistema opera no Motor Algorítmico Local com Custo Zero.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.apiIntegrations?.masterSwitchEnabled ?? true}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        apiIntegrations: {
                          ...settingsForm.apiIntegrations,
                          masterSwitchEnabled: e.target.checked,
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>
            </div>

            {/* FEATURE FLAGS MATRIX BY PLAN */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" /> Matriz de Permissões de IA por Plano (Feature Flags)
                  </h4>
                  <p className="text-[11px] text-slate-400">Marque quais planos têm autorização para consumir o motor OpenAI GPT-4o ou apenas o motor algorítmico local</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Plano SaaS</th>
                      <th className="p-3">Motor Algorítmico Local (Custo $0,00)</th>
                      <th className="p-3">Motor IA OpenAI GPT-4o</th>
                      <th className="p-3 text-right">Modo Resolvido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="p-3 font-bold text-white">Produtor Iniciante</td>
                      <td className="p-3 text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Liberado (Cota 1/mês)
                      </td>
                      <td className="p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.planFeatureFlags?.iniciante?.allowOpenAI || false}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                planFeatureFlags: {
                                  ...settingsForm.planFeatureFlags,
                                  iniciante: { allowOpenAI: e.target.checked },
                                },
                              })
                            }
                            className="rounded border-slate-800 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="font-semibold text-slate-200">Permitir OpenAI</span>
                        </label>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[11px]">
                        {settingsForm.planFeatureFlags?.iniciante?.allowOpenAI ? '🤖 OpenAI' : '⚡ Local'}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-white">Produtor (R$ 97/mês)</td>
                      <td className="p-3 text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Liberado (Padrão)
                      </td>
                      <td className="p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.planFeatureFlags?.produtor?.allowOpenAI || false}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                planFeatureFlags: {
                                  ...settingsForm.planFeatureFlags,
                                  produtor: { allowOpenAI: e.target.checked },
                                },
                              })
                            }
                            className="rounded border-slate-800 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="font-semibold text-slate-200">Permitir OpenAI</span>
                        </label>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[11px]">
                        {settingsForm.planFeatureFlags?.produtor?.allowOpenAI ? '🤖 OpenAI' : '⚡ Local'}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-amber-300">Produtor PRO (R$ 197/mês)</td>
                      <td className="p-3 text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Liberado
                      </td>
                      <td className="p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.planFeatureFlags?.produtorPro?.allowOpenAI ?? true}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                planFeatureFlags: {
                                  ...settingsForm.planFeatureFlags,
                                  produtorPro: { allowOpenAI: e.target.checked },
                                },
                              })
                            }
                            className="rounded border-slate-800 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="font-semibold text-slate-200">Permitir OpenAI</span>
                        </label>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[11px]">
                        {settingsForm.planFeatureFlags?.produtorPro?.allowOpenAI ? '🤖 OpenAI' : '⚡ Local'}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-indigo-300">Agência (R$ 497/mês)</td>
                      <td className="p-3 text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Liberado
                      </td>
                      <td className="p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.planFeatureFlags?.agencia?.allowOpenAI ?? true}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                planFeatureFlags: {
                                  ...settingsForm.planFeatureFlags,
                                  agencia: { allowOpenAI: e.target.checked },
                                },
                              })
                            }
                            className="rounded border-slate-800 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="font-semibold text-slate-200">Permitir OpenAI</span>
                        </label>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[11px]">
                        {settingsForm.planFeatureFlags?.agencia?.allowOpenAI ? '🤖 OpenAI' : '⚡ Local'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Keys */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs">
              <span className="font-extrabold text-white text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" /> Credenciais OpenAI & Mídia
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Chave OpenAI (`sk-proj-...`)</label>
                  <input
                    type="password"
                    value={settingsForm.apiIntegrations?.openaiKey || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        apiIntegrations: { ...settingsForm.apiIntegrations, openaiKey: e.target.value },
                      })
                    }
                    placeholder="sk-proj-..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 font-mono text-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Modelo de IA Padrão</label>
                  <select
                    value={settingsForm.apiIntegrations?.openaiModel || 'gpt-4o'}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        apiIntegrations: { ...settingsForm.apiIntegrations, openaiModel: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs font-bold"
                  >
                    <option value="gpt-4o">GPT-4o (Ultra-rápido & Qualidade Máxima)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Econômico)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 5: TELEMETRIA & SAÚDE DO SISTEMA */}
      {activeTab === 'health' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" /> Telemetria de LLMs & Engenharia FinOps
              </h3>
              <p className="text-xs text-slate-400">Consumo de tokens, custo em USD e tráfego do motor algorítmico local</p>
            </div>
            {renderLedBadge()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Total Tokens OpenAI</span>
                <Cpu className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-purple-300">
                {(telemetry.inputTokensTotal + telemetry.outputTokensTotal).toLocaleString('pt-BR')}
              </p>
              <p className="text-[11px] text-slate-500">
                Entrada: {telemetry.inputTokensTotal.toLocaleString()} | Saída: {telemetry.outputTokensTotal.toLocaleString()}
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Custo Acumulado (USD)</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-300">
                US$ {telemetry.estimatedCostUsd.toFixed(4)}
              </p>
              <p className="text-[11px] text-slate-500">Baseado no modelo {settingsForm.apiIntegrations?.openaiModel || 'GPT-4o'}</p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Economia Motor Local</span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-400">
                US$ {telemetry.estimatedSavingsUsd.toFixed(2)}
              </p>
              <p className="text-[11px] text-emerald-300 font-bold">
                {telemetry.localEngineRequests} produtos gerados sem custo
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Latência Médio Local</span>
                <Activity className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-2xl font-black text-sky-300">{telemetry.averageLocalLatencyMs} ms</p>
              <p className="text-[11px] text-slate-500">Processamento no frontend</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: LISTA DE ESPERA */}
      {activeTab === 'waitlist' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" /> Candidatos na Lista de Espera dos Planos Pagos
              </h3>
              <p className="text-xs text-slate-400">Interessados nos planos PRO e Agência aguardando avaliação</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Candidato</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Plano Desejado</th>
                  <th className="p-3">Nicho</th>
                  <th className="p-3">Data</th>
                  <th className="p-3 text-right">Ação Master</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {waitlist.map((w) => {
                  const whatsappClean = w.whatsapp.replace(/\D/g, '');
                  const whatsappLink = `https://api.whatsapp.com/send?phone=55${whatsappClean}&text=${encodeURIComponent(
                    `Olá ${w.name}! Sou a equipe da Fábrica Bits. Vi seu interesse no plano ${w.intendedPlan.toUpperCase()}!`
                  )}`;

                  return (
                    <tr key={w.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="p-3 font-bold text-white">{w.name}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{w.email}</td>
                      <td className="p-3 text-emerald-400 font-semibold">{w.whatsapp}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {w.intendedPlan}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{w.niche || 'Geral'}</td>
                      <td className="p-3 text-slate-500">{w.createdAt}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-[11px] rounded-lg shadow flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => {
                              const createdUser = registerFreeBeta(w.name, w.email);
                              approveBetaUser(createdUser.id);
                              migrateUserPlan(createdUser.id, w.intendedPlan === 'agency' ? 'agencia' : 'produtorPro');
                              toggleUserExempt(createdUser.id);
                              triggerSaveMessage(`Acesso liberado e VIP concedido para ${w.name}!`);
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] rounded-lg shadow flex items-center gap-1"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>Conceder VIP</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE CRIAÇÃO MANUAL DE USUÁRIO */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" /> Criar Novo Usuário Manualmente
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">E-mail de Acesso</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Papel do Usuário (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs font-semibold"
                >
                  <option value="MASTER">MASTER (Dono Supremo da Plataforma)</option>
                  <option value="EQUIPE_SUPORTE">EQUIPE_SUPORTE (Apoio Operacional)</option>
                  <option value="AGENCIA_COPRODUCAO">AGENCIA_COPRODUCAO (Co-produção)</option>
                  <option value="PRODUTOR_PRO">PRODUTOR_PRO (IA Ilimitada + Membros)</option>
                  <option value="PRODUTOR">PRODUTOR (Gerador + Exportação PDF)</option>
                  <option value="PRODUTOR_INICIANTE">PRODUTOR_INICIANTE (Pay-As-You-Go)</option>
                  <option value="AFILIADO">AFILIADO (Divulgador)</option>
                  <option value="ALUNO">ALUNO (Consumidor Final)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Plano Vinculado</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as PlanType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs font-semibold"
                >
                  <option value="iniciante">Produtor Iniciante</option>
                  <option value="produtor">Produtor</option>
                  <option value="produtorPro">Produtor Pro</option>
                  <option value="agencia">Agência</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Senha Inicial</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Créditos de IA</label>
                <input
                  type="number"
                  value={newCredits}
                  onChange={(e) => setNewCredits(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={newIsExempt}
                  onChange={(e) => setNewIsExempt(e.target.checked)}
                  className="rounded border-slate-800 text-amber-500 focus:ring-amber-500"
                />
                <span className="font-bold text-purple-300">Tornar VIP Isento (Sem Cobrança)</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow"
                >
                  Criar Usuário
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE EDIÇÃO DE USUÁRIO */}
      {editingUser && (
        <div className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" /> Editar Cliente ({editingUser.name})
              </h3>
              <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">E-mail</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Papel do Usuário (Role)</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs font-semibold"
                >
                  <option value="MASTER">MASTER (Dono Supremo da Plataforma)</option>
                  <option value="EQUIPE_SUPORTE">EQUIPE_SUPORTE (Apoio Operacional)</option>
                  <option value="AGENCIA_COPRODUCAO">AGENCIA_COPRODUCAO (Co-produção)</option>
                  <option value="PRODUTOR_PRO">PRODUTOR_PRO (IA Ilimitada + Membros)</option>
                  <option value="PRODUTOR">PRODUTOR (Gerador + Exportação PDF)</option>
                  <option value="PRODUTOR_INICIANTE">PRODUTOR_INICIANTE (Pay-As-You-Go)</option>
                  <option value="AFILIADO">AFILIADO (Divulgador)</option>
                  <option value="ALUNO">ALUNO (Consumidor Final)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Plano Vinculado</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value as PlanType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs font-semibold"
                >
                  <option value="iniciante">Produtor Iniciante</option>
                  <option value="produtor">Produtor</option>
                  <option value="produtorPro">Produtor Pro</option>
                  <option value="agencia">Agência</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 font-bold text-amber-300">Créditos de IA</label>
                <input
                  type="number"
                  value={editCredits}
                  onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 flex items-center justify-between">
                  <span>Nova Senha do Usuário</span>
                  <button
                    type="button"
                    onClick={() => setEditPassword('123456')}
                    className="text-[10px] text-amber-400 font-bold hover:underline"
                  >
                    Usar '123456'
                  </button>
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Deixe em branco para manter a senha atual"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
              >
                Salvar Dados
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
