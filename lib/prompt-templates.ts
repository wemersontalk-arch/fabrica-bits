import { InfoproductInput } from '@/types/infoproduct';

export const INFOPRODUCT_SYSTEM_PROMPT = `
Você é o "Infoproduct Engine AI", um Mestre Arquiteto de Infoprodutos de Alto Valor Comercial, Engenheiro Pedagógico e Copywriter Sênior de Resposta Direta.

SUA MISSÃO INEGOCIÁVEL:
Criar conteúdos de infoprodutos extremamente profundos, práticos, estruturados e prontos para aplicação imediata. É ESTRITAMENTE PROIBIDO gerar textos genéricos, clichês vazios (ex: "descubra o segredo", "no mundo de hoje"), parágrafos enrolativos ou explicações abstratas que não ensinem o "COMO FAZER".

REGRAS DE OURO DE QUALIDADE:
1. NOMEAÇÃO DE MÉTODOS: Todo conceito deve ser ancorado em um Framework ou Método com nome próprio memorável (ex: "Protocolo 4C de Validação", "Matriz de Ação Rápida").
2. AÇÃO PASSO A PASSO DETALHADA: Não diga o que fazer sem detalhar a ferramenta, sequência exata, comandos ou checklist de execução.
3. ESTUDOS DE CASO SIMULADOS: Inclua exemplos práticos realistas com nomes, dados de contexto e resultados mensuráveis.
4. ALERTAS DE ERROS COMUNS: Destaque o erro que 90% das pessoas cometem e dê a solução de contorno direta.
5. FORMATAÇÃO VISUAL RICA: Utilize markdown estruturado com Callouts de Alerta, Quadros de Resumo, Tabelas Comparativas e Checklists.
6. TOM DE VOZ AJUSTADO: Adapte a linguagem rigorosamente ao tom solicitado sem perder a autoridade técnica.
`;

export function buildPipeline1Prompt(input: InfoproductInput): string {
  return `
[PIPELINE 1: ESTRUTURAÇÃO DO MÉTODO E ÍNDICE]
Nicho: ${input.niche}
Subnicho: ${input.subniche}
Público Alvo: ${input.targetAudience}
Dores Críticas: ${input.painPoints}
Desejos Ocultos: ${input.hiddenDesires}
Tom de Voz: ${input.tone}
Formato: ${input.format}

Gere uma arquitetura de produto no formato JSON contendo:
1. "methodName": Nome exclusivo e patenteável do método (Ex: "Método MARMITA PRO 5K").
2. "tagline": Frase marcante de posicionamento.
3. "promise": Promessa transformadora e mensurável.
4. "chaptersOutline": Lista de 5 a 6 títulos de capítulos com objetivos claros para o público final.
`;
}

export function buildPipeline2Prompt(input: InfoproductInput, chapterTitle: string, chapterIndex: number): string {
  return `
[PIPELINE 2: DESENVOLVIMENTO DE CAPÍTULO DE ALTA PROFUNDIDADE]
Capítulo ${chapterIndex}: ${chapterTitle}
Nicho: ${input.niche} (${input.subniche})
Tom: ${input.tone}

Forneça o conteúdo do capítulo no formato JSON rigoroso com:
- "title": "${chapterTitle}"
- "subtitle": Subtítulo instigante focado na dor real
- "objective": Objetivo prático do capítulo
- "introduction": Introdução de impacto ancorada na dor do cliente
- "frameworkName": Nome do método/ferramenta ensinada neste capítulo
- "stepByStep": Array com 4 passos práticos contendo { stepNumber, title, description, actionItem }
- "commonMistakes": Array de 2 erros comuns { mistake, solution }
- "caseStudy": { title, scenario, result }
- "checklists": Array de 3 itens verificáveis { id, item, explanation }
- "summaryTable": { headers: string[], rows: string[][] }
`;
}

export function buildPipeline3Prompt(input: InfoproductInput, methodName: string): string {
  return `
[PIPELINE 3: KIT DE VENDAS E COPY INTEGRADA]
Método Criado: ${methodName}
Nicho: ${input.niche} - ${input.subniche}
Público: ${input.targetAudience}
Dores: ${input.painPoints}

Gere um Kit de Vendas completo no formato JSON contendo:
- "landingPageCopy": { headline, subheadline, problemSection, solutionSection, methodHighlights, objectionHandling, authorBio, faq, ctaText }
- "whatsappSequence": Array de 3 mensagens persuasivas e elegantes para grupos ou contato direto.
`;
}
