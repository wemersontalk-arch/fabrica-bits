'use client';

import React, { useState, useEffect } from 'react';
import { GeneratedInfoproduct } from '@/types/infoproduct';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Globe,
  MessageCircle,
  ShoppingCart,
  Link as LinkIcon,
  ChevronDown,
  Phone,
  CheckCircle2,
  ExternalLink,
  Tag
} from 'lucide-react';
import { slugify } from '@/lib/slugify';

interface PromoCopySectionProps {
  product?: GeneratedInfoproduct;
}

export type LinkDestinationType = 'landing' | 'whatsapp' | 'checkout';

export interface CopyVariation {
  id: string;
  styleBadge: string;
  styleCategory: string;
  textPattern: (productName: string, niche: string, priceText: string, link: string) => string;
}

const COPY_STYLES_TEMPLATES: CopyVariation[] = [
  {
    id: 'direta',
    styleBadge: 'Direta',
    styleCategory: 'Oferta Clara & Objetivo',
    textPattern: (name, niche, price, link) =>
      `Quer evoluir no nicho de ${niche} sem abrir mão da sua rotina? O ${name} traz um método simples e prático que se encaixa no seu dia a dia. Por ${price}, você garante acesso completo ao passo a passo.\n\n[Acesse aqui](${link})`,
  },
  {
    id: 'storytelling',
    styleBadge: 'Storytelling',
    styleCategory: 'História Inspiradora',
    textPattern: (name, niche, price, link) =>
      `Depois de tentar de tudo no mercado de ${niche} e acumular frustrações, o divisor de águas foi descobrir uma estratégia validada. O ${name} foi desenhado exatamente para quem quer resultados reais sem sofrimento desnecessário por ${price}.\n\n[Acesse aqui](${link})`,
  },
  {
    id: 'pergunta',
    styleBadge: 'Pergunta',
    styleCategory: 'Gatilho de Identificação de Dor',
    textPattern: (name, niche, price, link) =>
      `Você já sentiu que está tentando progredir em ${niche}, mas nada parece funcionar de verdade na prática? E se existisse um método descomplicado e direto ao ponto? Conheça o ${name} por ${price} e veja a diferença no seu dia a dia.\n\n[Acesse aqui](${link})`,
  },
  {
    id: 'escassez',
    styleBadge: 'Escassez',
    styleCategory: 'Urgência & Vagas Limitadas',
    textPattern: (name, niche, price, link) =>
      `Atenção: as vagas com condição promocional exclusiva para o ${name} são limitadas e podem encerrar a qualquer momento. Por ${price}, você garante o método completo em ${niche}. Garanta o seu lugar enquanto o lote está aberto.\n\n[Acesse aqui](${link})`,
  },
  {
    id: 'prova_social',
    styleBadge: 'Prova Social',
    styleCategory: 'Resultados & Validação',
    textPattern: (name, niche, price, link) =>
      `Centenas de pessoas já estão aplicando o método do ${name} e transformando seus resultados em ${niche}. Não deixe para depois o que você pode começar hoje mesmo por ${price}. Veja o que estão dizendo e junte-se à comunidade.\n\n[Acesse aqui](${link})`,
  },
  {
    id: 'curiosidade',
    styleBadge: 'Curiosidade',
    styleCategory: 'O Segredo Revelado',
    textPattern: (name, niche, price, link) =>
      `Existe um segredo simples que os especialistas em ${niche} usam, mas quase ninguém revela para iniciantes. No ${name}, revelamos a estrutura exata para você aplicar rapidamente por ${price}.\n\n[Acesse aqui](${link})`,
  },
  {
    id: 'quebra_objecao',
    styleBadge: 'Quebra de Objeção',
    styleCategory: 'Sem Desculpas / Pouco Tempo',
    textPattern: (name, niche, price, link) =>
      `Acha que não tem tempo ou que ${niche} é difícil demais para você? O ${name} foi desenvolvido em módulos curtos e diretos, feitos para quem tem uma rotina corrida. Por ${price}, você consegue aplicar em 15 minutos por dia.\n\n[Acesse aqui](${link})`,
  },
  {
    id: 'whatsapp_conversacional',
    styleBadge: 'WhatsApp / Grupos',
    styleCategory: 'Mensagem Informal para Contatos',
    textPattern: (name, niche, price, link) =>
      `Fala pessoal! 🚀 Passando pra avisar que acabei de liberar o acesso promocional do ${name}. Pra quem quer dominar de verdade ${niche} por ${price}, vale super a pena dar uma olhada agora no link abaixo!\n\n[Acesse aqui](${link})`,
  },
  {
    id: 'beneficios',
    styleBadge: 'Lista de Benefícios',
    styleCategory: '3 Motivos para Garantir',
    textPattern: (name, niche, price, link) =>
      `3 razões para você garantir o ${name} hoje:\n1. Passo a passo simples em ${niche}.\n2. Aplicação prática sem enrolação.\n3. Acesso imediato por ${price}.\n\n[Acesse aqui](${link})`,
  },
  {
    id: 'cta_forte',
    styleBadge: 'Ação Imediata',
    styleCategory: 'Convite Direto com Preço Especial',
    textPattern: (name, niche, price, link) =>
      `Seu próximo nível em ${niche} começa agora. Clique no link, garanta seu acesso ao ${name} por ${price} e comece a ver resultados de verdade hoje mesmo!\n\n[Acesse aqui](${link})`,
  },
];

