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

  // Garante que sempre haja 3 produtos visíveis, mesmo se a lista for menor
  const getVisibleProducts = () => {
    const products = [];
    for (let i = 0; i < 3; i++) {
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

        <div className="relative flex items-center justify-center">
          <button 
            onClick={handlePrev} 
            className="absolute left-0 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white text-2xl"
            aria-label="Produto anterior"
          >
            <
          </button>

          <div className="flex space-x-4 overflow-hidden">
            <AnimatePresence initial={false}>
              {visibleProducts.map((product, index) => (
                <motion.a
                  key={product.id}
                  href={product.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="flex-none w-72 bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                  style={{ flexShrink: 0 }} // Garante que os itens não encolham
                >
                  <div className="relative w-full h-48 bg-slate-700 flex items-center justify-center">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.title} 
                      layout="fill" 
                      objectFit="contain" 
                      className="p-2"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white truncate">{product.title}</h3>
                    <p className="text-blue-400 text-xl font-bold mt-2">{product.price}</p>
                    <p className="text-slate-400 text-sm mt-1">Compre na Amazon</p>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleNext} 
            className="absolute right-0 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white text-2xl"
            aria-label="Próximo produto"
          >
            >
          </button>
        </div>
      </div>
    </section>
  );
}
