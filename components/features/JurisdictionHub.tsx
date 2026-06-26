"use client";

import { useState } from "react";
import { X, ArrowLeft, AlertCircle } from "lucide-react";
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
    setView('estado');
    setIsOpen(true);
  };

  return (
    <>
      {/* 1. Botões das Regiões (Fixos na sua HomePage) */}
      <section className="py-8 px-4 flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => handleOpenModal("federais")}
          className="px-6 py-3 bg-slate-900 border border-slate-700 rounded-full text-slate-300 hover:border-blue-500 transition-all"
        >
          Federais
        </button>
        {Object.keys(jurisdictions.regioes).map((regiao) => (
          <button 
            key={regiao} 
            onClick={() => handleOpenModal(regiao)}
            className="px-6 py-3 bg-slate-900 border border-slate-700 rounded-full text-slate-300 hover:border-blue-500 transition-all capitalize"
          >
            {regiao}
          </button>
        ))}
      </section>

      {/* 2. Janela Modal (O Pop-up elegante com transição) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0b0f19] border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Header da Janela */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-3">
                {view === 'tribunal' && (
                  <button onClick={() => setView('estado')} className="text-slate-400 hover:text-white">
                    <ArrowLeft size={20} />
                  </button>
                )}
                {view === 'estado' ? activeRegiao : selectedEstado}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo com transição interna */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 animate-in fade-in duration-500">
              {view === 'estado' && (
                activeRegiao === 'federais' 
                ? jurisdictions.federais.map((f: any) => (
                    <button key={f.name} onClick={() => window.open(f.url, "_blank")} className="w-full p-4 bg-slate-900 rounded-2xl flex justify-between items-center border border-slate-800 hover:border-blue-500">
                      <span className="text-white">{f.name}</span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(f.alerta)}`} />
                    </button>
                  ))
                : Object.keys((jurisdictions.regioes as any)[activeRegiao]).map(e => (
                    <button key={e} onClick={() => { setSelectedEstado(e); setView('tribunal'); }} className="w-full p-4 bg-slate-900 rounded-2xl text-left text-white border border-slate-800 hover:border-blue-500 transition-all">
                      {e}
                    </button>
                  ))
              )}

              {view === 'tribunal' && (jurisdictions.regioes as any)[activeRegiao][selectedEstado].map((t: any) => (
                <button key={t.name} onClick={() => window.open(t.url, "_blank")} className="w-full p-4 bg-slate-900 rounded-2xl flex items-center justify-between border border-slate-800 hover:border-blue-500 transition-all">
                  <span className="text-white">{t.name}</span>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(t.alerta)}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
