"use client";

import { useState } from "react";
import { X, ArrowLeft, AlertCircle, Globe } from "lucide-react";
import { jurisdictions } from "../../data/jurisdictions";

export default function JurisdictionHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'regiao' | 'estado' | 'tribunal'>('regiao');
  const [selectedRegiao, setSelectedRegiao] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');

  const getStatusColor = (alerta: string | null) => {
    if (!alerta) return "bg-green-500";
    return alerta.toLowerCase().includes("grave") ? "bg-red-500" : "bg-yellow-500";
  };

  return (
    <>
      {/* Botão de chamada que substitui a seção estática */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-6 bg-slate-900 border border-slate-700 rounded-2xl text-white font-bold hover:border-blue-500 transition-all flex items-center justify-center gap-3 shadow-lg"
      >
        <Globe size={20} className="text-blue-500" />
        Hub de Peticionamento Nacional
      </button>

      {/* Janela Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Cabeçalho do Modal */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                {view !== 'regiao' && (
                  <button onClick={() => setView(view === 'tribunal' ? 'estado' : 'regiao')} className="hover:text-blue-500">
                    <ArrowLeft size={20} />
                  </button>
                )}
                {view === 'regiao' ? 'Selecione a Região' : view === 'estado' ? selectedRegiao : selectedEstado}
              </h3>
              <button onClick={() => { setIsOpen(false); setView('regiao'); }} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo dinâmico com transição */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 animate-in fade-in duration-300">
              
              {view === 'regiao' && (
                <>
                  <button onClick={() => { setSelectedRegiao('federais'); setView('tribunal'); }} className="w-full p-4 bg-blue-600/20 border border-blue-500/30 text-white rounded-lg hover:bg-blue-600/40 font-semibold mb-4">
                    Tribunais Federais
                  </button>
                  {Object.keys(jurisdictions.regioes).map(r => (
                    <button key={r} onClick={() => { setSelectedRegiao(r); setView('estado'); }} className="w-full p-3 bg-slate-800 text-left rounded-lg text-white hover:bg-slate-700 capitalize">
                      {r}
                    </button>
                  ))}
                </>
              )}

              {view === 'estado' && Object.keys((jurisdictions.regioes as any)[selectedRegiao]).map(e => (
                <button key={e} onClick={() => { setSelectedEstado(e); setView('tribunal'); }} className="w-full p-3 bg-slate-800 text-left rounded-lg text-white hover:bg-slate-700">
                  {e}
                </button>
              ))}

              {view === 'tribunal' && (selectedRegiao === 'federais' ? jurisdictions.federais : (jurisdictions.regioes as any)[selectedRegiao][selectedEstado]).map((t: any) => (
                <button key={t.name} onClick={() => window.open(t.url, "_blank")} className="w-full p-4 bg-slate-800 rounded-lg flex items-center justify-between hover:bg-slate-700 group">
                  <span className="text-white text-sm">{t.name}</span>
                  <div className="flex items-center gap-3">
                    {t.alerta && <AlertCircle size={14} className="text-red-400" />}
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(t.alerta)}`} title={t.alerta || "Online"} />
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
