import { NextResponse } from 'next/server';

export async function GET() {
  // Retorno estático temporário para garantir que a build passe
  return NextResponse.json({ 
    noticias: [
      { texto: "ADVBR.INFO: Soluções Tecnológicas para Profissionais do Direito", url: "#" },
      { texto: "Infraestrutura de TI e Segurança Jurídica 24/7", url: "#" }
    ] 
  });
}
