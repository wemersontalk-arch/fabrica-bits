import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

// 1. Tabela de Usuários
export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash'),
    role: text('role').notNull().default('PRODUTOR'),
    plan: text('plan').notNull().default('produtor'),
    status: text('status').notNull().default('active'),
    isExempt: integer('is_exempt', { mode: 'boolean' }).notNull().default(false),
    credits: integer('credits').notNull().default(50),
    avatarUrl: text('avatar_url'),
    createdAt: text('created_at').notNull(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
  })
);

// 2. Tabela de Infoprodutos
export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    niche: text('niche').notNull(),
    type: text('type').notNull(),
    description: text('description'),
    contentJson: text('content_json').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => ({
    ownerIdx: index('products_owner_idx').on(table.ownerId),
  })
);

// 3. Tabela de Matrículas (Alunos em Cursos)
export const enrollments = sqliteTable(
  'enrollments',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('ACTIVE'), // ACTIVE, SUSPENDED, CANCELLED
    enrolledAt: text('enrolled_at').notNull(),
  },
  (table) => ({
    userProductIdx: index('enrollments_user_product_idx').on(table.userId, table.productId),
  })
);

// 4. Tabela de Progresso de Aulas no LMS
export const progressRecords = sqliteTable(
  'progress_records',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    completedLessonsJson: text('completed_lessons_json').notNull().default('[]'),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => ({
    progressUserProductIdx: index('progress_user_product_idx').on(table.userId, table.productId),
  })
);

// 5. Tabela de Configurações Globais do Sistema (Master)
export const systemSettings = sqliteTable('system_settings', {
  id: text('id').primaryKey().default('default_settings'),
  gatewaysJson: text('gateways_json').notNull(),
  pricingJson: text('pricing_json').notNull(),
  apiIntegrationsJson: text('api_integrations_json').notNull(),
  telemetryJson: text('telemetry_json').notNull(),
  featureFlagsJson: text('feature_flags_json').notNull(),
  updatedAt: text('updated_at').notNull(),
});
