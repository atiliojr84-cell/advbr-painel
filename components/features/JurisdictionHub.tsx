"use client";

import { useState } from "react";
import { ArrowLeft, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const regiaoMap: { [key: string]: string } = {
    federais: "federais",
    sul: "Sul",
    sudeste: "Sudeste",
    centrooeste: "CentroOeste",
    nordeste: "Nordeste",
    norte: "Norte"
  };

  const handleOpen = (regiaoSlug: string) => {
    const key = regiaoMap[regiaoSlug];
    setActiveRegiao(key);
    setView(key === 'federais' ? 'tribunal' : 'estado');
    setIsOpen(true);
  };

  const btnStyle = "bg-slate-900 rounded-xl glow-effect";

  return (
    <>
      <section className="py-8 px-4 text-center">
        {/* BLOCO DE MONITORAMENTO */}
        <div className="max-w-3xl mx-auto mb-12 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-900/20 rounded-2xl">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Monitoramento de Tribunais em Tempo Real</h2>
          </div>
          <p className="text-slate-400 leading-relaxed text-sm">
            Centralizamos o acesso aos principais sistemas de peticionamento do país. Realizamos o monitoramento proativo de cada portal, identificando instabilidades em tempo real.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {["Federais", "Sul", "Sudeste", "CentroOeste", "Nordeste", "Norte"].map((r) => (
            <button key={r} onClick={() => handleOpen(r.toLowerCase())} className={`px-6 py-3 rounded-full text-slate-300 capitalize ${btnStyle}`}>
              {r === "CentroOeste" ? "Centro-Oeste" : r}
            </button>
          ))}
        </div>
      </section>

      {/* MODAL DE JURISDIÇÃO (Mantém sua lógica atual) */}
      {isOpen && (
        <AnimatePresence>
            {/* ... o restante do seu código de modal de jurisdição permanece aqui ... */}
        </AnimatePresence>
      )}
    </>
  );
}
