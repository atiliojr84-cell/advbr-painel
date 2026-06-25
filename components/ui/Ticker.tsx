"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Ticker() {
  const [noticias, setNoticias] = useState<Array<{texto: string, url: string}>>([]);

  useEffect(() => {
    fetch('/api/noticias')
      .then((res) => res.json())
      .then((data) => setNoticias(data.noticias || []))
      .catch(() => console.error("Erro ao carregar notícias"));
  }, []);

  if (noticias.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 text-white py-2 overflow-hidden border-b border-slate-700">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      >
        {noticias.map((item, index) => (
          <a 
            key={index} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mx-8 hover:text-blue-400 transition-colors font-medium text-sm"
          >
            {item.texto}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
