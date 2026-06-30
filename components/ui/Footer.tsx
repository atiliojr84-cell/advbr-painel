// components/ui/Footer.tsx
"use client"; // ADICIONE ESTA LINHA AQUI

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-8 px-4 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo/Nome do Site - Replicando o do Header */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          {/* Se você tiver uma imagem de logo, substitua o texto abaixo */}
          {/* <Image src="/path/to/your/logo.png" alt="advbr.info Logo" width={30} height={30} /> */}
          advbr.<span className="text-blue-500">info</span>
        </Link>

        {/* Texto de Registro */}
        <p className="text-sm text-center md:text-right">
          Site registrado para <strong className="text-white">advbr.info</strong>. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
