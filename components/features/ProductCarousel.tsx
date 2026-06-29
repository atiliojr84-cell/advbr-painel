// components/features/ProductCarousel.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { amazonProducts } from '../../data/amazonProducts'; // Importa os dados dos produtos

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? amazonProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === amazonProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Garante que sempre haja 3 produtos visíveis, mesmo se a lista for pequena
  const getVisibleProducts = () => {
    const products = [];
    // Garante que a lista de produtos não seja vazia para evitar erros
    if (amazonProducts.length === 0) return [];
for (let i = 0; i &lt; 3; i++) {
  products.push(amazonProducts[(currentIndex + i) % amazonProducts.length]);
}
return products;
  };

  const visibleProducts = getVisibleProducts();

  return (
    <section className="py-12 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center border-b border-slate-700 pb-4">
          Produtos de Informática Selecionados
        </h2>
    &lt;div className="relative flex items-center justify-center"&gt;
      &lt;button 
        onClick={handlePrev} 
        className="absolute left-0 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white text-2xl"
        aria-label="Produto anterior"
      &gt;
        &amp;lt;
      &lt;/button&gt;

      &lt;div className="flex space-x-4 overflow-hidden"&gt;
        &lt;AnimatePresence initial={false}&gt;
          {visibleProducts.map((product) =&gt; (
            &lt;motion.a
              key={product.id}
              href={product.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex-none w-72 bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              style={{ flexShrink: 0 }}
            &gt;
              &lt;div className="relative w-full h-48 bg-slate-700 flex items-center justify-center"&gt;
                &lt;Image 
                  src={product.imageUrl} 
                  alt={product.title} 
                  layout="fill" 
                  objectFit="contain" 
                  className="p-2"
                /&gt;
              &lt;/div&gt;
              &lt;div className="p-4"&gt;
                &lt;h3 className="text-lg font-semibold text-white truncate"&gt;{product.title}&lt;/h3&gt;
                &lt;p className="text-blue-400 text-xl font-bold mt-2"&gt;{product.price}&lt;/p&gt;
                &lt;p className="text-slate-400 text-sm mt-1"&gt;Compre na Amazon&lt;/p&gt;
              &lt;/div&gt;
            &lt;/motion.a&gt;
          ))}
        &lt;/AnimatePresence&gt;
      &lt;/div&gt;

      &lt;button 
        onClick={handleNext} 
        className="absolute right-0 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white text-2xl"
        aria-label="Próximo produto"
      &gt;
        &amp;gt;
      &lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/section&gt;
  );
}
