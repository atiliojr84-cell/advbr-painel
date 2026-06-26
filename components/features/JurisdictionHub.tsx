"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { jurisdictions } from "../../data/jurisdictions";

export default function JurisdictionHub() {
  const [regiaoAtiva, setRegiaoAtiva] = useState<keyof typeof jurisdictions.regioes | "federais">("federais");
  const [estadoAtivo, setEstadoAtivo] = useState<string | null>(null);

  return (
    <section className="py-8 px-4 bg-slate-950">
      <h2 className="text-xl font-bold text-white mb-6 text-center">Hub de Peticionamento Nacional</h2>
      
      {/* Abas das Regiões */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button 
          onClick={() => { setRegiaoAtiva("federais"); setEstadoAtivo(null); }}
          className={`px-4 py-2 rounded border ${regiaoAtiva === "federais" ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-700 text-slate-400"} transition-all`}
        >
          Federais
        </button>
        {Object.keys(jurisdictions.regioes).map((regiao) => (
          <button 
            key={regiao}
            onClick={() => { setRegiaoAtiva(regiao as any); setEstadoAtivo(null); }}
            className={`px-4 py-2 rounded border capitalize ${regiaoAtiva === regiao ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-700 text-slate-400"} transition-all`}
          >
            {regiao}
          </button>
        ))}
      </div>

      {/* Conteúdo dinâmico */}
      <div className="max-w-4xl mx-auto">
        {/* Caso Federais */}
        {regiaoAtiva === "federais" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {jurisdictions.federais.map((f) => (
              <button key={f.name} onClick={() => window.open(f.url, "_blank")} className="p-4 bg-slate-900 border border-slate-700 rounded hover:border-blue-500 text-white text-sm transition-all">
                {f.name}
              </button>
            ))}
          </div>
        )}
        
        {/* Caso Regiões */}
        {regiaoAtiva !== "federais" && (
          <div className="space-y-6">
            {/* Lista de Estados da Região */}
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.keys(jurisdictions.regioes[regiaoAtiva]).map((estado) => (
                <button 
                  key={estado}
                  onClick={() => setEstadoAtivo(estado)}
                  className={`px-3 py-1 text-sm rounded border ${estadoAtivo === estado ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400 border-slate-700"} hover:border-blue-500`}
                >
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </button>
              ))}
            </div>

            {/* Tribunais do Estado Selecionado */}
            {estadoAtivo && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {(jurisdictions.regioes[regiaoAtiva] as any)[estadoAtivo].map((tribunal: any) => (
                  <button 
                    key={tribunal.name} 
                    onClick={() => window.open(tribunal.url, "_blank")}
                    className="p-4 bg-slate-900 border border-slate-700 rounded hover:border-blue-500 hover:shadow-lg transition-all text-left flex flex-col"
                  >
                    <span className="text-white font-medium text-sm">{tribunal.name}</span>
                    {tribunal.alerta && (
                      <div className="text-[10px] text-red-400 mt-2 flex items-center gap-1">
                        <AlertCircle size={10} /> {tribunal.alerta}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
