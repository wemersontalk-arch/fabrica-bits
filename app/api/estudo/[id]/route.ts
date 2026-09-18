import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { db } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionUser = await getServerSession();

    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado. Faça login para acessar o conteúdo.' },
        { status: 401 }
      );
    }

    const productId = params.id;
    let product = db.getProductById(productId);

    // Se não estiver no banco dinâmico, verifica produtos demo padrão
    if (!product) {
      // Mock / Demo product fallback
      if (productId === 'dieta-dos-pontos-descomplicada-2' || productId === 'exemplo-infoproduto') {
        product = {
          id: productId,
          ownerId: 'user_prod_1',
          title: 'Dieta dos Pontos Descomplicada',
          niche: 'Saúde & Bem-Estar',
          type: 'E-book + Guia Prático',
          description: 'Método definitivo para emagrecer comendo o que gosta através do sistema de pontos.',
          contentJson: JSON.stringify({
            title: 'Dieta dos Pontos Descomplicada',
            subtitle: 'Emagreça sem passar fome',
            modules: [
              {
                id: 'mod_1',
                title: 'Módulo 1: Fundamentos da Dieta dos Pontos',
                description: 'Entenda como funciona a contagem de pontos e por que você não precisa cortar carboidratos.',
                lessons: [
                  {
                    id: 'les_1',
                    title: '1.1 Como Calcular sua Cota Diária',
                    content: 'Nesta aula você aprenderá a fórmula exata baseada em seu peso, altura e taxa metabólica basal.',
                    summary: 'Cálculo de taxa metabólica e tabela de conversão.',
                    keyTakeaways: ['Não zere carboidratos', 'Calcule sua cota inicial', 'Beba 2L de água por dia'],
                  }
                ]
              }
            ]
          }),
          createdAt: '15/09/2026',
          updatedAt: '15/09/2026',
        };
      }
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Infoproduto não encontrado.' },
        { status: 404 }
      );
    }

    // 🔒 VALIDAÇÃO ESTRITA BOLA / IDOR NO SERVIDOR
    const isOwner = sessionUser.id === product.ownerId;
    const isMasterOrAdmin =
      sessionUser.role === 'MASTER' ||
      sessionUser.role === 'admin' ||
      sessionUser.role === 'EQUIPE_SUPORTE';
    
    const enrollment = db.getEnrollment(sessionUser.id, product.id);
    const isEnrolled = enrollment && enrollment.status === 'ACTIVE';

    if (!isOwner && !isMasterOrAdmin && !isEnrolled) {
      return NextResponse.json(
        {
          success: false,
          error: 'ACESSO NEGADO (BOLA/IDOR Guard): Você não possui matrícula ativa para este curso.',
          productTitle: product.title,
        },
        { status: 403 }
      );
    }

    // Busca registro de progresso do aluno no banco
    const progressRecord = db.getProgressRecord(sessionUser.id, product.id);
    const completedLessons = progressRecord ? progressRecord.completedLessons : [];

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        niche: product.niche,
        type: product.type,
        description: product.description,
        content: JSON.parse(product.contentJson),
        ownerId: product.ownerId,
        createdAt: product.createdAt,
      },
      userAuthorization: {
        isOwner,
        isMasterOrAdmin,
        isEnrolled,
      },
      completedLessons,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao validar autorização do curso no servidor.' },
      { status: 500 }
    );
  }
}
