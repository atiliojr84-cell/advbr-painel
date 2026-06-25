"use client";

import { useEffect, useState } from "react";

interface Noticia {
  texto: string;
  url: string;
}

export default function Ticker() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    async function carregarNoticias() {
      try {
        const res = await fetch('/api/noticias');
        if (res.ok) {
          const dados = await res.json();
          setNoticias(dados.noticias || []);
        }
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      }
    }
    carregarNoticias();
    // Atualiza o painel visualmente a cada 5 minutos
    const intervalo = setInterval(carregarNoticias, 300000); 
    return () => clearInterval(intervalo);
  }, []);

  if (noticias.length === 0) {
    return (
      <div className="w-full bg-[#060911] border-b border-slate-800 py-3 flex justify-center items-center">
        <span className="text-xs text-slate-500 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Sincronizando feed de notícias...
        </span>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker-anim { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
        .animate-ticker { display: inline-flex; white-space: nowrap; animation: ticker-anim 140s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
      `}} />
      <div className="w-full overflow-hidden bg-[#060911] border-b border-slate-800 py-[14px]">
        <div className="animate-ticker">
          {/* Renderiza duas vezes para o efeito de loop infinito infinito */}
          {[...noticias, ...noticias].map((noticia, idx) => (
            <a
              key={idx}
              href={noticia.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-16 text-[13.5px] font-medium flex items-center gap-2.5 text-slate-400 border-r border-slate-800 hover:text-blue-500 transition-colors cursor-pointer"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
              {noticia.texto}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
