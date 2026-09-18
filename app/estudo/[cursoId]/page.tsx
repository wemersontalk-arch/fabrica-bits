import React, { Suspense } from 'react';
import { StudentLmsContent } from '@/components/lms/StudentLmsContent';

export async function generateStaticParams() {
  return [
    { cursoId: 'dieta-dos-pontos-descomplicada-2' },
    { cursoId: 'corpo-em-foco-3' },
    { cursoId: 'metodo-lucro-digital-1' },
    { cursoId: 'exemplo-infoproduto' },
  ];
}

interface PageProps {
  params: {
    cursoId: string;
  };
}

export default function StudentLmsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-xs font-mono">Carregando Área de Membros...</div>}>
      <StudentLmsContent cursoId={params.cursoId} />
    </Suspense>
  );
}
