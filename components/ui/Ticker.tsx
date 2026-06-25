"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Ticker() {
  const [noticias, setNoticias] = useState<Array<{texto: string, url: string}>>([]);

  useEffect(() => {
    // Usamos uma variável local para evitar problemas com o Strict Mode
    let isMounted = true;

    fetch('/api/noticias')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.noticias) {
          // Filtra duplicatas logo na recepção
          const unique = Array.from(new Map(data.noticias.map((item: any) => [item.texto, item])).values());
          setNoticias(unique as any);
        }
      })
      .catch(() => console.error("Erro ao carregar notícias"));

    return () => { isMounted = false; };
  }, []);

  if (noticias.length === 0) return null;

  return (
    <div className="w-full bg-slate-950 text-slate-300 py-3 overflow-hidden border-b border-slate-800 h-12 flex items-center relative z-10">
      <motion.div 
        className="flex whitespace-nowrap"
        initial={{ x: "0%" }}
        animate={{ x: "-100%" }}
        transition={{ 
          repeat: Infinity, 
          duration: 60, // Velocidade ajustada para leitura calma
          ease: "linear"
        }}
      >
        {noticias.map((item, index) => (
          <a 
            key={index} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-8 hover:text-blue-400 transition-colors font-medium text-sm shrink-0 cursor-pointer"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 shrink-0" />
            {item.texto}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
