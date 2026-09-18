import React, { Suspense } from 'react';
import { SalesPageContent } from '@/components/sales/SalesPageContent';

export async function generateStaticParams() {
  return [
    { slug: 'dieta-dos-pontos-descomplicada-2' },
    { slug: 'corpo-em-foco-3' },
    { slug: 'metodo-lucro-digital-1' },
    { slug: 'exemplo-infoproduto' },
  ];
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function DynamicSalesPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-xs font-mono">Carregando Landing Page...</div>}>
      <SalesPageContent slug={params.slug} />
    </Suspense>
  );
}
