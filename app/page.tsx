import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sparkles, ShieldCheck, Zap, Layers, CheckCircle2, ArrowRight, BookOpen, AlertOctagon } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold animate-fadeIn">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Chega de e-books rasos que parecem rascunhos de IA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Crie Infoprodutos <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Profundos, Acionáveis</span> e Prontos para Venda
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            O motor de IA SaaS que gera métodos nomeados, checklists práticos, estudos de caso e a copy completa de vendas em 3 etapas intuitivas.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/criar-produto"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              <span>Criar Meu Infoproduto Agora</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-indigo-400 font-bold text-sm flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Método Nomeado
              </span>
              <p className="text-xs text-slate-400">Frameworks próprios com nome marcante para autoridade imediata.</p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Checklists Práticos
              </span>
              <p className="text-xs text-slate-400">Cada capítulo traz tarefas verificáveis de execução rápida.</p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" /> Erros Comuníssimos
              </span>
              <p className="text-xs text-slate-400">Alertas destacados sobre falhas previsíveis no nicho.</p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-indigo-300 font-bold text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Kit de Vendas
              </span>
              <p className="text-xs text-slate-400">Copy de LP e sequência de WhatsApp prontos para rodar.</p>
            </div>
          </div>
        </section>

        {/* Competitor Comparison Section */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Por que a Fábrica Bits supera o ChatGPT genérico?</h2>
              <p className="text-slate-400 text-sm">Corrigimos as 3 maiores falhas dos concorrentes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-950/80 border border-red-500/20 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                  ❌ IAs Genéricas (ChatGPT / Claude puro)
                </h3>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li>• Respostas vagas sem "como fazer" no mundo real.</li>
                  <li>• Textos frios em blocos gigantes sem formatação visual.</li>
                  <li>• Produto final desconectado da oferta de vendas.</li>
                </ul>
              </div>

              <div className="p-6 bg-slate-950/80 border border-emerald-500/30 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  ✅ Fábrica Bits
                </h3>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li>• 3 Pipelines encadeados com frameworks e estudos de caso.</li>
                  <li>• Formatação rica com callouts, tabelas e checklists.</li>
                  <li>• Kit de Vendas integrado (Copy LP + WhatsApp).</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Fábrica Bits © 2026 • É um sistema da UniversoBits.com.br
      </footer>
    </div>
  );
}
