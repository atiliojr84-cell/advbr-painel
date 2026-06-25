"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Ticker() {
  const [noticias, setNoticias] = useState<Array<{texto: string, url: string}>>([]);

  useEffect(() => {
    fetch('/api/noticias')
      .then((res) => res.json())
      .then((data) => {
        // Garantimos que apenas notícias únicas sejam setadas
        const uniqueNoticias = Array.from(new Set(data.noticias.map((n: any) => n.texto)))
          .map(texto => data.noticias.find((n: any) => n.texto === texto));
        setNoticias(uniqueNoticias);
      })
      .catch(() => console.error("Erro ao carregar notícias"));
  }, []);

  if (noticias.length === 0) return null;

  return (
    <div className="w-full bg-slate-950 text-slate-300 py-2 overflow-hidden border-b border-slate-800 relative h-10 flex items-center">
      <motion.div 
        className="flex whitespace-nowrap absolute"
        // Inicia da direita para a esquerda continuamente
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {noticias.map((item, index) => (
          <a 
            key={`${item.url}-${index}`} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center mx-8 hover:text-blue-400 transition-colors font-medium text-sm shrink-0"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse" />
            {item.texto}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
