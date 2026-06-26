"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { jurisdictions } from "../../data/jurisdictions";

export default function JurisdictionHub() {
  const [regiaoAtiva, setRegiaoAtiva] = useState<string>("federais");
  const [estadoAtivo, setEstadoAtivo] = useState<string | null>(null);

  const getStatusColor = (alerta: string | null) => {
    if (!alerta) return "bg-green-500";
    return alerta.toLowerCase().includes("grave") ? "bg-red-500" : "bg-yellow-500";
  };

  return (
    <section className="py-8 px-4 bg-slate-950">
      <h2 className="text-xl font-bold text-white mb-8 text-center">Hub de Peticionamento Nacional</h2>
      
      {/* Abas das Regiões - Estilo Arredondado */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button 
          onClick={() => { setRegiaoAtiva("federais"); setEstadoAtivo(null); }}
          className={`px-6 py-2 rounded-full border transition-all ${regiaoAtiva === "federais" ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"}`}
        >
          Federais
        </button>
        {Object.keys(jurisdictions.regioes).map((regiao) => (
          <button 
            key={regiao}
            onClick={() => { setRegiaoAtiva(regiao); setEstadoAtivo(null); }}
            className={`px-6 py-2 rounded-full border capitalize transition-all ${regiaoAtiva === regiao ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"}`}
          >
            {regiao}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto min-h-[200px]">
        {regiaoAtiva === "federais" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
            {jurisdictions.federais.map((f) => (
              <button key={f.name} onClick={() => window.open(f.url, "_blank")} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 text-white text-sm flex items-center justify-between transition-all group">
                {f.name}
                <div className={`w-3 h-3 rounded-full ${getStatusColor(f.alerta)}`} />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Lista de Estados */}
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.keys((jurisdictions.regioes as any)[regiaoAtiva]).map((estado) => (
                <button 
                  key={estado}
                  onClick={() => setEstadoAtivo(estado)}
                  className={`px-5 py-2 text-sm rounded-full border transition-all ${estadoAtivo === estado ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"}`}
                >
                  {estado}
                </button>
              ))}
            </div>

            {/* Tribunais do Estado */}
            {estadoAtivo && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-300">
                {(jurisdictions.regioes as any)[regiaoAtiva][estadoAtivo].map((t: any) => (
                  <button 
                    key={t.name} 
                    onClick={() => window.open(t.url, "_blank")}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all flex flex-col gap-2 group"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-white font-medium text-sm">{t.name}</span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(t.alerta)}`} title={t.alerta || "Online"} />
                    </div>
                    {t.alerta && (
                      <div className="text-[10px] text-red-400 flex items-center gap-1">
                        <AlertCircle size={10} /> {t.alerta}
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
