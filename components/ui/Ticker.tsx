"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Ticker() {
  const [noticias, setNoticias] = useState<Array<{texto: string, url: string}>>([]);
  // Ref para garantir que a requisição ocorra apenas uma vez
  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;

    fetch('/api/noticias')
      .then((res) => res.json())
      .then((data) => {
        if (data.noticias && data.noticias.length > 0) {
          setNoticias(data.noticias);
        }
      })
      .catch((err) => console.error("Erro no Ticker:", err));
  }, []);

  if (noticias.length === 0) return null;

  return (
    <div className="w-full bg-slate-950 text-slate-300 py-3 overflow-hidden border-b border-slate-800 h-12 flex items-center relative z-10">
      <motion.div 
        className="flex whitespace-nowrap"
        // Inicia na posição 0 para não ter atraso
        initial={{ x: "0%" }}
        animate={{ x: "-100%" }}
        transition={{ 
          repeat: Infinity, 
          duration: 40, // Duração ajustada para velocidade de leitura humana
          ease: "linear"
        }}
      >
        {noticias.map((item, index) => (
          <a 
            key={`${index}`} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-10 hover:text-blue-400 transition-colors font-medium text-sm shrink-0"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 shrink-0" />
            {item.texto}
          </a>
        ))}
      </motion.div>
    </div>
  );
}          repeatType: "loop"
        }}
      >
        {noticias.map((item, index) => (
          <a 
            key={`${item.url}-${index}`} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-10 hover:text-blue-400 transition-colors font-medium text-sm shrink-0"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 shrink-0" />
            {item.texto}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
