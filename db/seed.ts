import { db } from './index';

export function seedInitialData() {
  console.log('🌱 Inicializando seed de dados do servidor...');
  
  // Garantir usuário Master
  const master = db.getUserByEmail('master@infoproductengine.ai');
  if (!master) {
    db.saveUser({
      id: 'user_master_1',
      name: 'Master Administrador',
      email: 'master@infoproductengine.ai',
      role: 'MASTER',
      plan: 'agencia',
      status: 'active',
      isExempt: true,
      credits: 9999,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      createdAt: '01/09/2026',
    });
    console.log('✅ Usuário Master criado com sucesso.');
  }

  // Garantir configurações do sistema
  db.getSystemSettings();
  console.log('✅ Configurações do sistema verificadas.');
}

// Executa seed ao carregar o módulo em ambiente Node
if (process.env.NODE_ENV !== 'production') {
  seedInitialData();
}
