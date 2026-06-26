"use client";

import { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { jurisdictions } from "../../data/jurisdictions";

export default function JurisdictionHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'estado' | 'tribunal'>('estado');
  const [activeRegiao, setActiveRegiao] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');

  const getStatusColor = (alerta: string | null) => {
    if (!alerta) return "bg-green-500";
    return alerta.toLowerCase().includes("grave") ? "bg-red-500" : "bg-yellow-500";
  };

  const handleOpenModal = (regiao: string) => {
    setActiveRegiao(regiao);
    // Se clicou em federais, já vai direto para a tela de tribunais
    setView(regiao === 'federais' ? 'tribunal' : 'estado');
    setIsOpen(true);
  };

  return (
    <>
      <section className="py-8 px-4 flex flex-wrap justify-center gap-4">
        {["Federais", "Sul", "Sudeste", "CentroOeste", "Nordeste", "Norte"].map((r) => (
          <button 
            key={r} 
            onClick={() => handleOpenModal(r.toLowerCase())}
            className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:border-blue-500 hover:bg-slate-800 transition-all capitalize"
          >
            {r === "CentroOeste" ? "Centro-Oeste" : r}
          </button>
        ))}
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0b0f19] border border-slate-800 w-full max-w-lg rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white font-bold text-2xl flex items-center gap-4">
                {view === 'tribunal' && activeRegiao !== 'federais' && (
                  <button onClick={() => setView('estado')} className="text-slate-500 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                )}
                {activeRegiao === 'federais' ? 'TRIBUNAIS FEDERAIS' : (view === 'estado' ? activeRegiao.toUpperCase() : selectedEstado)}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={28} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Tela de Estados */}
              {view === 'estado' && Object.keys((jurisdictions.regioes as any)[activeRegiao] || {}).map(e => (
                <button key={e} onClick={() => { setSelectedEstado(e); setView('tribunal'); }} 
                  className="w-full p-5 bg-slate-900/50 rounded-2xl text-left text-white border border-slate-800 hover:border-blue-600 hover:bg-slate-800 transition-all">
                  {e}
                </button>
              ))}

              {/* Tela de Tribunais */}
              {view === 'tribunal' && (
                activeRegiao === 'federais' 
                ? jurisdictions.federais.map((t: any) => (
                    <button key={t.name} onClick={() => window.open(t.url, "_blank")} className="w-full p-5 bg-slate-900/50 rounded-2xl flex items-center justify-between border border-slate-800 hover:border-blue-600 hover:bg-slate-800 transition-all">
                      <span className="text-white font-medium">{t.name}</span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(t.alerta)}`} />
                    </button>
                  ))
                : (jurisdictions.regioes as any)[activeRegiao]?.[selectedEstado]?.map((t: any) => (
                    <button key={t.name} onClick={() => window.open(t.url, "_blank")} className="w-full p-5 bg-slate-900/50 rounded-2xl flex items-center justify-between border border-slate-800 hover:border-blue-600 hover:bg-slate-800 transition-all">
                      <span className="text-white font-medium">{t.name}</span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(t.alerta)}`} />
                    </button>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
