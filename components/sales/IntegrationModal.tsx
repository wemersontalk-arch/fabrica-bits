import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { GeneratedInfoproduct } from '@/types/infoproduct';
import { X, Globe, Download, Link as LinkIcon, Check, Copy, Zap, ShieldCheck, FileSpreadsheet } from 'lucide-react';

interface IntegrationModalProps {
  product: GeneratedInfoproduct;
  onClose: () => void;
  onSaveCheckoutUrl: (url: string) => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({
  product,
  onClose,
  onSaveCheckoutUrl,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'kiwify' | 'hotmart' | 'eduzz'>('kiwify');
  const [checkoutUrl, setCheckoutUrl] = useState(product.salesKit.funnelCheckoutUrl || '');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const webhookUrl = `https://api.infoproductengine.ai/v1/webhooks/${selectedPlatform}?prod_id=${product.id}`;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCheckoutUrl(checkoutUrl.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const downloadJSONPackage = () => {
    const data = {
      courseName: product.methodName,
      tagline: product.tagline,
      totalModules: product.chapters.length,
      checkoutUrl: checkoutUrl,
      modules: product.chapters.map((ch) => ({
        moduleNumber: ch.id,
        title: ch.title,
        subtitle: ch.subtitle,
        framework: ch.frameworkName,
        objective: ch.objective,
        fullLessonText: ch.fullLessonContent,
        youtubeVideos: ch.youtubeVideos,
        externalLinks: ch.externalLinks,
        quiz: ch.quiz,
      })),
      gabarito: product.gabarito,
      salesKit: product.salesKit,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pacote_curso_${selectedPlatform}_${product.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSVPackage = () => {
    let csv = `Numero do Modulo;Titulo do Modulo;Framework;Objetivo;Link Youtube\n`;
    product.chapters.forEach((ch) => {
      const ytUrl = ch.youtubeVideos?.[0]?.url || '';
      csv += `"${ch.id}";"${ch.title.replace(/"/g, '""')}";"${ch.frameworkName}";"${ch.objective.replace(/"/g, '""')}";"${ytUrl}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planilha_aulas_${selectedPlatform}_${product.id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const modalJSX = (
    <div className="fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 no-print animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Central de Integração & Checkout (Hotmart, Kiwify & Eduzz)</h3>
              <p className="text-xs text-slate-400">Conecte o checkout e exporte a estrutura para a área de membros</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selection Tabs */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">1. Selecione a Plataforma de Vendas</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'kiwify', name: 'Kiwify', color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300' },
              { id: 'hotmart', name: 'Hotmart', color: 'border-orange-500 bg-orange-950/40 text-orange-300' },
              { id: 'eduzz', name: 'Eduzz (Nutror)', color: 'border-blue-500 bg-blue-950/40 text-blue-300' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id as any)}
                className={`p-3.5 rounded-xl border text-center font-extrabold text-xs transition-all ${
                  selectedPlatform === p.id ? p.color : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Checkout Link Form */}
        <form onSubmit={handleSaveUrl} className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-emerald-400" />
            <span>Link de Checkout Oficial da {selectedPlatform.toUpperCase()}</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={checkoutUrl}
              onChange={(e) => setCheckoutUrl(e.target.value)}
              placeholder={`Ex: https://pay.${selectedPlatform}.com.br/seu-produto`}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-transform hover:scale-105"
            >
              {isSaved ? 'Salvo! ✅' : 'Salvar Link'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Este link será automaticamente atribuído a todos os botões de CTA da sua Landing Page.
          </p>
        </form>

        {/* Export Package for Member Area */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-400" /> 2. Exportar Estrutura do Curso ({product.chapters.length} Módulos)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={downloadJSONPackage}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left space-y-2 group transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100 group-hover:text-indigo-300">Pacote Completo (.JSON)</span>
                <Download className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                Baixe o arquivo estruturado com textos didáticos completos, vídeos e quizzes para importação via API.
              </p>
            </button>

            <button
              onClick={downloadCSVPackage}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left space-y-2 group transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100 group-hover:text-emerald-300">Planilha de Aulas (.CSV)</span>
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                Planilha pré-formatada para upload em lote de títulos, vídeos e objetivos no Nutror/Hotmart Club.
              </p>
            </button>
          </div>
        </div>

        {/* Webhook API Synchronization */}
        <div className="space-y-3 p-4 bg-slate-950/80 border border-indigo-500/20 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> URL de Webhook para Liberação Automática
            </span>
            <button
              onClick={() => copyToClipboard(webhookUrl, 'webhook')}
              className="text-xs text-indigo-400 hover:text-indigo-200 font-bold flex items-center gap-1"
            >
              {copiedItem === 'webhook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedItem === 'webhook' ? 'Copiado!' : 'Copiar URL'}</span>
            </button>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-slate-300 font-mono overflow-x-auto border border-slate-800">
            {webhookUrl}
          </div>
          <p className="text-[11px] text-slate-400">
            Cadastre este Webhook nas configurações da {selectedPlatform.toUpperCase()} para liberar o certificado do aluno automaticamente após a aprovação da compra.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end border-t border-slate-800">
          <button onClick={onClose} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl">
            Concluído
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};
