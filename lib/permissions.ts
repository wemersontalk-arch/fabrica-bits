import { User, GeneratedInfoproduct, SystemSettings } from '@/types/infoproduct';

export interface CanGenerateResult {
  allowed: boolean;
  reason?: string;
  isMonthlyLimitReached?: boolean;
}

export interface CanAccessLMSResult {
  allowed: boolean;
  reason?: string;
  requiresUpgradeToPro?: boolean;
}

export interface EngineResolveResult {
  engine: 'openai' | 'local';
  modeReason: string;
}

export function getGenerationEngine(user: User | null, settings?: SystemSettings | null): EngineResolveResult {
  if (!settings) {
    return { engine: 'local', modeReason: 'Configurações do sistema indisponíveis. Usando Motor Local (Custo Zero).' };
  }

  // 1. Validar Chave Master
  if (!settings.apiIntegrations.masterSwitchEnabled) {
    return { engine: 'local', modeReason: 'Chave Master de API desativada pelo administrador. Usando Motor Local (Custo Zero).' };
  }

  // 2. Validar presença da API Key da OpenAI
  if (!settings.apiIntegrations.openaiKey || settings.apiIntegrations.openaiKey.trim() === '') {
    return { engine: 'local', modeReason: 'Chave OpenAI não configurada no Admin. Usando Motor Local (Custo Zero).' };
  }

  // 3. Perfis Administrativos e VIP Isentos sempre utilizam IA OpenAI quando a Chave Master estiver LIGADA
  if (user?.role === 'MASTER' || user?.role === 'EQUIPE_SUPORTE' || user?.role === 'admin' || user?.isExempt) {
    return { engine: 'openai', modeReason: 'Integração OpenAI GPT-4o ativa para Administrador/VIP.' };
  }

  // 4. Validar Matriz de Feature Flags do Plano
  const userPlan = user?.plan || 'iniciante';
  const flags = settings.planFeatureFlags;

  let isAllowedForPlan = false;
  if (userPlan === 'iniciante' || userPlan === 'free') isAllowedForPlan = !!flags?.iniciante?.allowOpenAI;
  else if (userPlan === 'produtor') isAllowedForPlan = !!flags?.produtor?.allowOpenAI;
  else if (userPlan === 'produtorPro' || userPlan === 'pro') isAllowedForPlan = !!flags?.produtorPro?.allowOpenAI;
  else if (userPlan === 'agencia' || userPlan === 'agency') isAllowedForPlan = !!flags?.agencia?.allowOpenAI;

  if (isAllowedForPlan) {
    return { engine: 'openai', modeReason: `Plano ${userPlan.toUpperCase()} autorizado a consumir API OpenAI GPT-4o.` };
  }

  return { engine: 'local', modeReason: `Plano ${userPlan.toUpperCase()} configurado para Motor Local (Custo Zero).` };
}

export function canGenerateProduct(
  user: User | null,
  monthlyGenerationsCount: number = 0
): CanGenerateResult {
  if (!user) {
    return { allowed: false, reason: 'Você precisa estar logado para gerar um infoproduto.' };
  }

  // Master, Equipe Suporte, Admin e Isentos VIP possuem acesso ilimitado
  if (
    user.role === 'MASTER' ||
    user.role === 'EQUIPE_SUPORTE' ||
    user.role === 'admin' ||
    user.isExempt
  ) {
    return { allowed: true };
  }

  // Produtor PRO e Agência possuem acesso ilimitado
  if (
    user.role === 'PRODUTOR_PRO' ||
    user.role === 'AGENCIA_COPRODUCAO' ||
    user.plan === 'pro' ||
    user.plan === 'produtorPro' ||
    user.plan === 'agencia'
  ) {
    return { allowed: true };
  }

  // Produtor padrão (R$ 97/mês) tem gerações liberadas
  if (user.role === 'PRODUTOR' || user.plan === 'produtor') {
    return { allowed: true };
  }

  // Produtor Iniciante: Limitado a 1 geração por mês
  if (user.role === 'PRODUTOR_INICIANTE' || user.plan === 'iniciante' || user.plan === 'free') {
    if (monthlyGenerationsCount >= 1) {
      return {
        allowed: false,
        reason: 'Sua cota de 1 geração mensal no plano Produtor Iniciante foi atingida.',
        isMonthlyLimitReached: true,
      };
    }
    return { allowed: true };
  }

  return { allowed: true };
}

export function canAccessLMS(user: User | null): CanAccessLMSResult {
  if (!user) {
    return { allowed: false, reason: 'Faça login para acessar a Área de Membros.' };
  }

  // Alunos e Perfis Administrativos/PRO possuem acesso total
  if (
    user.role === 'ALUNO' ||
    user.role === 'MASTER' ||
    user.role === 'EQUIPE_SUPORTE' ||
    user.role === 'PRODUTOR_PRO' ||
    user.role === 'AGENCIA_COPRODUCAO' ||
    user.role === 'admin' ||
    user.plan === 'pro' ||
    user.plan === 'produtorPro' ||
    user.plan === 'agencia' ||
    user.isExempt
  ) {
    return { allowed: true };
  }

  // Produtor Standard e Iniciante não possuem acesso à Área de Membros do Aluno LMS
  return {
    allowed: false,
    reason: 'A Área de Membros do Aluno (LMS) é um recurso exclusivo do Plano Produtor PRO.',
    requiresUpgradeToPro: true,
  };
}

export function canExportPDF(user: User | null): boolean {
  if (!user) return false;
  return true;
}

export function canManageAffiliates(user: User | null): { allowed: boolean; status: 'in_development' } {
  return { allowed: false, status: 'in_development' };
}
