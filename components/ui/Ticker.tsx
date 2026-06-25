"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Ticker() {
  const [noticias, setNoticias] = useState<Array<{texto: string, url: string}>>([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch('/api/noticias')
      .then((res) => res.json())
      .then((data) => {
        if (data.noticias && Array.isArray(data.noticias)) {
          // Remove duplicatas caso a API retorne algo repetido
          const unique = data.noticias.filter((v: any, i: any, a: any) => 
            a.findIndex((t: any) => t.texto === v.texto) === i
          );
          setNoticias(unique);
        }
      })
      .catch(() => console.error("Erro ao carregar notícias"));
  }, []);

  if (noticias.length === 0) return null;

  return (
    <div className="w-full bg-slate-950 text-slate-300 py-3 overflow-hidden border-b border-slate-800 h-12 flex items-center relative z-10">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
      >
        {noticias.map((item, index) => (
          <a 
            key={`${item.url}-${index}`} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center mx-10 hover:text-blue-400 transition-colors font-medium text-sm shrink-0 cursor-pointer"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 shrink-0" />
            {item.texto}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
