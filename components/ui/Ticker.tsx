"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Ticker() {
  const [noticias, setNoticias] = useState<Array<{texto: string, url: string}>>([]);

  useEffect(() => {
    fetch('/api/noticias')
      .then(res => res.json())
      .then(data => {
        if (data.noticias) setNoticias(data.noticias);
      });
  }, []);

  if (noticias.length === 0) return null;

  // O "Pulo do Gato": Duplicamos as notícias para a animação ser infinita e começar no instante ZERO
  const noticiasDuplicadas = [...noticias, ...noticias];

  return (
    <div className="w-full bg-slate-950 text-slate-300 py-3 overflow-hidden border-b border-slate-800 h-12 flex items-center">
      <motion.div 
        className="flex whitespace-nowrap"
        // Começa em 0% (já na tela) e vai até -50% (onde ele recomeça imperceptivelmente)
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
      >
        {noticiasDuplicadas.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center px-10 hover:text-blue-400 font-medium text-sm shrink-0">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 shrink-0" />
            {item.texto}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
