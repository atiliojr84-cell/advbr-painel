"use client";

// Importações principais
import DiagnosticHub from "../components/features/DiagnosticHub";
import JurisdictionHub from "../components/features/JurisdictionHub";
import ProblemReporter from "../components/features/ProblemReporter";
import { kv } from "@vercel/kv";

// Renomeamos o import dinâmico para evitar conflito com `export const dynamic`
import nextDynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Página sempre dinâmica (sem cache)
export const dynamic = "force-dynamic";
// A linha 'export const revalidate = 0;' foi removida, pois 'force-dynamic' já desabilita o cache.

// Import dinâmico do PdfToolHub (sem SSR)
const DynamicPdfToolHub = nextDynamic(
  () => import("../components/features/PdfToolHub"),
  {
    loading: () => (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    ),
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabeçalho com título e botões de ação */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400">
              ADVBR Painel
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Monitoramento de portais, diagnóstico e ferramentas de apoio.
            </p>
          </div>

          {/* Botões de topo: Reportar Falha e Ver Relatório de Falhas */}
          <div className="flex items-center gap-2">
            <ProblemReporter />
          </div>
        </header>

        {/* Seções principais do painel */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hub de diagnóstico / status */}
          <div className="space-y-4">
            <DiagnosticHub />
            <JurisdictionHub />
          </div>

          {/* Ferramentas de PDF */}
          <div className="space-y-4">
            <DynamicPdfToolHub />
          </div>
        </section>
      </div>
    </main>
  );
}
