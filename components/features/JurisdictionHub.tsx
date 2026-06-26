"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { jurisdictions } from "../../data/jurisdictions";
import Modal from "../ui/Modal"; // Importando seu padrão oficial

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

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={
          <div className="flex items-center gap-3">
            {view === 'tribunal' && activeRegiao !== 'federais' && (
              <button onClick={() => setView('estado')} className="text-slate-400 hover:text-white">
                <ArrowLeft size={20} />
              </button>
            )}
            {activeRegiao === 'federais' ? 'TRIBUNAIS FEDERAIS' : (view === 'estado' ? activeRegiao.toUpperCase() : selectedEstado)}
          </div>
        }
      >
        <div className="space-y-3">
          {view === 'estado' && activeRegiao !== 'federais' && (
            Object.keys((jurisdictions.regioes as any)[activeRegiao] || {}).map((e) => (
              <button key={e} onClick={() => { setSelectedEstado(e); setView('tribunal'); }} 
                className="w-full p-4 bg-slate-900/50 rounded-xl text-left text-white border border-slate-800 hover:border-blue-600 hover:bg-slate-800 transition-all font-medium">
                {e}
              </button>
            ))
          )}

          {view === 'tribunal' && (
            (activeRegiao === 'federais' 
              ? jurisdictions.federais 
              : (jurisdictions.regioes as any)[activeRegiao]?.[selectedEstado]
            )?.map((t: any) => (
              <button key={t.name} onClick={() => window.open(t.url, "_blank")} 
                className="w-full p-4 bg-slate-900/50 rounded-xl flex items-center justify-between border border-slate-800 hover:border-blue-600 hover:bg-slate-800 transition-all">
                <span className="text-white font-medium">{t.name}</span>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(t.alerta)}`} />
              </button>
            ))
          )}
        </div>
      </Modal>
    </>
  );
}
