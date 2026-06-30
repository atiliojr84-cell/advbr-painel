"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"; // Importado ShieldCheck
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
    <section className="my-12 px-4"> {/* Adicionado px-4 para padding lateral */}
      {/* Novo Título e Selo de Segurança */}
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        <span className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-7 h-7 text-emerald-500" /> {/* Escudinho verde */}
          Equipamentos e Soluções de TI Selecionados e Testados para Advogados e Profissionais da Justiça
        </span>
      </h2>

      {/* Novo Corpo do Texto Explicativo */}
      <p className="max-w-4xl mx-auto text-slate-300 leading-relaxed mb-8 text-center">
        No dia a dia do ambiente jurídico, a tecnologia é uma aliada essencial. Por isso, nossa equipe de especialistas se dedica a uma <strong>seleção e validação rigorosa</strong> de equipamentos e soluções de TI, focando nas necessidades exclusivas de advogados e demais profissionais da justiça.
        <br /><br />
        Cada produto é <strong>cuidadosamente testado e avaliado</strong> por sua qualidade, desempenho, compatibilidade com as ferramentas jurídicas e, principalmente, pela <strong>segurança e confiabilidade</strong>. Verificamos a procedência, a reputação da marca e a integridade dos links, garantindo que você tenha acesso a recomendações seguras e sem riscos de fraudes.
        <br /><br />
        Com a nossa expertise, você investe em tecnologia que realmente impulsiona sua produtividade e protege seus dados, sem perder tempo pesquisando ou se preocupando com a escolha certa. Asseguramos que as recomendações são sempre atualizadas e alinhadas com as melhores práticas do mercado, pensadas para otimizar o seu trabalho.
      </p>

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
                {/* Removida a menção a "Amazon Afiliados" */}
                {/* <p className="text-[11px] text-slate-400">
                  Compre na Amazon (link de afiliado)
                </p> */}
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
