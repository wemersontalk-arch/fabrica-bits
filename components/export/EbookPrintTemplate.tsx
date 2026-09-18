import React from 'react';
import { GeneratedInfoproduct } from '@/types/infoproduct';

interface EbookPrintTemplateProps {
  product: GeneratedInfoproduct;
}

export const EbookPrintTemplate: React.FC<EbookPrintTemplateProps> = ({ product }) => {
  return (
    <div className="bg-white text-slate-900 font-sans leading-relaxed p-0 m-0">
      {/* 1. CAPA EDITORIAL A4 */}
      <div className="capitulo-modulo min-h-[98vh] flex flex-col justify-between p-12 border-8 border-slate-900 bg-gradient-to-b from-slate-50 to-indigo-50/30 rounded-3xl relative overflow-hidden">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-300 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow">
              FB
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-700">
              FÁBRICA BITS • EDIÇÃO DE IMPRESSÃO A4
            </span>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200 uppercase">
            {product.input.format.replace('_', ' ')} • {product.chapters.length} MÓDULOS
          </span>
        </div>

        {/* Cover Content */}
        <div className="my-auto space-y-6 text-center max-w-3xl mx-auto">
          {product.coverImage && (
            <div className="mx-auto w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white mb-6">
              <img src={product.coverImage} alt={product.methodName} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="inline-block px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow">
            MANUAL PRÁTICO DEFINITIVO
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {product.methodName}
          </h1>

          <p className="text-xl font-medium text-slate-600 italic">
            "{product.tagline}"
          </p>

          <div className="p-6 bg-white border-2 border-indigo-200 rounded-2xl shadow-lg max-w-2xl mx-auto text-left space-y-2">
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">🎯 PROMESSA CENTRAL DO CURSO:</span>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {product.promise}
            </p>
          </div>
        </div>

        {/* Cover Footer */}
        <div className="border-t border-slate-300 pt-6 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            <span>Público-Alvo: <strong>{product.input.targetAudience}</strong></span>
          </div>
          <div>
            <span>Autor/Especialista: <strong>{product.input.authorName || 'Especialista Fábrica Bits'}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. SUMÁRIO EXECUTIVO (TABLE OF CONTENTS) */}
      <div className="capitulo-modulo p-8 space-y-8">
        <div className="border-b-2 border-indigo-600 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">📚 SUMÁRIO EXECUTIVO</h2>
            <p className="text-xs text-slate-500 mt-1">Índice Geral de Módulos e Estrutura Didática do Infoproduto</p>
          </div>
          <span className="text-xs font-bold text-slate-400">Total: {product.chapters.length} Capítulos</span>
        </div>

        <div className="space-y-4">
          {product.chapters.map((ch) => (
            <div
              key={ch.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4 card-evitar-quebra"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow flex-shrink-0">
                  {ch.id}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Módulo {ch.id}: {ch.title}</h3>
                  <p className="text-xs text-slate-600 italic">{ch.subtitle}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Framework: {ch.frameworkName}
                  </span>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs font-semibold text-slate-500">{ch.stepByStep.length} Etapas Operacionais</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CAPÍTULOS / MÓDULOS (100% DO CONTEÚDO DEDICADO) */}
      {product.chapters.map((ch) => (
        <div key={ch.id} className="capitulo-modulo p-8 space-y-8">
          {/* Top Chapter Header */}
          <div className="border-b-4 border-indigo-600 pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-md">
                MÓDULO {ch.id} DE {product.chapters.length}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                FRAMEWORK: {ch.frameworkName}
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{ch.title}</h2>
            <p className="text-sm font-medium text-slate-600 italic">"{ch.subtitle}"</p>
          </div>

          {/* Objective Box */}
          <div className="p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded-r-xl card-evitar-quebra">
            <span className="text-xs font-black text-indigo-900 uppercase">🎯 OBJETIVO PRÁTICO DO MÓDULO:</span>
            <p className="text-xs font-semibold text-indigo-950 mt-1">{ch.objective}</p>
          </div>

          {/* Unsplash Chapter Image */}
          {ch.imageUrl && (
            <div className="space-y-2 card-evitar-quebra">
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-300 shadow">
                <img src={ch.imageUrl} alt={ch.title} className="w-full h-full object-cover" />
              </div>
              {ch.imageCaption && (
                <p className="text-[11px] text-center text-slate-500 italic">📷 {ch.imageCaption}</p>
              )}
            </div>
          )}

          {/* Full Lesson Content */}
          {ch.fullLessonContent && (
            <div className="space-y-6 pt-2">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  📖 MATERIAL DIDÁTICO COMPLETO DA AULA
                </h3>
              </div>

              {/* 01. Visão Geral */}
              <div className="space-y-2 card-evitar-quebra">
                <h4 className="text-xs font-bold uppercase text-indigo-700 tracking-wider border-l-2 border-indigo-600 pl-2">
                  01. Visão Geral & Desafios da Aula
                </h4>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {ch.fullLessonContent.introduction}
                </div>
              </div>

              {/* 02. Fundamentos Teóricos */}
              <div className="space-y-2 card-evitar-quebra">
                <h4 className="text-xs font-bold uppercase text-emerald-700 tracking-wider border-l-2 border-emerald-600 pl-2">
                  02. Fundamentos Teóricos & Conceitos-Chave
                </h4>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-emerald-50/40 p-4 rounded-xl border border-emerald-200">
                  {ch.fullLessonContent.coreTheory}
                </div>
              </div>

              {/* 03. Guia de Aplicação Prática */}
              <div className="space-y-2 card-evitar-quebra">
                <h4 className="text-xs font-bold uppercase text-amber-700 tracking-wider border-l-2 border-amber-600 pl-2">
                  03. Guia de Aplicação Prática no Dia a Dia
                </h4>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                  {ch.fullLessonContent.practicalExecution}
                </div>
              </div>

              {/* 04. Segredos do Especialista */}
              <div className="space-y-2 card-evitar-quebra">
                <h4 className="text-xs font-bold uppercase text-purple-700 tracking-wider border-l-2 border-purple-600 pl-2">
                  04. Segredos do Especialista & Alertas Finais
                </h4>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-purple-50/40 p-4 rounded-xl border border-purple-200">
                  {ch.fullLessonContent.proTips}
                </div>
              </div>
            </div>
          )}

          {/* Virtual Mentor Callouts */}
          <div className="space-y-3 p-5 bg-slate-900 text-white rounded-2xl card-evitar-quebra">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-300">
              <span>🤖 ORIENTAÇÕES DO MENTOR VIRTUAL DA IA</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-indigo-500/30 text-indigo-200">
                💡 <strong>Dica de Ouro:</strong> {ch.mentorCallouts.tip}
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-amber-500/30 text-amber-200">
                ⚠️ <strong>Atenção Crucial:</strong> {ch.mentorCallouts.warning}
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-emerald-500/30 text-emerald-200">
                🚀 <strong>Desafio do Módulo:</strong> {ch.mentorCallouts.challenge}
              </div>
            </div>
          </div>

          {/* Step by Step Execution */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              ⚡ PASSO A PASSO OPERACIONAL
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ch.stepByStep.map((st) => (
                <div
                  key={st.stepNumber}
                  className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2 card-evitar-quebra"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                      {st.stepNumber}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.description}</p>
                  <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                    🎯 <strong>Ação Direta:</strong> {st.actionItem}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="p-5 bg-red-50 border border-red-200 rounded-2xl space-y-3 card-evitar-quebra">
            <h4 className="text-xs font-black uppercase text-red-800 flex items-center gap-1.5">
              <span>⚠️ ALERTA DE ERROS COMUNÍSSIMOS</span>
            </h4>
            <div className="space-y-2 text-xs">
              {ch.commonMistakes.map((m, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-red-200 space-y-1">
                  <p className="font-bold text-red-700">❌ Erro Comum: {m.mistake}</p>
                  <p className="font-semibold text-emerald-700">✅ Como Evitar / Solução: {m.solution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 pt-2 card-evitar-quebra">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              ✅ CHECKLIST DE VERIFICAÇÃO ACELERADA
            </h3>
            <div className="space-y-2">
              {ch.checklists.map((chk) => (
                <div key={chk.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-4 h-4 border-2 border-slate-400 rounded bg-white mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{chk.item}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{chk.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz */}
          {product.input.enableQuiz && ch.quiz && ch.quiz.length > 0 && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 card-evitar-quebra">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-sm font-black uppercase text-emerald-400">📝 AVALIAÇÃO PRÁTICA DO MÓDULO {ch.id}</h4>
                <p className="text-xs text-slate-400">Teste seus conhecimentos antes de avançar</p>
              </div>

              <div className="space-y-4 text-xs">
                {ch.quiz.map((q, qIdx) => (
                  <div key={q.id} className="space-y-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <p className="font-bold text-slate-100">
                      Questão {qIdx + 1}: {q.question}
                    </p>
                    <div className="space-y-1.5 pl-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2 text-slate-300">
                          <span className="w-4 h-4 rounded-full border border-slate-500 text-[10px] flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* 4. GABARITO OFICIAL DE RESPOSTAS (OFFICIAL ANSWER KEY) */}
      {product.gabarito && product.gabarito.length > 0 && (
        <div className="capitulo-modulo p-8 space-y-8">
          <div className="border-b-4 border-emerald-600 pb-4">
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">📝 GABARITO OFICIAL DE RESPOSTAS</h2>
            <p className="text-xs text-slate-500 mt-1">Gabarito com Explicações Detalhadas de Todas as Provas do Curso</p>
          </div>

          <div className="space-y-6">
            {product.gabarito.map((g) => (
              <div key={g.chapterNumber} className="p-6 bg-slate-50 border border-slate-300 rounded-2xl space-y-4 card-evitar-quebra">
                <h3 className="text-sm font-black text-indigo-900 uppercase">
                  MÓDULO {g.chapterNumber}: {g.chapterTitle}
                </h3>

                <div className="space-y-3 text-xs">
                  {g.answers.map((ans) => (
                    <div key={ans.questionNumber} className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Questão {ans.questionNumber}: {ans.question}</span>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[11px]">
                          Correta: {ans.correctOption}
                        </span>
                      </div>
                      <p className="text-slate-600 italic text-[11px] pt-1">
                        💡 <strong>Explicação Oficial:</strong> {ans.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
