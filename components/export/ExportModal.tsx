import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GeneratedInfoproduct } from '@/types/infoproduct';
import { X, Printer, FileCheck } from 'lucide-react';

interface ExportModalProps {
  product: GeneratedInfoproduct;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ product, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  if (!mounted) return null;

  const modalJSX = (
    <div className="fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 no-print animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-100">Exportar E-book em PDF ({product.chapters.length} Módulos)</h3>
              <p className="text-xs text-slate-400">Layout Diagramado A4 para Impressão e Leitura Digital</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PDF Option Card */}
        <div className="space-y-4">
          <div
            onClick={handlePrintPDF}
            className="cursor-pointer p-6 bg-gradient-to-br from-slate-950 to-emerald-950/30 border-2 border-emerald-500/40 hover:border-emerald-400 rounded-2xl transition-all space-y-4 group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                <Printer className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                RECOMENDADO
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                Gerar PDF Diagramado em A4
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Abre a janela oficial de impressão/download contendo:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-2 list-disc pl-4">
                <li>Capa Editorial Ilustrada A4</li>
                <li>Sumário Executivo Completo ({product.chapters.length} Módulos)</li>
                <li>Conteúdo Didático na Íntegra (sem cortes)</li>
                <li>Dicas do Mentor Virtual, Passos e Checklists</li>
                <li>Provas de Fixação e Gabarito Oficial de Respostas</li>
              </ul>
            </div>

            <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar como PDF Agora</span>
            </button>
          </div>
        </div>

        {/* Info Note */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2 text-[11px] text-slate-400">
          <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Dica: Na caixa do navegador, selecione <strong>"Salvar como PDF"</strong> e marque <strong>"Gráficos de segundo plano"</strong> para preservar cores e imagens.</span>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 text-center"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};
