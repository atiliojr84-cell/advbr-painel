// components/features/ProductCarousel.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { amazonProducts } from "../../data/amazonProducts";

export default function ProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  // Se não houver produtos, não renderiza nada
  if (!amazonProducts || amazonProducts.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2 mb-4">
        <i className="fa-solid fa-computer text-blue-500"></i>
        Produtos de Informática Selecionados (Amazon Afiliados)
      </h2>

      <div className="relative group my-4">
        {/* Botão esquerda */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full border border-blue-600 text-white hover:bg-blue-900 transition-all"
          aria-label="Anterior"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Área rolável com os produtos */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2 overscroll-elastic"
        >
          {amazonProducts.map((product) => (
            <a
              key={product.id}
              href={product.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none w-64 bg-slate-900 rounded-xl glow-effect cursor-pointer flex flex-col overflow-hidden"
            >
              {/* Miniatura do produto */}
              <div className="relative w-full h-40 bg-slate-800 flex items-center justify-center">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-2"
                />
              </div>

              {/* Texto: título e preço */}
              <div className="p-4 flex flex-col gap-1">
                <p className="text-sm font-bold text-white line-clamp-2">
                  {product.title}
                </p>
                <p className="text-sm text-blue-400 font-semibold">
                  {product.price}
                </p>
                <p className="text-[11px] text-slate-400">
                  Compre na Amazon (link de afiliado)
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Botão direita */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full border border-blue-600 text-white hover:bg-blue-900 transition-all"
          aria-label="Próximo"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
