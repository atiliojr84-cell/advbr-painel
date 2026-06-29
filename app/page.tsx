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
export const revalidate = 0;

// Import dinâmico do PdfToolHub (sem SSR)
const DynamicPdfToolHub = nextDynamic(
  () => import("../components/features/PdfToolHub"),
  {
    loading: () => (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    ),
    ssr: false,
  }
);

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header com botões de relatório e reportar falha */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Painel ADVBR</h1>
            <p className="text-xs text-slate-400">
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
