import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { db } from '@/db';
import { getGenerationEngine } from '@/lib/permissions';
import { generateLocalInfoproduct } from '@/lib/generate-engine';
import { InfoproductStructure } from '@/types/infoproduct';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const sessionUser = await getServerSession();

    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Sessão expirada ou não autorizada. Faça login novamente.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { niche, productType, targetAudience, mainPromise, format } = body;

    if (!niche || !productType || !mainPromise) {
      return NextResponse.json(
        { success: false, error: 'Preencha todos os campos obrigatórios para gerar o infoproduto.' },
        { status: 400 }
      );
    }

    const systemSettings = db.getSystemSettings();
    const engineType = getGenerationEngine(sessionUser, systemSettings);

    const startTime = Date.now();
    let resultStructure: InfoproductStructure;
    let engineUsed: 'openai' | 'local' = 'local';
    let inputTokens = 0;
    let outputTokens = 0;
    let costUsd = 0;

    // 🔒 ISOLAMENTO TOTAL DE SEGREDO DE API NO SERVIDOR
    const serverApiKey = process.env.OPENAI_API_KEY || systemSettings.apiIntegrations?.openaiKey;
    const masterSwitch = systemSettings.apiIntegrations?.masterSwitchEnabled !== false;

    if (engineType.engine === 'openai' && masterSwitch && serverApiKey && !serverApiKey.includes('demo')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${serverApiKey}`,
          },
          body: JSON.stringify({
            model: systemSettings.apiIntegrations?.openaiModel || 'gpt-4o',
            messages: [
              {
                role: 'system',
                content:
                  'Você é um especialista em engenharia de infoprodutos digitais. Responda ESTRITAMENTE em formato JSON compatível com a estrutura de infoproduto.',
              },
              {
                role: 'user',
                content: `Gere um infoproduto completo no nicho ${niche}, tipo ${productType}, público ${targetAudience || 'Geral'}, promessa "${mainPromise}".`,
              },
            ],
            temperature: 0.7,
            max_tokens: 3000,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          inputTokens = data.usage?.prompt_tokens || 850;
          outputTokens = data.usage?.completion_tokens || 1400;
          costUsd = Number(((inputTokens * 0.0000025) + (outputTokens * 0.00001)).toFixed(4));
          
          const rawContent = data.choices[0]?.message?.content || '';
          try {
            const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
            resultStructure = JSON.parse(cleanJson);
            engineUsed = 'openai';
          } catch (jsonErr) {
            // Fallback transparente para o motor local se o JSON da IA vier malformado
            resultStructure = generateLocalInfoproduct(niche, productType, targetAudience || 'Geral', mainPromise);
            engineUsed = 'local';
          }
        } else {
          // Fallback para motor local em caso de erro na resposta da API
          resultStructure = generateLocalInfoproduct(niche, productType, targetAudience || 'Geral', mainPromise);
          engineUsed = 'local';
        }
      } catch (netErr) {
        // Fallback para motor local em caso de erro de conexão
        resultStructure = generateLocalInfoproduct(niche, productType, targetAudience || 'Geral', mainPromise);
        engineUsed = 'local';
      }
    } else {
      // 🔒 MODO MOTOR LOCAL (100% Determinístico - Zero requisições de rede externas)
      resultStructure = generateLocalInfoproduct(niche, productType, targetAudience || 'Geral', mainPromise);
      engineUsed = 'local';
    }

    const durationMs = Date.now() - startTime;

    // Atualiza telemetria do sistema no servidor
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

    if (engineUsed === 'openai') {
      db.updateSystemSettings({
        telemetry: {
          ...currentTelem,
          inputTokensTotal: currentTelem.inputTokensTotal + inputTokens,
          outputTokensTotal: currentTelem.outputTokensTotal + outputTokens,
          estimatedCostUsd: Number((currentTelem.estimatedCostUsd + costUsd).toFixed(4)),
          apiCallsSuccess: currentTelem.apiCallsSuccess + 1,
        },
      });
    } else {
      db.updateSystemSettings({
        telemetry: {
          ...currentTelem,
          localEngineRequests: currentTelem.localEngineRequests + 1,
          estimatedSavingsUsd: Number((currentTelem.estimatedSavingsUsd + 0.50).toFixed(2)),
          averageLocalLatencyMs: durationMs,
        },
      });
    }

    // Salva o produto gerado na tabela `products` no servidor
    const productId = `prod_${Date.now()}`;
    const newProduct = db.saveProduct({
      id: productId,
      ownerId: sessionUser.id,
      title: resultStructure.title,
      niche,
      type: productType,
      description: resultStructure.subtitle || mainPromise,
      contentJson: JSON.stringify(resultStructure),
      createdAt: new Date().toLocaleDateString('pt-BR'),
      updatedAt: new Date().toLocaleDateString('pt-BR'),
    });

    // Cria matrícula automática para o criador do produto
    db.createEnrollment(sessionUser.id, productId);

    return NextResponse.json({
      success: true,
      productId: newProduct.id,
      infoproduct: resultStructure,
      meta: {
        engineUsed,
        latencyMs: durationMs,
        tokensUsed: inputTokens + outputTokens,
        costUsd,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao processar geração do infoproduto no servidor.' },
      { status: 500 }
    );
  }
}
