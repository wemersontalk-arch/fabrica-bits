export type ToneOfVoice = 'pratico' | 'academico' | 'empatico' | 'provocativo';

export type ProductFormat = 'ebook_guiado' | 'apostila_pratica' | 'roteiro_curso' | 'manual_passo_a_passo';

export type UserRole =
  | 'MASTER'
  | 'EQUIPE_SUPORTE'
  | 'AGENCIA_COPRODUCAO'
  | 'PRODUTOR_PRO'
  | 'PRODUTOR'
  | 'PRODUTOR_INICIANTE'
  | 'AFILIADO'
  | 'ALUNO'
  | 'admin'
  | 'producer'
  | 'student';

export type PlanType = 'free' | 'iniciante' | 'produtor' | 'pro' | 'produtorPro' | 'agencia' | 'agency';
export type UserStatus = 'active' | 'pending_beta' | 'blocked';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  plan: PlanType;
  status: UserStatus;
  isExempt?: boolean;
  avatarUrl?: string;
  createdAt: string;
  credits?: number;
  creditsBalance?: number;
  affiliateCode?: string;
  commissionBalance?: number;
  workspaceId?: string;
}

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  intendedPlan: 'pro' | 'agency';
  niche?: string;
  createdAt: string;
  notes?: string;
}

export interface PlatformIntegrationConfig {
  platform: 'kiwify' | 'hotmart' | 'eduzz';
  checkoutUrl: string;
  apiKey?: string;
  webhookUrl?: string;
  isAutoSyncEnabled: boolean;
}

export interface InfoproductInput {
  niche: string;
  subniche: string;
  targetAudience: string;
  painPoints: string;
  hiddenDesires: string;
  tone: ToneOfVoice;
  format: ProductFormat;
  authorName?: string;
  moduleCount: 5 | 7 | 10;
  enableQuiz: boolean;
}

export interface StepItem {
  stepNumber: number;
  title: string;
  description: string;
  actionItem: string;
  imageUrl?: string;
}

export interface CommonMistake {
  mistake: string;
  solution: string;
}

export interface CaseStudy {
  title: string;
  scenario: string;
  result: string;
}

export interface ChapterChecklist {
  id: string;
  item: string;
  explanation: string;
}

export interface SummaryTable {
  headers: string[];
  rows: string[][];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface MentorCallouts {
  tip: string;
  warning: string;
  challenge: string;
}

export interface YouTubeVideoItem {
  title: string;
  url: string;
  embedUrl: string;
  duration: string;
  channel: string;
}

export interface ExternalLinkItem {
  title: string;
  url: string;
  domain: string;
  description: string;
}

export interface FullLessonContent {
  introduction: string;
  coreTheory: string;
  practicalExecution: string;
  proTips: string;
  summaryTakeaways?: string[];
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  objective: string;
  introduction: string;
  frameworkName: string;
  imageUrl?: string;
  imageCaption?: string;
  fullLessonContent?: FullLessonContent;
  mentorCallouts: MentorCallouts;
  stepByStep: StepItem[];
  commonMistakes: CommonMistake[];
  caseStudy: CaseStudy;
  checklists: ChapterChecklist[];
  summaryTable: SummaryTable;
  quiz?: QuizQuestion[];
  youtubeVideos?: YouTubeVideoItem[];
  externalLinks?: ExternalLinkItem[];
}

export interface GabaritoItem {
  chapterNumber: number;
  chapterTitle: string;
  answers: {
    questionNumber: number;
    question: string;
    correctOption: string;
    explanation: string;
  }[];
}

export interface PricingConfig {
  mode: 'fixed' | 'promo';
  fixedPrice: string;
  originalPrice: string;
  promoPrice: string;
  discountBadge?: string;
  installmentsText?: string;
}

export interface SalesKit {
  funnelCheckoutUrl?: string;
  pricing?: PricingConfig;
  landingPageCopy: {
    headline: string;
    subheadline: string;
    problemSection: string[];
    solutionSection: string;
    methodHighlights: string[];
    objectionHandling: { objection: string; answer: string }[];
    authorBio: string;
    faq: { question: string; answer: string }[];
    ctaText: string;
  };
  whatsappSequence: {
    messageNumber: number;
    objective: string;
    text: string;
  }[];
}

export interface StudentCertificateInfo {
  fullName: string;
  cpf: string;
  issuedAt: string;
  certificateId: string;
}

export interface InfoproductStructure {
  title: string;
  subtitle: string;
  chapters: Array<{
    id: number;
    title: string;
    subtitle: string;
    objective: string;
    introduction: string;
    lessons: Array<{
      id: string;
      title: string;
      content: string;
      summary: string;
      keyTakeaways: string[];
    }>;
  }>;
  salesKit?: any;
}

export interface GeneratedInfoproduct {
  id: string;
  methodName: string;
  tagline: string;
  promise: string;
  coverImage: string;
  targetAudienceProfile: string;
  input: InfoproductInput;
  chapters: Chapter[];
  gabarito?: GabaritoItem[];
  salesKit: SalesKit;
  createdAt: string;
}

export interface GenerationStep {
  id: number;
  label: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  detail: string;
}

export interface PaymentGatewayConfig {
  enabled: boolean;
  apiKey?: string;
  environment?: string;
  publishableKey?: string;
  secretKey?: string;
  publicKey?: string;
  accessToken?: string;
  webhookSecret?: string;
}

export interface GoogleOAuthConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  callbackUrl?: string;
}

export interface ApiIntegrationsConfig {
  masterSwitchEnabled: boolean;
  statusLed?: 'green' | 'yellow' | 'red';
  openaiKey?: string;
  openaiModel?: string;
  unsplashAccessKey?: string;
  whatsappZapiToken?: string;
  whatsappZapiInstance?: string;
  globalWebhookUrl?: string;
}

export interface SystemHealthStatus {
  apiStatus: 'online' | 'degraded' | 'offline';
  databaseStatus: 'online' | 'degraded' | 'offline';
  aiEngineStatus: 'online' | 'degraded' | 'offline';
  whatsappStatus: 'online' | 'degraded' | 'offline';
  latencyMs: number;
  tokenUsageToday: number;
  activeSessions: number;
}

export interface PlanPricingConfig {
  iniciante: number;
  produtor: number;
  produtorPro: number;
  agencia: number;
}

export interface PlanFeatureFlags {
  iniciante: { allowOpenAI: boolean };
  produtor: { allowOpenAI: boolean };
  produtorPro: { allowOpenAI: boolean };
  agencia: { allowOpenAI: boolean };
}

export interface LlmTelemetryMetrics {
  inputTokensTotal: number;
  outputTokensTotal: number;
  estimatedCostUsd: number;
  apiCallsSuccess: number;
  apiCallsError: number;
  localEngineRequests: number;
  estimatedSavingsUsd: number;
  averageLocalLatencyMs: number;
}

export interface CompanyInfoConfig {
  companyName: string;
  supportEmail: string;
  whatsappContact: string;
  enableWhatsappActivation: boolean;
}

export interface SystemSettings {
  gateways: {
    asaas: PaymentGatewayConfig;
    stripe: PaymentGatewayConfig;
    mercadoPago: PaymentGatewayConfig;
    kiwify: PaymentGatewayConfig;
  };
  googleOAuth: GoogleOAuthConfig;
  apiIntegrations: ApiIntegrationsConfig;
  health: SystemHealthStatus;
  pricing: PlanPricingConfig;
  planFeatureFlags: PlanFeatureFlags;
  telemetry: LlmTelemetryMetrics;
  companyInfo?: CompanyInfoConfig;
}
