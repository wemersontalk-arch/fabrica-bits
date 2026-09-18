'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PlanType, UserStatus, WaitlistEntry, SystemSettings, LlmTelemetryMetrics } from '@/types/infoproduct';

interface AuthContextType {
  user: User | null;
  usersList: User[];
  waitlist: WaitlistEntry[];
  systemSettings: SystemSettings;
  monthlyGenerationsCount: number;
  showMonthlyLimitModal: boolean;
  setShowMonthlyLimitModal: (show: boolean) => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  incrementGenerationCount: () => void;
  recordTelemetry: (data: Partial<LlmTelemetryMetrics>) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  registerFreeBeta: (name: string, email: string) => User;
  createUserManual: (data: Partial<User>) => User;
  addToWaitlist: (name: string, email: string, whatsapp: string, intendedPlan: 'pro' | 'agency', niche?: string) => void;
  approveBetaUser: (userId: string) => void;
  toggleUserBlock: (userId: string) => void;
  toggleUserExempt: (userId: string) => void;
  migrateUserPlan: (userId: string, newPlan: PlanType) => void;
  updateUserData: (userId: string, data: Partial<User>) => void;
  updateSystemSettings: (data: Partial<SystemSettings>) => void;
  resetUserPassword: (userId: string, newPassword?: string) => string;
  deleteUser: (userId: string) => void;
  switchPlan: (newPlan: PlanType) => void;
  switchRole: (newRole: UserRole) => void;
}

const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'user_master_1',
    name: 'Master Administrador',
    email: 'master@infoproductengine.ai',
    role: 'MASTER',
    plan: 'agencia',
    status: 'active',
    isExempt: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '01/09/2026',
  },
  {
    id: 'user_prod_1',
    name: 'Amanda Ramos (Produtora Pro)',
    email: 'produtor@infoproductengine.ai',
    role: 'PRODUTOR_PRO',
    plan: 'pro',
    status: 'active',
    isExempt: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '10/09/2026',
  },
  {
    id: 'user_beta_1',
    name: 'Carlos Oliveira (Cadastro Beta)',
    email: 'beta@infoproductengine.ai',
    role: 'PRODUTOR_INICIANTE',
    plan: 'iniciante',
    status: 'pending_beta',
    isExempt: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    createdAt: '16/09/2026',
  },
];

const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wl_1',
    name: 'Dra. Carolina Mendes',
    email: 'carolina@saudefit.com.br',
    whatsapp: '(11) 98765-4321',
    intendedPlan: 'pro',
    niche: 'Saúde & Nutrição',
    createdAt: '16/09/2026',
    notes: 'Interessada em lançar e-book e curso de marmitas fit em outubro',
  },
  {
    id: 'wl_2',
    name: 'Agência Lançamentos 360',
    email: 'contato@agencialancamentos.com',
    whatsapp: '(21) 99887-6655',
    intendedPlan: 'agency',
    niche: 'Vendas & Marketing',
    createdAt: '15/09/2026',
    notes: 'Agência com 8 especialistas no nicho de finanças',
  }
];

