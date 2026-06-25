"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Ticker() {
  const [noticias, setNoticias] = useState<Array<{texto: string, url: string}>>([]);

  useEffect(() => {
    fetch('/api/noticias')
      .then(res => res.json())
      .then(data => setNoticias(data.noticias || []));
  }, []);

  if (noticias.length === 0) return null;

  return (
    <div className="w-full bg-slate-950 text-slate-300 py-3 overflow-hidden border-b border-slate-800 h-12 flex items-center">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ 
          repeat: Infinity, 
          duration: 40, 
          ease: "linear" 
        }}
      >
        {noticias.map((item, i) => (
          <a key={i} href={item.url} target="_blank" className="flex items-center px-10 hover:text-blue-400 font-medium text-sm shrink-0">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
            {item.texto}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
