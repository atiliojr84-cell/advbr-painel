import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADVBR.info - Suporte Tecnológico Jurídico",
  description: "Diagnóstico, ferramentas PDF e monitoramento de tribunais para advogados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0b0f19] text-slate-300 antialiased overflow-x-hidden selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}
