import fs from 'fs';
import path from 'path';
import os from 'os';
import { User, SystemSettings, PlanType, UserRole, UserStatus } from '@/types/infoproduct';

const DB_DIR = process.env.VERCEL ? path.join(os.tmpdir(), 'fabrica_data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

export interface DbSchema {
  users: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash?: string;
    role: UserRole;
    plan: PlanType;
    status: UserStatus;
    isExempt: boolean;
    credits: number;
    avatarUrl?: string;
    createdAt: string;
  }>;
  products: Array<{
    id: string;
    ownerId: string;
    title: string;
    niche: string;
    type: string;
    description?: string;
    contentJson: string;
    createdAt: string;
    updatedAt: string;
  }>;
  enrollments: Array<{
    id: string;
    userId: string;
    productId: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
    enrolledAt: string;
  }>;
  progressRecords: Array<{
    id: string;
    userId: string;
    productId: string;
    completedLessons: string[];
    updatedAt: string;
  }>;
  systemSettings: SystemSettings;
}

const DEFAULT_SETTINGS: SystemSettings = {
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
    openaiKey: process.env.OPENAI_API_KEY || 'sk-proj-demo-1234567890abcdef',
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

const INITIAL_MASTER_USER = {
  id: 'user_master_1',
  name: 'Master Administrador',
  email: 'master@infoproductengine.ai',
  passwordHash: '$2a$10$demo_master_password_hash_123',
  role: 'MASTER' as UserRole,
  plan: 'agencia' as PlanType,
  status: 'active' as UserStatus,
  isExempt: true,
  credits: 9999,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  createdAt: '01/09/2026',
};

const INITIAL_PROD_USER = {
  id: 'user_prod_1',
  name: 'Amanda Ramos (Produtora Pro)',
  email: 'produtor@infoproductengine.ai',
  passwordHash: '$2a$10$demo_prod_password_hash_456',
  role: 'PRODUTOR_PRO' as UserRole,
  plan: 'pro' as PlanType,
  status: 'active' as UserStatus,
  isExempt: false,
  credits: 100,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  createdAt: '10/09/2026',
};

let memoryDbCache: DbSchema | null = null;

function ensureDbFile(): DbSchema {
  if (memoryDbCache) return memoryDbCache;

  const initialData: DbSchema = {
    users: [INITIAL_MASTER_USER, INITIAL_PROD_USER],
    products: [],
    enrollments: [
      {
        id: 'enr_demo_1',
        userId: 'user_prod_1',
        productId: 'dieta-dos-pontos-descomplicada-2',
        status: 'ACTIVE',
        enrolledAt: new Date().toISOString(),
      },
    ],
    progressRecords: [],
    systemSettings: DEFAULT_SETTINGS,
  };

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      memoryDbCache = initialData;
      return initialData;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    memoryDbCache = JSON.parse(raw) as DbSchema;
    return memoryDbCache;
  } catch (e) {
    memoryDbCache = initialData;
    return memoryDbCache;
  }
}

function writeDb(data: DbSchema) {
  memoryDbCache = data;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // Ignora silenciosamente erros de escrita no sistema de arquivos em ambiente serverless
  }
}

// Data Access Layer (DAL) com persistência confiável em disco no servidor
export const db = {
  getUsers: (): DbSchema['users'] => {
    const data = ensureDbFile();
    return data.users;
  },

  getUserByEmail: (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const data = ensureDbFile();
    return data.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  getUserById: (id: string) => {
    const data = ensureDbFile();
    return data.users.find((u) => u.id === id) || null;
  },

  saveUser: (user: DbSchema['users'][0]) => {
    const data = ensureDbFile();
    const index = data.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      data.users[index] = { ...data.users[index], ...user };
    } else {
      data.users.unshift(user);
    }
    writeDb(data);
    return user;
  },

  deleteUser: (id: string) => {
    const data = ensureDbFile();
    data.users = data.users.filter((u) => u.id !== id);
    writeDb(data);
  },

  getProducts: (): DbSchema['products'] => {
    const data = ensureDbFile();
    return data.products;
  },

  getProductById: (id: string) => {
    const data = ensureDbFile();
    return data.products.find((p) => p.id === id) || null;
  },

  getProductsByOwner: (ownerId: string) => {
    const data = ensureDbFile();
    return data.products.filter((p) => p.ownerId === ownerId);
  },

  saveProduct: (product: DbSchema['products'][0]) => {
    const data = ensureDbFile();
    const index = data.products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      data.products[index] = { ...data.products[index], ...product };
    } else {
      data.products.unshift(product);
    }
    writeDb(data);
    return product;
  },

  getEnrollment: (userId: string, productId: string) => {
    const data = ensureDbFile();
    return data.enrollments.find((e) => e.userId === userId && e.productId === productId) || null;
  },

  createEnrollment: (userId: string, productId: string) => {
    const data = ensureDbFile();
    const existing = data.enrollments.find((e) => e.userId === userId && e.productId === productId);
    if (existing) return existing;

    const newEnrollment: DbSchema['enrollments'][0] = {
      id: `enr_${Date.now()}`,
      userId,
      productId,
      status: 'ACTIVE',
      enrolledAt: new Date().toISOString(),
    };
    data.enrollments.push(newEnrollment);
    writeDb(data);
    return newEnrollment;
  },

  getProgressRecord: (userId: string, productId: string) => {
    const data = ensureDbFile();
    return data.progressRecords.find((p) => p.userId === userId && p.productId === productId) || null;
  },

  saveProgressRecord: (userId: string, productId: string, completedLessons: string[]) => {
    const data = ensureDbFile();
    const index = data.progressRecords.findIndex((p) => p.userId === userId && p.productId === productId);
    if (index >= 0) {
      data.progressRecords[index].completedLessons = completedLessons;
      data.progressRecords[index].updatedAt = new Date().toISOString();
    } else {
      data.progressRecords.push({
        id: `prg_${Date.now()}`,
        userId,
        productId,
        completedLessons,
        updatedAt: new Date().toISOString(),
      });
    }
    writeDb(data);
  },

  getSystemSettings: (): SystemSettings => {
    const data = ensureDbFile();
    return data.systemSettings || DEFAULT_SETTINGS;
  },

  updateSystemSettings: (updated: Partial<SystemSettings>) => {
    const data = ensureDbFile();
    data.systemSettings = { ...data.systemSettings, ...updated };
    writeDb(data);
    return data.systemSettings;
  },
};
