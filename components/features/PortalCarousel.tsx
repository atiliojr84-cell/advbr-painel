"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Lista atualizada com os 10 selecionados
const portais = [
  { id: 1, name: "PJe Nacional", url: "https://www.pje.jus.br" },
  { id: 2, name: "TJPR E-Proc 1 Grau", url: "https://eproc.tjpr.jus.br" },
  { id: 3, name: "TJSP E-SAJ", url: "https://esaj.tjsp.jus.br" },
  { id: 4, name: "TJPR Projudi", url: "https://projudi.tjpr.jus.br" },
  { id: 5, name: "STF Eletrônico", url: "https://portal.stf.jus.br" },
  { id: 6, name: "STJ Processos", url: "https://scon.stj.jus.br" },
  { id: 7, name: "TRT9 PJe 1 Grau", url: "https://pje.trt9.jus.br" },
  { id: 8, name: "E-SAJ Nacional", url: "https://esaj.jus.br" },
  { id: 9, name: "PDPJ Hub CNJ", url: "https://pdpj.jus.br" },
  { id: 10, name: "TRT9 PJe 2 Grau", url: "https://pje2g.trt9.jus.br" },
];

export default function PortalCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -250 : 250, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group my-8">
      <button onClick={() => scroll('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full border border-blue-600 text-white hover:bg-blue-900 transition-all">
        <ChevronLeft size={18} />
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-none py-4 px-2">
        {portais.map((p) => (
          <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
             className="flex-none w-64 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-600 transition-all cursor-pointer flex justify-between items-center group">
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{p.name}</p>
              <p className="text-[10px] text-slate-400">Clique para acessar</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </a>
        ))}
      </div>

      <button onClick={() => scroll('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full border border-blue-600 text-white hover:bg-blue-900 transition-all">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
