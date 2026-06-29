"use client"; // Adicionado para garantir que é um Client Component

import { useState } from "react"; // Importa useState
import { AlertCircle } from "lucide-react";
import ProblemReporter from "../ProblemReporter";
import ReportsViewerModal from "../ReportsViewerModal"; // Importa o novo componente de modal de relatórios

export default function Header() {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false); // Estado para controlar o modal de relatórios

  return (
    <header className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex flex-col text-left mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-white">ADVBR Painel</h1>
        <p className="text-sm text-slate-400">Suporte Tecnológico Integrado para Profissionais do Direito</p>
      </div>

      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
        <p className="hidden sm:block text-[11px] text-slate-500 leading-tight max-w-[180px] text-right">
          Nos ajude a monitorar os portais comunicando o seu problema.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <ProblemReporter />
          <button
            onClick={() => setIsReportsModalOpen(true)} // Abre o modal de relatórios
            className="px-4 py-2 text-blue-400 underline transition-all duration-300 hover:text-blue-300 text-sm"
          >
            Ver Relatório de Falhas
          </button>
        </div>
      </div>

      {/* Renderiza o modal de relatórios */}
      <ReportsViewerModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
      />
    </header>
  );
}
