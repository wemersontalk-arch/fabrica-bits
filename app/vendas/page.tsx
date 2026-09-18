'use client';

import React, { Suspense } from 'react';
import { SalesPageContent } from '@/components/sales/SalesPageContent';

export default function VendasIndexPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-xs font-mono">Carregando Landing Page de Vendas...</div>}>
      <SalesPageContent />
    </Suspense>
  );
}