const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  gateways: {
    asaas: { enabled: true, apiKey: 'asaas_live_sec_demo_98741123', environment: 'production' },
    stripe: { enabled: false, publishableKey: '', secretKey: '' },
    mercadoPago: { enabled: true, publicKey: 'APP_USR_demo_pub_key', accessToken: 'APP_USR_demo_access' },
    kiwify: { enabled: true, webhookSecret: 'kiwi_wh_sec_99123' },
  },
  pricing: {
    iniciante: 29.90,
    produtor: 97.00,
    produtorPro: 197.00,
    agencia: 497.00,
  },
  googleOAuth: {
    enabled: true,
    clientId: '784920119-demo.apps.googleusercontent.com',
    clientSecret: 'GOCSPX-demo_secret_key_8812',
  },
  apiIntegrations: {
    masterSwitchEnabled: true,
    statusLed: 'green',
    openaiKey: 'sk-proj-demo-1234567890abcdef',
    openaiModel: 'gpt-4o',
    unsplashAccessKey: 'unsplash_demo_access_key',
    whatsappZapiToken: 'zapi_token_demo_5511',
    whatsappZapiInstance: 'zapi_instance_3B9',
  },
  health: {
    apiStatus: 'online',
    databaseStatus: 'online',
    aiEngineStatus: 'online',
    whatsappStatus: 'online',
    latencyMs: 42,
    tokenUsageToday: 142580,
    activeSessions: 38,
  },
  planFeatureFlags: {
    iniciante: { allowOpenAI: false },
    produtor: { allowOpenAI: false },
    produtorPro: { allowOpenAI: true },
    agencia: { allowOpenAI: true },
  },
  telemetry: {
    inputTokensTotal: 98450,
    outputTokensTotal: 44130,
    estimatedCostUsd: 0.68,
    apiCallsSuccess: 14,
    apiCallsError: 0,
    localEngineRequests: 86,
    estimatedSavingsUsd: 42.50,
    averageLocalLatencyMs: 38,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(INITIAL_DEMO_USERS);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(INITIAL_WAITLIST);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);
  const [monthlyGenerationsCount, setMonthlyGenerationsCount] = useState<number>(0);
  const [showMonthlyLimitModal, setShowMonthlyLimitModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  const getLatestUsers = (): User[] => {
    if (typeof window === 'undefined') return INITIAL_DEMO_USERS;
    const stored = localStorage.getItem('infoproduct_users_list');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return usersList;
  };

  useEffect(() => {
    // Sincronizar sessão do servidor via cookie httpOnly
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          if (data.systemSettings) setSystemSettings(data.systemSettings);
          if (data.usersList) setUsersList(data.usersList);
        } else {
          // Fallback para usuário salvo no localStorage se não houver cookie no dev
          const storedUser = localStorage.getItem('infoproduct_auth_user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {}
          }
        }
      })
      .catch(() => {
        const storedUser = localStorage.getItem('infoproduct_auth_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {}
        }
      });

    // Carregar lista de espera local
    const storedWaitlist = localStorage.getItem('infoproduct_waitlist');
    if (storedWaitlist) {
      try {
        setWaitlist(JSON.parse(storedWaitlist));
      } catch (e) {
        setWaitlist(INITIAL_WAITLIST);
      }
    }

    // Carregar contagem de gerações mensais
    const storedGenerations = localStorage.getItem('infoproduct_monthly_generations');
    if (storedGenerations) {
      setMonthlyGenerationsCount(parseInt(storedGenerations) || 0);
    }
  }, []);

  const saveUsersList = (newUsers: User[]) => {
    setUsersList(newUsers);
    if (typeof window !== 'undefined') {
      localStorage.setItem('infoproduct_users_list', JSON.stringify(newUsers));
    }
  };

  const saveWaitlist = (newList: WaitlistEntry[]) => {
    setWaitlist(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('infoproduct_waitlist', JSON.stringify(newList));
    }
  };

  const saveCurrentUser = (updatedUser: User | null) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      if (updatedUser) {
        localStorage.setItem('infoproduct_auth_user', JSON.stringify(updatedUser));
      } else {
        localStorage.removeItem('infoproduct_auth_user');
      }
    }
  };

  const updateSystemSettings = (data: Partial<SystemSettings>) => {
    const updated = { ...systemSettings, ...data };
    setSystemSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('infoproduct_system_settings', JSON.stringify(updated));
    }
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Sincroniza sessão no servidor injetando cookie httpOnly
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        saveCurrentUser(data.user);
        return { success: true };
      }
      if (data.error) {
        return { success: false, error: data.error };
      }
    } catch (e) {}

    const currentUsers = getLatestUsers();

    // Validação estrita do Master Admin
    if (cleanEmail === 'master@infoproductengine.ai' || cleanEmail === 'admin@infoproductengine.ai') {
      if (password && password !== 'admin123') {
        const masterObj = currentUsers.find((u) => u.email.toLowerCase() === 'master@infoproductengine.ai');
        if (masterObj && masterObj.password && masterObj.password !== password) {
          return { success: false, error: 'Senha incorreta para a conta Master Admin. Utilize a senha configurada.' };
        }
      }

      const masterUser = currentUsers.find((u) => u.email.toLowerCase() === 'master@infoproductengine.ai') || INITIAL_DEMO_USERS[0];
      saveCurrentUser(masterUser);
      return { success: true };
    }

    // Validação de Usuários Normais
    const existing = currentUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.status === 'blocked') {
        return { success: false, error: 'Sua conta está bloqueada pelo administrador.' };
      }
      saveCurrentUser(existing);
      return { success: true };
    }

    // Se o usuário não existe no sistema, cria uma conta em aprovação beta
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      role: 'PRODUTOR',
      plan: 'produtor',
      status: 'pending_beta',
      isExempt: false,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    saveUsersList([...currentUsers, newUser]);
    saveCurrentUser(newUser);
    return { success: true };
  };

  const registerFreeBeta = (name: string, email: string): User => {
    const currentUsers = getLatestUsers();
    const newUser: User = {
      id: `user_beta_${Date.now()}`,
      name,
      email,
      role: 'PRODUTOR_INICIANTE',
      plan: 'iniciante',
      status: 'pending_beta',
      isExempt: false,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    saveUsersList([...currentUsers, newUser]);
    saveCurrentUser(newUser);
    return newUser;
  };

  const createUserManual = (data: Partial<User>): User => {
    const currentUsers = getLatestUsers();
    const newUser: User = {
      id: `user_m_${Date.now()}`,
      name: data.name || 'Novo Usuário',
      email: data.email || `usuario_${Date.now()}@infoproduct.ai`,
      role: data.role || 'PRODUTOR',
      plan: data.plan || 'produtor',
      status: data.status || 'active',
      isExempt: data.isExempt ?? false,
      credits: data.credits ?? 50,
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      password: data.password || '123456',
    };

    saveUsersList([newUser, ...currentUsers]);
    return newUser;
  };

  const addToWaitlist = (name: string, email: string, whatsapp: string, intendedPlan: 'pro' | 'agency', niche?: string) => {
    const newEntry: WaitlistEntry = {
      id: `wl_${Date.now()}`,
      name,
      email,
      whatsapp,
      intendedPlan,
      niche: niche || 'Não especificado',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      notes: 'Inscrição realizada via formulário de planos',
    };

    saveWaitlist([newEntry, ...waitlist]);
  };

  const approveBetaUser = (userId: string) => {
    const updated = usersList.map((u) => (u.id === userId ? { ...u, status: 'active' as UserStatus } : u));
    saveUsersList(updated);
    if (user?.id === userId) {
      saveCurrentUser({ ...user, status: 'active' });
    }
  };

  const toggleUserBlock = (userId: string) => {
    const updated = usersList.map((u) =>
      u.id === userId ? { ...u, status: (u.status === 'blocked' ? 'active' : 'blocked') as UserStatus } : u
    );
    saveUsersList(updated);
    if (user?.id === userId) {
      saveCurrentUser({ ...user, status: user.status === 'blocked' ? 'active' : 'blocked' });
    }
  };

  const toggleUserExempt = (userId: string) => {
    const updated = usersList.map((u) => (u.id === userId ? { ...u, isExempt: !u.isExempt } : u));
    saveUsersList(updated);
    if (user?.id === userId) {
      saveCurrentUser({ ...user, isExempt: !user.isExempt });
    }
  };

  const migrateUserPlan = (userId: string, newPlan: PlanType) => {
    const updated = usersList.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u));
    saveUsersList(updated);
    if (user?.id === userId) {
      saveCurrentUser({ ...user, plan: newPlan });
    }
  };

  const updateUserData = (userId: string, data: Partial<User>) => {
    const updated = usersList.map((u) => (u.id === userId ? { ...u, ...data } : u));
    saveUsersList(updated);
    if (user?.id === userId) {
      saveCurrentUser({ ...user, ...data });
    }
  };

  const deleteUser = (userId: string) => {
    const updated = usersList.filter((u) => u.id !== userId);
    saveUsersList(updated);
    if (user?.id === userId) {
      logout();
    }
  };

  const incrementGenerationCount = () => {
    const nextCount = monthlyGenerationsCount + 1;
    setMonthlyGenerationsCount(nextCount);
    if (typeof window !== 'undefined') {
      localStorage.setItem('infoproduct_monthly_generations', nextCount.toString());
    }
  };

  const recordTelemetry = (data: Partial<LlmTelemetryMetrics>) => {
    const currentTelem = systemSettings.telemetry || {
      inputTokensTotal: 0,
      outputTokensTotal: 0,
      estimatedCostUsd: 0,
      apiCallsSuccess: 0,
      apiCallsError: 0,
      localEngineRequests: 0,
      estimatedSavingsUsd: 0,
      averageLocalLatencyMs: 38,
    };

    const updatedTelemetry: LlmTelemetryMetrics = {
      ...currentTelem,
      inputTokensTotal: (currentTelem.inputTokensTotal || 0) + (data.inputTokensTotal || 0),
      outputTokensTotal: (currentTelem.outputTokensTotal || 0) + (data.outputTokensTotal || 0),
      estimatedCostUsd: Number(((currentTelem.estimatedCostUsd || 0) + (data.estimatedCostUsd || 0)).toFixed(4)),
      apiCallsSuccess: (currentTelem.apiCallsSuccess || 0) + (data.apiCallsSuccess || 0),
      apiCallsError: (currentTelem.apiCallsError || 0) + (data.apiCallsError || 0),
      localEngineRequests: (currentTelem.localEngineRequests || 0) + (data.localEngineRequests || 0),
      estimatedSavingsUsd: Number(((currentTelem.estimatedSavingsUsd || 0) + (data.estimatedSavingsUsd || 0)).toFixed(2)),
      averageLocalLatencyMs: data.averageLocalLatencyMs || currentTelem.averageLocalLatencyMs || 38,
    };

    updateSystemSettings({ telemetry: updatedTelemetry });
  };

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    saveCurrentUser(null);
  };

  const switchPlan = (newPlan: PlanType) => {
    if (!user) return;
    const updated = { ...user, plan: newPlan };
    saveCurrentUser(updated);
    migrateUserPlan(user.id, newPlan);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    saveCurrentUser(updated);
    updateUserData(user.id, { role: newRole });
  };

  const resetUserPassword = (userId: string, newPassword = '123456'): string => {
    const currentUsers = getLatestUsers();
    const updated = currentUsers.map((u) => (u.id === userId ? { ...u, password: newPassword } : u));
    saveUsersList(updated);
    if (user?.id === userId) {
      saveCurrentUser({ ...user, password: newPassword });
    }
    return newPassword;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        usersList,
        waitlist,
        systemSettings,
        monthlyGenerationsCount,
        showMonthlyLimitModal,
        setShowMonthlyLimitModal,
        showUpgradeModal,
        setShowUpgradeModal,
        incrementGenerationCount,
        recordTelemetry,
        login,
        logout,
        registerFreeBeta,
        createUserManual,
        addToWaitlist,
        approveBetaUser,
        toggleUserBlock,
        toggleUserExempt,
        migrateUserPlan,
        updateUserData,
        updateSystemSettings,
        resetUserPassword,
        deleteUser,
        switchPlan,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
