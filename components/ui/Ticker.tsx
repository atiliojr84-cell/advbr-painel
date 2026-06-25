"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Ticker() {
  const [noticias, setNoticias] = useState<Array<{texto: string, url: string}>>([]);
  const fetchedRef = useRef(false); // Ref para travar a execução dupla

  useEffect(() => {
    if (fetchedRef.current) return; // Se já buscou, não busca de novo
    fetchedRef.current = true;

    fetch('/api/noticias')
      .then((res) => res.json())
      .then((data) => {
        if (data.noticias) {
            setNoticias(data.noticias);
        }
      })
      .catch(() => console.error("Erro ao carregar notícias"));
  }, []);

  if (noticias.length === 0) return null;

  return (
    <div className="w-full bg-slate-950 text-slate-300 py-3 overflow-hidden border-b border-slate-800 h-12 flex items-center relative">
       {/* O componente agora garante que só renderiza uma instância */}
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
      >
        {noticias.map((item, index) => (
          <a key={`${index}`} href={item.url} target="_blank" className="flex items-center mx-10 hover:text-blue-400 transition-colors font-medium text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
            {item.texto}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
