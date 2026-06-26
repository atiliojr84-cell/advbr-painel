"use client";

import { jurisdictions } from "../../data/jurisdictions";

export default function JurisdictionHub() {
  return (
    <section className="py-8 px-4 bg-slate-950">
      <h2 className="text-xl font-bold text-white mb-6 text-center">
        Hub de Peticionamento Nacional
      </h2>
      
      <div className="flex flex-wrap justify-center gap-4">
        {/* Botão para Federais */}
        <div className="w-full text-center mb-4">
          <h3 className="text-blue-500 font-bold mb-2 uppercase text-sm">Tribunais Federais</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {jurisdictions.federais.map((f, i) => (
              <button 
                key={i}
                onClick={() => window.open(f.url, "_blank")}
                className="px-4 py-2 border border-slate-700 bg-slate-900 text-white rounded hover:border-blue-500 transition-all text-sm"
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Aqui entra a lógica das regiões que expandiremos em seguida */}
        <p className="text-slate-500 italic">Módulo de Regiões em desenvolvimento...</p>
      </div>
    </section>
  );
}