export const PromoCopySection: React.FC<PromoCopySectionProps> = ({ product: initialProduct }) => {
  // Lista de produtos disponíveis no localStorage
  const [productList, setProductList] = useState<GeneratedInfoproduct[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);

  // Carrega produtos do localStorage
  useEffect(() => {
    const list: GeneratedInfoproduct[] = [];

    if (initialProduct) {
      list.push(initialProduct);
    }

    try {
      const currentRaw = localStorage.getItem('infoproduct_current_product');
      if (currentRaw) {
        const parsed = JSON.parse(currentRaw);
        if (parsed && !list.some((p) => p.id === parsed.id)) {
          list.push(parsed);
        }
      }

      const historyRaw = localStorage.getItem('infoproduct_history');
      if (historyRaw) {
        const historyArr = JSON.parse(historyRaw);
        if (Array.isArray(historyArr)) {
          historyArr.forEach((hp) => {
            if (hp && hp.methodName && !list.some((p) => slugify(p.methodName) === slugify(hp.methodName))) {
              list.push(hp);
            }
          });
        }
      }
    } catch (e) {}

    // Fallback se não houver produtos salvos
    if (list.length === 0) {
      list.push({
        id: 'demo_1',
        methodName: 'Método Marmitas Congeladas Lucrativas',
        tagline: 'Aprenda a criar e vender refeições congeladas na prática',
        promise: 'Faça de 3k a 5k por mês na cozinha da sua casa',
        coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        targetAudienceProfile: 'Empreendedoras da gastronomia',
        createdAt: new Date().toLocaleDateString('pt-BR'),
        input: {
          niche: 'Gastronomia & Culinária',
          subniche: 'Marmitas Congeladas',
          targetAudience: 'Iniciantes',
          painPoints: 'Medo de comida aguada',
          hiddenDesires: 'Renda extra no lar',
          tone: 'pratico',
          format: 'ebook_guiado',
          moduleCount: 5,
          enableQuiz: true,
        },
        chapters: [],
        salesKit: {
          landingPageCopy: {
            headline: 'Dominar Marmitas Congeladas Lucrativas',
            subheadline: 'O método completo na prática',
            problemSection: [],
            solutionSection: '',
            methodHighlights: [],
            objectionHandling: [],
            authorBio: '',
            faq: [],
            ctaText: 'GARANTIR MINHA VAGA',
          },
          whatsappSequence: [],
        },
      });
    }

    setProductList(list);
  }, [initialProduct]);

  const currentProduct = productList[selectedProductIndex] || productList[0] || initialProduct;
  const productName = currentProduct?.methodName || 'Infoproduto Especialista';
  const productNiche = currentProduct?.input?.niche || currentProduct?.input?.subniche || 'Desenvolvimento Profissional';

  // Configuração de Preço da Copy (Preço Fixo vs Preço Promocional)
  const initialPricing = currentProduct?.salesKit?.pricing || {
    mode: 'promo',
    fixedPrice: 'R$ 97,00',
    originalPrice: 'R$ 197,00',
    promoPrice: 'R$ 47,00',
  };

  const [priceMode, setPriceMode] = useState<'fixed' | 'promo'>(initialPricing.mode || 'promo');
  const [fixedPrice, setFixedPrice] = useState<string>(initialPricing.fixedPrice || 'R$ 97,00');
  const [originalPrice, setOriginalPrice] = useState<string>(initialPricing.originalPrice || 'R$ 197,00');
  const [promoPrice, setPromoPrice] = useState<string>(initialPricing.promoPrice || 'R$ 47,00');

  // Calcula a string de preço a ser embutida nas copys
  const getFormattedPriceText = (): string => {
    if (priceMode === 'promo') {
      const orig = originalPrice.trim() || 'R$ 197,00';
      const promo = promoPrice.trim() || 'R$ 47,00';
      return `de ${orig} por apenas ${promo}`;
    } else {
      const fix = fixedPrice.trim() || 'R$ 97,00';
      return `apenas ${fix}`;
    }
  };

  const priceText = getFormattedPriceText();
  const slug = slugify(productName);

  // Tipo de Link de Destino
  const [linkType, setLinkType] = useState<LinkDestinationType>('landing');
  
  // Inputs de usuário para cada tipo de link
  const [landingInput, setLandingInput] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [checkoutInput, setCheckoutInput] = useState<string>('');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedCopies, setGeneratedCopies] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Calcula o link final de destino que deve ser embutido na copy
  const getFinalLinkToInsert = (): string => {
    if (linkType === 'landing') {
      if (landingInput.trim()) {
        let url = landingInput.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `https://${url}`;
        }
        return url;
      }
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fabrica.universobits.com.br';
      return `${origin}/vendas/${slug}`;
    }

    if (linkType === 'whatsapp') {
      const cleanDigits = phoneInput.replace(/\D/g, '');
      if (cleanDigits.length >= 8) {
        const fullPhone = cleanDigits.length <= 11 && !cleanDigits.startsWith('55') ? `55${cleanDigits}` : cleanDigits;
        return `https://wa.me/${fullPhone}?text=${encodeURIComponent(`Olá! Quero saber mais sobre o ${productName}`)}`;
      }
      return '[coloque aqui numero de telefone (whatsapp)]';
    }

    if (linkType === 'checkout') {
      if (checkoutInput.trim()) {
        let url = checkoutInput.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `https://${url}`;
        }
        return url;
      }
      return `https://pay.kiwify.com.br/${slug}-checkout`;
    }

    return 'https://suapagina.com.br';
  };

  const finalLink = getFinalLinkToInsert();

  // Função para gerar todas as variações
  const generateAllVariations = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newCopies: Record<string, string> = {};
      COPY_STYLES_TEMPLATES.forEach((tpl) => {
        newCopies[tpl.id] = tpl.textPattern(productName, productNiche, priceText, finalLink);
      });
      setGeneratedCopies(newCopies);
      setIsGenerating(false);
    }, 300);
  };

  useEffect(() => {
    generateAllVariations();
  }, [selectedProductIndex, linkType, landingInput, phoneInput, checkoutInput, productName, priceMode, fixedPrice, originalPrice, promoPrice]);

  const regenerateSingle = (styleId: string) => {
    const tpl = COPY_STYLES_TEMPLATES.find((t) => t.id === styleId);
    if (!tpl) return;

    const variationsSuffixes = [
      `\n\nGaranta sua vaga com condição exclusiva. [Acesse aqui](${finalLink})`,
      `\n\nAproveite o valor liberado hoje. [Acesse aqui](${finalLink})`,
      `\n\nClique para garantir seu acesso completo. [Acesse aqui](${finalLink})`,
    ];

    const randomSuffix = variationsSuffixes[Math.floor(Math.random() * variationsSuffixes.length)];
    const baseText = tpl.textPattern(productName, productNiche, priceText, finalLink);
    const updatedText = baseText.replace(`\n\n[Acesse aqui](${finalLink})`, randomSuffix);

    setGeneratedCopies((prev) => ({ ...prev, [styleId]: updatedText }));
  };

  const renderFormattedCopyText = (text: string, targetLink: string) => {
    const matchRegex = /(\[Acesse aqui\]\(.*?\)|Acesse:\s*https?:\/\/\S+)/g;
    const parts = text.split(matchRegex);

    return parts.map((part, idx) => {
      if (part.startsWith('[Acesse aqui]') || part.startsWith('Acesse:')) {
        return (
          <a
            key={idx}
            href={targetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline font-extrabold inline-flex items-center gap-1 ml-1"
          >
            <span>Acesse aqui</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      return part;
    });
  };

  const copyTextToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '');
    let formatted = raw;

    if (raw.length > 2 && raw.length <= 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    } else if (raw.length > 7 && raw.length <= 11) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    } else if (raw.length > 11) {
      formatted = `+${raw.slice(0, 2)} (${raw.slice(2, 4)}) ${raw.slice(4, 9)}-${raw.slice(9, 13)}`;
    }

    setPhoneInput(formatted);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Title & Subtitle */}
      <div className="space-y-2 border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Inteligência Artificial de Vendas • Redes Sociais & WhatsApp</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Gere 10 variações de copy promocional
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Escolha um produto gerado e configure o preço (Promocional ou Fixo). A IA gera 10 variações com gatilhos mentais adaptados, prontas para divulgar.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl backdrop-blur-md sticky top-20">
          {/* Seleção do Produto */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Produto Gerado
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer pr-10"
                value={selectedProductIndex}
                onChange={(e) => setSelectedProductIndex(Number(e.target.value))}
              >
                {productList.map((p, idx) => (
                  <option key={p.id || idx} value={idx}>
                    {p.methodName} ({p.input?.niche || p.input?.subniche || 'Infoproduto'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* CONFIGURAÇÃO DE PREÇO DA COPY (PREÇO FIXO OU PROMOÇÃO) */}
          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> Valor do Produto para a Copy
              </span>
            </div>

            {/* Alternador de Preço Fixo / Promoção */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-extrabold">
              <button
                type="button"
                onClick={() => setPriceMode('promo')}
                className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                  priceMode === 'promo'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Promocional (De / Por)
              </button>
              <button
                type="button"
                onClick={() => setPriceMode('fixed')}
                className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                  priceMode === 'fixed'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏷️ Preço Fixo
              </button>
            </div>

            {/* Campos de Input de Preço */}
            {priceMode === 'promo' ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Preço De:</label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="ex: R$ 197,00"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase">Preço Por:</label>
                  <input
                    type="text"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    placeholder="ex: R$ 47,00"
                    className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-emerald-300"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-bold text-indigo-400 uppercase">Preço Fixo do Produto:</label>
                <input
                  type="text"
                  value={fixedPrice}
                  onChange={(e) => setFixedPrice(e.target.value)}
                  placeholder="ex: R$ 97,00"
                  className="w-full bg-slate-900 border border-indigo-500/40 rounded-xl px-3 py-2 text-xs font-bold text-indigo-200"
                />
              </div>
            )}

            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              💡 <strong>Texto Inserido na Copy:</strong> <code className="text-emerald-300 font-bold">{priceText}</code>
            </div>
          </div>

          {/* Tipo de Link de Destino */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Tipo de Link de Destino
            </label>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setLinkType('landing')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                  linkType === 'landing'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>URL da Landing Page</span>
                </div>
                {linkType === 'landing' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                type="button"
                onClick={() => setLinkType('whatsapp')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                  linkType === 'whatsapp'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp (Link Direto)</span>
                </div>
                {linkType === 'whatsapp' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => setLinkType('checkout')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                  linkType === 'checkout'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <span>Link Direto do Checkout</span>
                </div>
                {linkType === 'checkout' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Campo de URL / WhatsApp de Destino Personalizado */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                {linkType === 'whatsapp' ? (
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                )}
                <span>URL Inserida na Copy</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Editável</span>
            </label>

            {linkType === 'landing' && (
              <input
                type="text"
                value={landingInput}
                onChange={(e) => setLandingInput(e.target.value)}
                placeholder="coloque aqui seu link ou url"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-indigo-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            )}

            {linkType === 'whatsapp' && (
              <div className="space-y-1">
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="coloque aqui numero de telefone (whatsapp)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-[10px] text-slate-400">
                  💡 Digite o número (ex: 11 99999-9999). A IA gera o link direto do WhatsApp automaticamente.
                </p>
              </div>
            )}

            {linkType === 'checkout' && (
              <input
                type="text"
                value={checkoutInput}
                onChange={(e) => setCheckoutInput(e.target.value)}
                placeholder="coloque aqui seu link de pagamento"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            )}
          </div>

          {/* Botão de Gerar variações */}
          <button
            type="button"
            onClick={generateAllVariations}
            disabled={isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Gerando 10 variações...' : 'Gerar variações com novo preço'}</span>
          </button>
        </div>

        {/* Right Output Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {COPY_STYLES_TEMPLATES.map((tpl) => {
            const currentCopyText = generatedCopies[tpl.id] || tpl.textPattern(productName, productNiche, priceText, finalLink);
            const isCopied = copiedId === tpl.id;

            return (
              <div
                key={tpl.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all shadow-lg backdrop-blur-sm group"
              >
                {/* Header Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-blue-600/20 text-blue-400 border border-blue-500/30 tracking-wider">
                      {tpl.styleBadge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {tpl.styleCategory}
                    </span>
                  </div>

                  {/* Copy Text Body */}
                  <div className="p-4 bg-slate-950/90 border border-slate-800/80 rounded-xl text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line min-h-[140px]">
                    {renderFormattedCopyText(currentCopyText, finalLink)}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => copyTextToClipboard(currentCopyText, tpl.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isCopied
                        ? 'bg-emerald-600 text-slate-950 border-emerald-500 font-black shadow-md'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => regenerateSingle(tpl.id)}
                    className="py-2 px-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Gerar semelhante</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
