import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GeneratedInfoproduct, PricingConfig } from '@/types/infoproduct';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  ShoppingCart,
  Clock,
  ArrowRight,
  Globe,
  Tag,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { slugify } from '@/lib/slugify';

interface FunnelPreviewModalProps {
  product: GeneratedInfoproduct;
  onClose: () => void;
}

export const FunnelPreviewModal: React.FC<FunnelPreviewModalProps> = ({ product, onClose }) => {
  const [checkoutUrl, setCheckoutUrl] = useState<string>(product.salesKit.funnelCheckoutUrl || '');

  // Pricing State
  const initialPricing = product.salesKit.pricing || {
    mode: 'promo',
    fixedPrice: 'R$ 97,00',
    originalPrice: 'R$ 197,00',
    promoPrice: 'R$ 47,00',
    discountBadge: '76% DE DESCONTO',
    installmentsText: 'ou 12x de R$ 4,70 no cartão',
  };

  const [priceMode, setPriceMode] = useState<'fixed' | 'promo'>(initialPricing.mode || 'promo');
  const [fixedPrice, setFixedPrice] = useState<string>(initialPricing.fixedPrice || 'R$ 97,00');
  const [originalPrice, setOriginalPrice] = useState<string>(initialPricing.originalPrice || 'R$ 197,00');
  const [promoPrice, setPromoPrice] = useState<string>(initialPricing.promoPrice || 'R$ 47,00');
  const [installmentsText, setInstallmentsText] = useState<string>(
    initialPricing.installmentsText || 'ou 12x de R$ 4,70 no cartão'
  );

  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [copiedRouteUrl, setCopiedRouteUrl] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  const slug = slugify(product.methodName);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fabrica.universobits.com.br';
  const liveSalesRouteUrl = `${origin}/vendas/${slug}`;

  // Persist edits to product in localStorage
  useEffect(() => {
    setMounted(true);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Update product salesKit whenever inputs change
  useEffect(() => {
    const updatedPricing: PricingConfig = {
      mode: priceMode,
      fixedPrice,
      originalPrice,
      promoPrice,
      installmentsText,
      discountBadge: priceMode === 'promo' ? 'DESCONTO EXCLUSIVO' : undefined,
    };

    product.salesKit.funnelCheckoutUrl = checkoutUrl;
    product.salesKit.pricing = updatedPricing;

    // Save to localStorage
    try {
      localStorage.setItem('infoproduct_current_product', JSON.stringify(product));
      localStorage.setItem(`infoproduct_slug_${slug}`, JSON.stringify(product));

      const historyRaw = localStorage.getItem('infoproduct_history');
      let historyArr: GeneratedInfoproduct[] = historyRaw ? JSON.parse(historyRaw) : [];
      if (!Array.isArray(historyArr)) historyArr = [];
      const idx = historyArr.findIndex((p) => p && p.methodName && slugify(p.methodName) === slug);
      if (idx >= 0) {
        historyArr[idx] = product;
      } else {
        historyArr.unshift(product);
      }
      localStorage.setItem('infoproduct_history', JSON.stringify(historyArr));
    } catch (e) {
      console.error('Error saving updated product to localStorage:', e);
    }
  }, [checkoutUrl, priceMode, fixedPrice, originalPrice, promoPrice, installmentsText, product, slug]);

  const finalUrl = checkoutUrl.trim() || '#';

  const generateFunnelHTML = (): string => {
    const isPromo = priceMode === 'promo';
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${product.salesKit.landingPageCopy.headline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen">
  <div class="bg-emerald-500 text-slate-950 text-xs font-bold py-2 text-center px-4 uppercase tracking-wider">
    ⚡ OFERTA EXCLUSIVA DE LANÇAMENTO • ACESSO IMEDIATO LIBERADO
  </div>

  <header class="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
    <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
      ${product.salesKit.landingPageCopy.headline}
    </h1>
    <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
      ${product.salesKit.landingPageCopy.subheadline}
    </p>

    <div class="max-w-md mx-auto my-6 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <img src="${product.coverImage}" alt="Capa do Produto" class="w-full h-auto object-cover">
    </div>

    <!-- CARD DE OFERTA E PREÇO -->
    <div class="max-w-lg mx-auto bg-slate-900 border-2 border-emerald-500/40 p-6 rounded-2xl space-y-4 text-center">
      ${
        isPromo
          ? `<span class="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">OFERTA POR TEMPO LIMITADO</span>
             <div class="space-y-1">
               <p class="text-xs text-slate-400 line-through">De ${originalPrice}</p>
               <p class="text-3xl font-black text-emerald-400">Por Apenas ${promoPrice}</p>
               <p class="text-xs text-slate-300 font-medium">${installmentsText}</p>
             </div>`
          : `<span class="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">VALOR DE INSCRIÇÃO</span>
             <div class="space-y-1">
               <p class="text-3xl font-black text-white">Apenas ${fixedPrice}</p>
               <p class="text-xs text-slate-300">Acesso Vitalício ao Conteúdo + Certificado</p>
             </div>`
      }

      <a href="${finalUrl}" target="_blank" rel="noopener noreferrer" class="block w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
        🛒 ${product.salesKit.landingPageCopy.ctaText}
      </a>
    </div>
  </header>

  <footer class="text-center py-12 border-t border-slate-800 bg-slate-900/50">
    <p class="text-xs text-slate-500">© 2026 ${product.methodName} • Todos os direitos reservados.</p>
  </footer>
</body>
</html>`;
  };

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(generateFunnelHTML());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyRouteUrl = () => {
    navigator.clipboard.writeText(liveSalesRouteUrl);
    setCopiedRouteUrl(true);
    setTimeout(() => setCopiedRouteUrl(false), 2000);
  };

  if (!mounted) return null;

  const modalJSX = (
    <div className="fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 no-print animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">Construtor de Landing Page & Rota de Vendas</h3>
              <p className="text-xs text-slate-400">Configure o modelo de preço e acesse a Rota de Vendas oficial do seu curso</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Live Route Banner (Rota de Vendas Oficial) */}
        <div className="p-4 bg-indigo-950/40 border-b border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase text-indigo-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> URL Oficial da Página do Curso (Rota de Vendas)
            </span>
            <code className="text-indigo-200 font-mono text-xs block">{liveSalesRouteUrl}</code>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRouteUrl}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 rounded-lg font-bold flex items-center gap-1 transition-all"
            >
              {copiedRouteUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRouteUrl ? 'Copiado!' : 'Copiar Link'}</span>
            </button>

            <a
              href={liveSalesRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-1 transition-all shadow hover:scale-105"
            >
              <span>Abrir Rota de Vendas</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Pricing & Checkout Controls Bar */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 space-y-4">
          {/* Row 1: Checkout Link */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase">
              <ShoppingCart className="w-3.5 h-3.5" /> Link de Checkout / Página de Pagamento (Hotmart / Kiwify / Eduzz)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={checkoutUrl}
                onChange={(e) => setCheckoutUrl(e.target.value)}
                placeholder="coloque seu link de pagamento aqui"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleCopyHTML}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-slate-950 rounded-xl transition-all shadow"
              >
                {copiedHtml ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedHtml ? 'HTML Copiado!' : 'Copiar Código HTML'}</span>
              </button>
            </div>
          </div>

          {/* Row 2: Pricing Options Switcher */}
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" /> Escolha o Modelo de Oferta e Preço na Rota de Vendas:
              </span>
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPriceMode('promo')}
                  className={`px-3 py-1 text-[11px] font-extrabold rounded-md transition-all ${
                    priceMode === 'promo' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Preço Promocional (De / Por)
                </button>
                <button
                  onClick={() => setPriceMode('fixed')}
                  className={`px-3 py-1 text-[11px] font-extrabold rounded-md transition-all ${
                    priceMode === 'fixed' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏷️ Preço Fixo
                </button>
              </div>
            </div>

            {/* Inputs based on pricing mode */}
            {priceMode === 'promo' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Preço Original (De:)</label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="ex: R$ 197,00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 uppercase">Preço Com Desconto (Por:)</label>
                  <input
                    type="text"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    placeholder="ex: R$ 47,00"
                    className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Texto do Parcelamento</label>
                  <input
                    type="text"
                    value={installmentsText}
                    onChange={(e) => setInstallmentsText(e.target.value)}
                    placeholder="ex: ou 12x de R$ 4,70"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-indigo-400 uppercase">Preço Único Fixo (Valor Total)</label>
                  <input
                    type="text"
                    value={fixedPrice}
                    onChange={(e) => setFixedPrice(e.target.value)}
                    placeholder="ex: R$ 97,00"
                    className="w-full bg-slate-950 border border-indigo-500/40 rounded-lg px-3 py-1.5 text-xs text-indigo-200 font-bold"
                  />
                </div>
                <div className="space-y-1 flex flex-col justify-end text-[11px] text-slate-400">
                  <p>Apresenta um valor direto sem comparativo de desconto.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-950">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-medium">
            <span>👁️ <strong>Pré-visualização da Rota de Vendas:</strong> Botões apontam para: <code className="text-white underline">{finalUrl === '#' ? 'coloque seu link de pagamento aqui' : finalUrl}</code></span>
            {finalUrl !== '#' && (
              <a href={finalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-emerald-400 font-bold">
                <span>Testar Link</span> <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center max-w-3xl mx-auto shadow-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
              <Clock className="w-3.5 h-3.5" /> OFERTA POR TEMPO LIMITADO
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              {product.salesKit.landingPageCopy.headline}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
              {product.salesKit.landingPageCopy.subheadline}
            </p>

            <div className="max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-800 shadow-xl">
              <img src={product.coverImage} alt="Capa" className="w-full h-48 object-cover" />
            </div>

            {/* LIVE OFFER CARD PREVIEW */}
            <div className="max-w-md mx-auto bg-slate-950 border-2 border-emerald-500/40 p-5 rounded-2xl space-y-3 text-center shadow-xl">
              {priceMode === 'promo' ? (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    OFERTA AGRESSIVA COM DESCONTO
                  </span>
                  <div className="pt-2">
                    <p className="text-xs text-slate-400 line-through">De {originalPrice}</p>
                    <p className="text-3xl font-black text-emerald-400">Por Apenas {promoPrice}</p>
                    <p className="text-xs text-slate-300 font-medium">{installmentsText}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                    VALOR ÚNICO FIXO
                  </span>
                  <div className="pt-2">
                    <p className="text-3xl font-black text-white">Por Apenas {fixedPrice}</p>
                    <p className="text-xs text-slate-300">Acesso Vitalício + Todos os Bônus</p>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <a
                  href={finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg hover:scale-105 transition-transform"
                >
                  <span>{product.salesKit.landingPageCopy.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {product.salesKit.landingPageCopy.methodHighlights.map((hl, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            As alterações de preço são salvas automaticamente na Rota de Vendas.
          </span>
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl">
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};
