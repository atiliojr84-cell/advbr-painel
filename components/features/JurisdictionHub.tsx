"use client";

import { useState } from "react";
import { X, ArrowLeft, AlertCircle, Globe } from "lucide-react";
import { jurisdictions } from "../../data/jurisdictions";

export default function JurisdictionHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'regiao' | 'estado' | 'tribunal'>('regiao');
  const [activeRegiao, setActiveRegiao] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');

  const getStatusColor = (alerta: string | null) => {
    if (!alerta) return "bg-green-500";
    return alerta.toLowerCase().includes("grave") ? "bg-red-500" : "bg-yellow-500";
  };

  const handleOpen = (regiao: string) => {
    setActiveRegiao(regiao);
    setView(regiao === 'federais' ? 'tribunal' : 'estado');
    setIsOpen(true);
  };

  const regioesOrdem = ["Sul", "Sudeste", "CentroOeste", "Nordeste", "Norte"];

  return (
    <>
      {/* Botões Fixos na Página Principal */}
      <section className="py-8 px-4 flex flex-wrap justify-center gap-4">
        <button onClick={() => handleOpen("federais")} className="px-6 py-3 bg-slate-900 border border-slate-700 rounded-full text-slate-300 hover:border-blue-500 transition-all">Federais</button>
        {regioesOrdem.map((r) => (
          <button key={r} onClick={() => handleOpen(r)} className="px-6 py-3 bg-slate-900 border border-slate-700 rounded-full text-slate-300 hover:border-blue-500 transition-all capitalize">
            {r === "CentroOeste" ? "Centro-Oeste" : r}
          </button>
        ))}
      </section>

      {/* Modal Elegante */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0b0f19] border border-slate-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-xl flex items-center gap-3">
                {view !== 'regiao' && activeRegiao !== 'federais' && (
                  <button onClick={() => setView('estado')} className="text-slate-400 hover:text-white"><ArrowLeft size={20}/></button>
                )}
                {view === 'estado' ? activeRegiao : view === 'tribunal' ? selectedEstado : 'Hub de Tribunais'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {view === 'estado' && Object.keys((jurisdictions.regioes as any)[activeRegiao]).map(e => (
                <button key={e} onClick={() => { setSelectedEstado(e); setView('tribunal'); }} className="w-full p-4 bg-slate-900 rounded-2xl text-left text-white border border-slate-800 hover:border-blue-500 transition-all">
                  {e}
                </button>
              ))}

              {view === 'tribunal' && (activeRegiao === 'federais' ? jurisdictions.federais : (jurisdictions.regioes as any)[activeRegiao][selectedEstado]).map((t: any) => (
                <button key={t.name} onClick={() => window.open(t.url, "_blank")} className="w-full p-4 bg-slate-900 rounded-2xl flex items-center justify-between border border-slate-800 hover:border-blue-500 transition-all">
                  <span className="text-white font-medium text-sm">{t.name}</span>
                  <div className="flex items-center gap-3">
                    {t.alerta && <AlertCircle size={14} className="text-red-400" />}
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(t.alerta)}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
