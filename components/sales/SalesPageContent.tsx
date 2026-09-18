'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GeneratedInfoproduct } from '@/types/infoproduct';
import { slugify } from '@/lib/slugify';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingCart,
  HelpCircle,
  Lock,
  Award,
  BookOpen,
  CheckSquare
} from 'lucide-react';

interface SalesPageContentProps {
  slug?: string;
}

export const SalesPageContent: React.FC<SalesPageContentProps> = ({ slug: initialSlug = 'corpo-em-foco-3' }) => {
  const [product, setProduct] = useState<GeneratedInfoproduct | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryParamSlug = searchParams ? searchParams.get('p') : null;
    const targetSlug = queryParamSlug || initialSlug;

    // 0. Tenta buscar no localStorage por chave direta do slug
    const storedSlugKey = localStorage.getItem(`infoproduct_slug_${targetSlug}`);
    if (storedSlugKey) {
      try {
        const parsed = JSON.parse(storedSlugKey);
        if (parsed) {
          setProduct(parsed);
          return;
        }
      } catch (e) {}
    }

    // 1. Tenta encontrar no produto atual do localStorage
    const storedCurrent = localStorage.getItem('infoproduct_current_product');
    let currentParsed: GeneratedInfoproduct | null = null;
    if (storedCurrent) {
      try {
        currentParsed = JSON.parse(storedCurrent);
        if (currentParsed && slugify(currentParsed.methodName) === targetSlug) {
          setProduct(currentParsed);
          return;
        }
      } catch (e) {}
    }

    // 2. Tenta encontrar no histórico de produtos
    const storedHistory = localStorage.getItem('infoproduct_history');
    if (storedHistory) {
      try {
        const historyArr = JSON.parse(storedHistory);
        if (Array.isArray(historyArr)) {
          const matched = historyArr.find(
            (p: GeneratedInfoproduct) => p && p.methodName && slugify(p.methodName) === targetSlug
          );
          if (matched) {
            setProduct(matched);
            return;
          }
        }
      } catch (e) {}
    }

    // 3. Se houver produto no localStorage e for o produto recém-gerado
    if (currentParsed) {
      setProduct(currentParsed);
      return;
    }

    // 4. Se não houver no localStorage, monta uma Landing Page com os dados do Slug
    const formattedTitle = targetSlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    setProduct({
      id: `prod_${targetSlug}`,
      methodName: formattedTitle,
      tagline: 'O Método Definitivo para Transformar Seus Resultados Sem Enrolação',
      promise: 'Aprenda o passo a passo prático com acompanhamento e exercícios aplicáveis',
      coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      targetAudienceProfile: 'Pessoas que buscam transformar seus resultados com um método simples e direto ao ponto.',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      input: {
        niche: 'Desenvolvimento & Alta Performance',
        subniche: formattedTitle,
        targetAudience: 'Iniciantes e Profissionais',
        painPoints: 'Falta de tempo e excesso de informações confusas',
        hiddenDesires: 'Ter clareza e resultados rápidos',
        tone: 'pratico',
        format: 'ebook_guiado',
        moduleCount: 5,
        enableQuiz: true,
      },
      chapters: [
        {
          id: 1,
          title: `Módulo 1: Fundamentos do Método ${formattedTitle}`,
          subtitle: 'Visão Geral e Primeiros Passos Práticos',
          objective: 'Dominar os primeiros passos e eliminar os principais bloqueios.',
          introduction: 'Neste módulo inicial, você aprenderá as bases fundamentais...',
          frameworkName: 'Protocolo de Entrada',
          mentorCallouts: {
            tip: 'Conclua a leitura e os exercícios do dia 1 antes de avançar.',
            warning: 'Evite pular os fundamentos básicos.',
            challenge: 'Aplique o primeiro checklist em até 24h.',
          },
          stepByStep: [
            { stepNumber: 1, title: 'Diagnóstico Rápido', description: 'Mapeie sua situação atual.', actionItem: 'Preencher a folha de clareza.' },
            { stepNumber: 2, title: 'Execução do Passo 1', description: 'Aplique a primeira técnica recomendada.', actionItem: 'Executar tarefa de 15min.' },
          ],
          commonMistakes: [{ mistake: 'Ignorar o planejamento inicial', solution: 'Dedicar 10 min por dia ao mapa.' }],
          caseStudy: { title: 'Estudo de Caso #1', scenario: 'Resultado real em 7 dias.', result: 'Evolução consistente comprovada.' },
          checklists: [{ id: 'chk_1', item: 'Completar leitura do capítulo 1', explanation: 'Garante o alinhamento inicial.' }],
          summaryTable: { headers: ['Etapa', 'Foco'], rows: [['Fase 1', 'Bases'], ['Fase 2', 'Prática']] },
        },
        {
          id: 2,
          title: 'Módulo 2: Aplicação Prática no Dia a Dia',
          subtitle: 'Como Manter a Consistência Sem Sofrimento',
          objective: 'Criar rotina e manter o ritmo constante.',
          introduction: 'Agora que você conhece a base, vamos para a prática diária...',
          frameworkName: 'Método Aceleração',
          mentorCallouts: {
            tip: 'Mantenha o foco em 1 tarefa por vez.',
            warning: 'Cuidado com distrações no processo.',
            challenge: 'Complete a sequência de 3 dias sem falhar.',
          },
          stepByStep: [
            { stepNumber: 1, title: 'Organização do Tempo', description: 'Defina seu bloco de foco diário.', actionItem: 'Reservar 20 min.' },
          ],
          commonMistakes: [{ mistake: 'Tentar fazer tudo de uma vez', solution: 'Focar em metas pequenas.' }],
          caseStudy: { title: 'Estudo de Caso #2', scenario: 'Mapeamento de progresso acelerado.', result: 'Ganho de produtividade.' },
          checklists: [{ id: 'chk_2', item: 'Definir horário fixo diário', explanation: 'Mantém o hábito ativo.' }],
          summaryTable: { headers: ['Pilar', 'Meta'], rows: [['Consistência', 'Diária']] },
        },
      ],
      salesKit: {
        funnelCheckoutUrl: 'https://pay.kiwify.com.br/checkout-oficial',
        pricing: {
          mode: 'promo',
          fixedPrice: 'R$ 97,00',
          originalPrice: 'R$ 197,00',
          promoPrice: 'R$ 47,00',
          discountBadge: '76% DE DESCONTO',
          installmentsText: 'ou 12x de R$ 4,70 no cartão',
        },
        landingPageCopy: {
          headline: `Dominar ${formattedTitle} Nunca Foi Tão Simples e Direto!`,
          subheadline: 'Um método simples, direto ao ponto e desenvolvido para quem quer resultados reais no dia a dia por um valor promocional.',
          problemSection: [
            'Você já tentou diversas soluções mas se sentiu perdido com tanta teoria confusa?',
            'Não tem horas livres por dia e precisa de um plano que cabe na sua rotina real?',
            'Quer evitar os erros comuns que fazem a maioria desistir nos primeiros dias?',
          ],
          solutionSection: `O ${formattedTitle} foi desenvolvido exatamente para solucionar essa dor de forma simples, estruturada em módulos objetivos.`,
          methodHighlights: [
            'Acesso Imediato ao Material Didático Completo',
            'Passo a Passo Prático sem enrolação com Mentores Virtuais',
            'Vídeos Selecionados do YouTube & Fontes Oficiais de Referência',
            'Provas de Fixação Práticas & Certificado Oficial de Conclusão',
            'Garantia Incondicional de 7 Dias sem Risco',
          ],
          objectionHandling: [
            { objection: 'E se eu tiver pouco tempo?', answer: 'O conteúdo foi resumido em blocos curtos de 15 minutos por dia.' },
            { objection: 'Preciso ter experiência prévia?', answer: 'Não. O método ensina desde os fundamentos do zero até a prática.' },
          ],
          authorBio: 'Especialista com anos de experiência prática e centenas de alunos formados no mercado.',
          faq: [
            { question: 'Como recebo o acesso ao curso?', answer: 'Logo após a confirmação do pagamento, você receberá os dados de acesso no seu e-mail cadastrado.' },
            { question: 'Como funciona o Certificado?', answer: 'Ao obter no mínimo 60% de aprovação nos testes de fixação dos módulos, seu certificado é liberado automaticamente para emissão.' },
            { question: 'Quais são as formas de pagamento?', answer: 'PIX (liberação imediata), Cartão de Crédito ou Boleto Bancário.' },
          ],
          ctaText: `SIM! QUERO GARANTIR MEU ACESSO AGORA`,
        },
        whatsappSequence: [],
      },
    });
  }, [initialSlug, searchParams]);

  if (!product) return null;

  const checkoutUrl = product.salesKit.funnelCheckoutUrl || 'https://pay.kiwify.com.br/checkout-oficial';

  const pricing = product.salesKit.pricing || {
    mode: 'promo',
    fixedPrice: 'R$ 97,00',
    originalPrice: 'R$ 197,00',
    promoPrice: 'R$ 47,00',
    discountBadge: '76% DE DESCONTO',
    installmentsText: 'ou 12x de R$ 4,70 no cartão',
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen">
      {/* Top Banner de Lançamento */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 text-xs font-black py-2.5 text-center px-4 uppercase tracking-wider shadow-lg flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 animate-pulse" />
        <span>⚡ OFERTA EXCLUSIVA DE LANÇAMENTO • ACESSO IMEDIATO LIBERADO</span>
      </div>

      {/* Hero Header */}
      <header className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold rounded-full">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>MÉTODO EXCLUSIVO & PRÁTICO</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {product.salesKit.landingPageCopy.headline}
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {product.salesKit.landingPageCopy.subheadline}
        </p>

        {/* Product Cover Image Badge */}
        <div className="max-w-md mx-auto rounded-3xl overflow-hidden border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/10 group relative">
          <img
            src={product.coverImage}
            alt={product.methodName}
            className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="px-3 py-1 bg-slate-950/90 text-amber-300 border border-amber-500/40 text-xs font-extrabold rounded-full">
              🏆 Método {product.methodName}
            </span>
          </div>
        </div>

        {/* BLOCO DE PREÇO E OFERTA CHAMATIVA */}
        <div className="max-w-xl mx-auto my-8 bg-slate-900 border-2 border-emerald-500/50 p-6 sm:p-8 rounded-3xl space-y-6 text-center shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider">
            {pricing.mode === 'promo' ? (pricing.discountBadge || 'DESCONTO EXCLUSIVO') : 'OPORTUNIDADE ÚNICA'}
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 inline-block">
              {pricing.mode === 'promo' ? '⚡ OFERTA POR TEMPO LIMITADO' : '🏷️ VALOR DE INSCRIÇÃO'}
            </span>

            {pricing.mode === 'promo' ? (
              <div className="space-y-1 pt-2">
                <p className="text-sm text-slate-400 line-through font-semibold">De {pricing.originalPrice || 'R$ 197,00'}</p>
                <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                  <span>Por Apenas</span>
                  <span className="text-4xl sm:text-5xl">{pricing.promoPrice || 'R$ 47,00'}</span>
                </div>
                <p className="text-xs text-slate-300 font-bold pt-1">{pricing.installmentsText || 'ou 12x de R$ 4,70 no cartão'}</p>
              </div>
            ) : (
              <div className="space-y-1 pt-2">
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {pricing.fixedPrice || 'R$ 97,00'}
                </div>
                <p className="text-xs text-slate-300 font-bold pt-1">Acesso Vitalício + Todos os Bônus Inclusos</p>
              </div>
            )}
          </div>

          <div className="space-y-2 text-left bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-200">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Acesso Imediato aos {product.chapters.length} Módulos Práticos</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Mentores Virtuais & Vídeos do YouTube</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Provas Práticas de Fixação & Gabarito Oficial</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Certificado de Conclusão com Validação de CPF</span>
            </div>
          </div>

          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5 fill-current" />
            <span>{product.salesKit.landingPageCopy.ctaText}</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-semibold pt-1">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Compra 100% Segura</span>
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-indigo-400" /> Acesso Imediato</span>
          </div>
        </div>
      </header>

      {/* Seção Garantia Incondicional 7 Dias */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-800">
        <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-4xl shrink-0 shadow-lg shadow-indigo-500/10">
            🛡️
          </div>
          <div className="space-y-3 text-center md:text-left flex-1">
            <span className="text-[10px] font-extrabold uppercase px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              GARANTIA DE SATISFAÇÃO 100% RISCO ZERO
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              7 Dias de Garantia Incondicional
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Assista às aulas, baixe o material e teste o método na prática. Se dentro de 7 dias você achar que o conteúdo não é para você, basta enviar um único e-mail e devolveremos 100% do seu dinheiro investido. Sem perguntas e sem letras miúdas.
            </p>
          </div>
        </div>
      </section>

      {/* Modules Breakdown Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">Conteúdo Programático</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            O Que Você Vai Aprender em {product.chapters.length} Módulos Práticos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.chapters.map((ch) => (
            <div key={ch.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Módulo {ch.id}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{ch.frameworkName}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{ch.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ch.subtitle}</p>
              <div className="pt-2 text-[11px] text-indigo-300 font-medium">
                🎯 <strong>Objetivo:</strong> {ch.objective}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bônus Exclusivos Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">Incluso no Seu Acesso</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Bônus & Diferenciais Exclusivos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              🤖
            </div>
            <h4 className="text-xs font-bold text-white">Mentores Virtuais da IA</h4>
            <p className="text-[11px] text-slate-400">Dicas, alertas de erros e desafios em cada capítulo para acelerar seu aprendizado.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              📝
            </div>
            <h4 className="text-xs font-bold text-white">Provas & Gabarito Oficial</h4>
            <p className="text-[11px] text-slate-400">Avaliações interativas de fixação com gabarito comentado ao final de cada módulo.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              🏆
            </div>
            <h4 className="text-xs font-bold text-white">Certificado com Autenticação CPF</h4>
            <p className="text-[11px] text-slate-400">Emissão oficial de certificado de conclusão após atingir 60%+ de aprovação.</p>
          </div>
        </div>
      </section>

      {/* Method Highlights Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-extrabold text-white">Por Que Este Método Funciona?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.salesKit.landingPageCopy.methodHighlights.map((hl, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-200 font-semibold shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{hl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Objections & FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase text-indigo-400">Tire Suas Dúvidas</span>
          <h2 className="text-2xl font-extrabold text-white">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {product.salesKit.landingPageCopy.faq.map((f, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1.5 text-xs">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" /> {f.question}
              </h4>
              <p className="text-slate-400 pl-6">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="text-center py-16 border-t border-slate-800 bg-slate-900/60 space-y-6">
        <h3 className="text-2xl font-extrabold text-white">Pronto para Começar Hoje Mesmo?</h3>
        <div>
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-2xl hover:scale-105 transition-transform"
          >
            <ShoppingCart className="w-5 h-5 fill-current" />
            <span>GARANTIR MEU ACESSO AGORA</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
        <p className="text-xs text-slate-500">© 2026 {product.methodName} • Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
