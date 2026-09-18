import React, { useState, useEffect } from 'react';
import { InfoproductInput, ToneOfVoice, ProductFormat } from '@/types/infoproduct';
import { HIGH_DEMAND_NICHES, getAutoPainAndDesires } from '@/lib/generate-engine';
import { Target, Zap, BookOpen, Sparkles, MessageSquare, ShieldAlert, CheckCircle2, Layers, Award, Wand2, UserCheck } from 'lucide-react';

interface StepDiagnosisProps {
  onSubmit: (data: InfoproductInput) => void;
}

export const StepDiagnosis: React.FC<StepDiagnosisProps> = ({ onSubmit }) => {
  const defaultNicheObj = HIGH_DEMAND_NICHES[0];

  const [formData, setFormData] = useState<InfoproductInput>(() => {
    const autoPains = getAutoPainAndDesires(defaultNicheObj.niche, defaultNicheObj.subniches[0]);
    return {
      niche: defaultNicheObj.niche,
      subniche: defaultNicheObj.subniches[0],
      targetAudience: 'Mulheres e homens que buscam independência financeira ou aperfeiçoamento profissional',
      painPoints: autoPains.painPoints,
      hiddenDesires: autoPains.hiddenDesires,
      tone: 'pratico',
      format: 'manual_passo_a_passo',
      authorName: '',
      moduleCount: 10,
      enableQuiz: true,
    };
  });

  // Atualizar subnichos ao mudar o nicho
  const selectedNicheObj = HIGH_DEMAND_NICHES.find(n => n.niche === formData.niche) || HIGH_DEMAND_NICHES[0];

  const handleNicheChange = (newNiche: string) => {
    const newNicheObj = HIGH_DEMAND_NICHES.find(n => n.niche === newNiche) || HIGH_DEMAND_NICHES[0];
    const newSubniche = newNicheObj.subniches[0];
    const autoPains = getAutoPainAndDesires(newNiche, newSubniche);

    setFormData(prev => ({
      ...prev,
      niche: newNiche,
      subniche: newSubniche,
      painPoints: autoPains.painPoints,
      hiddenDesires: autoPains.hiddenDesires,
    }));
  };

  const handleSubnicheChange = (newSubniche: string) => {
    const autoPains = getAutoPainAndDesires(formData.niche, newSubniche);
    setFormData(prev => ({
      ...prev,
      subniche: newSubniche,
      painPoints: autoPains.painPoints,
      hiddenDesires: autoPains.hiddenDesires,
    }));
  };

  const handleAutoFillPains = () => {
    const autoPains = getAutoPainAndDesires(formData.niche, formData.subniche);
    setFormData(prev => ({
      ...prev,
      painPoints: autoPains.painPoints,
      hiddenDesires: autoPains.hiddenDesires,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName || !formData.authorName.trim()) {
      alert('Por favor, informe o Nome do Autor / Especialista.');
      return;
    }
    onSubmit(formData);
  };

  const tones: { id: ToneOfVoice; label: string; desc: string; icon: string }[] = [
    { id: 'pratico', label: 'Prático / Direto', desc: 'Foco total em ação sem rodeios ou teorias desnecessárias', icon: '⚡' },
    { id: 'academico', label: 'Acadêmico / Técnico', desc: 'Linguagem formal com alta densidade técnica e referências', icon: '🎓' },
    { id: 'empatico', label: 'Empático / Inspiracional', desc: 'Conexão emocional, acolhimento e incentivo pessoal', icon: '💚' },
    { id: 'provocativo', label: 'Provocativo / Hardcore', desc: 'Tom desafiador, quebra de crenças e choque de realidade', icon: '🔥' },
  ];

  const formats: { id: ProductFormat; label: string; desc: string }[] = [
    { id: 'manual_passo_a_passo', label: 'Manual Passo a Passo', desc: 'Guia definitivo com frameworks nomeados e procedimentos' },
    { id: 'apostila_pratica', label: 'Apostila Prática com Checklists', desc: 'Material operacional focado em tarefas executáveis rápidas' },
    { id: 'ebook_guiado', label: 'E-book Guiado de Alta Profundidade', desc: 'Livro digital completo com fundamentação e estudos de caso' },
    { id: 'roteiro_curso', label: 'Roteiro de Curso em Vídeo', desc: 'Scripts detalhados para aulas e exercícios para alunos' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Etapa 1 de 3 • Diagnóstico de Alta Demanda</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Configure a Persona, Módulos e Avaliação do Infoproduto
          </h1>
          <p className="text-slate-300 text-sm">
            Escolha um dos nichos de alta demanda mais procurados do mercado e personalize os detalhes da oferta e autor.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 backdrop-blur-sm shadow-xl">
        
        {/* Nicho e Subnicho via Selección */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Zap className="w-4 h-4" /> 1. Nicho & Subnicho de Alta Demanda
            </h3>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              🔥 Temas Validados do Mercado
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nicho Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Selecione o Nicho Principal</label>
              <select
                required
                value={formData.niche}
                onChange={(e) => handleNicheChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {HIGH_DEMAND_NICHES.map((item) => (
                  <option key={item.niche} value={item.niche}>
                    {item.niche}
                  </option>
                ))}
              </select>
            </div>

            {/* Subnicho Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Selecione o Subnicho Específico</label>
              <select
                required
                value={formData.subniche}
                onChange={(e) => handleSubnicheChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {selectedNicheObj.subniches.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Autor / Especialista (Obrigatório) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span>Nome do Autor / Especialista</span>
            <span className="text-rose-400 font-bold text-[11px]">* (Obrigatório)</span>
          </label>
          <input
            type="text"
            required
            value={formData.authorName}
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
            placeholder="Ex: Chef Amanda Ramos ou Dra. Carolina Mendes"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Quantidade de Módulos (5, 7 ou 10) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Layers className="w-4 h-4" /> 2. Profundidade & Número de Módulos
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {([5, 7, 10] as const).map((count) => (
              <div
                key={count}
                onClick={() => setFormData({ ...formData, moduleCount: count })}
                className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${
                  formData.moduleCount === count
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xl font-extrabold text-white block">{count} Módulos</span>
                <span className="text-[11px] text-slate-400">
                  {count === 5 ? 'Curso Expresso' : count === 7 ? 'Formação Completa' : 'Masterclass Definitiva'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz e Certificado Toggle (Opcional) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> 3. Avaliação Interativa & Certificado
          </h3>
          <div
            onClick={() => setFormData({ ...formData, enableQuiz: !formData.enableQuiz })}
            className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-center justify-between ${
              formData.enableQuiz
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">Criar Curso Avaliativo com Provas e Certificado de Conclusão</span>
                {formData.enableQuiz && <span className="px-2 py-0.5 text-[10px] bg-emerald-500 text-slate-950 font-extrabold rounded-md">Ativo</span>}
              </div>
              <p className="text-xs text-slate-400">
                Adiciona perguntas de teste ao final de cada módulo com exigência de 60%+ de acertos para desbloquear o próximo, além de gabarito final e emissão de Certificado.
              </p>
            </div>
            <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${formData.enableQuiz ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'}`}>
              {formData.enableQuiz && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Dores Críticas e Desejos Ocultos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> 4. Dores Reais & Objetivos do Cliente
            </h3>

            {/* Botão para Preencher Automaticamente por IA */}
            <button
              type="button"
              onClick={handleAutoFillPains}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Gerar Dores e Desejos com IA</span>
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Dores Críticas & Frustrações Atuais do Público</label>
            <textarea
              required
              rows={3}
              value={formData.painPoints}
              onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
              placeholder="Descreva as dores ou clique no botão acima para preencher com IA..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Desejos Ocultos & Resultado dos Sonhos</label>
            <textarea
              required
              rows={2}
              value={formData.hiddenDesires}
              onChange={(e) => setFormData({ ...formData, hiddenDesires: e.target.value })}
              placeholder="Descreva o desejo do cliente ou clique no botão acima para preencher com IA..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Tom de Voz */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> 5. Tom de Voz da IA
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tones.map((t) => (
              <div
                key={t.id}
                onClick={() => setFormData({ ...formData, tone: t.id })}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  formData.tone === t.id
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>{t.icon}</span> {t.label}
                  </span>
                  {formData.tone === t.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formato Final */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> 6. Formato de Entrega
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formats.map((f) => (
              <div
                key={f.id}
                onClick={() => setFormData({ ...formData, format: f.id })}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  formData.format === f.id
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-100">{f.label}</span>
                  {formData.format === f.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>{formData.moduleCount} Módulos Ilustrados com Vídeos e Referências Ativos</span>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerar Infoproduto em {formData.moduleCount} Módulos</span>
          </button>
        </div>
      </form>
    </div>
  );
};
