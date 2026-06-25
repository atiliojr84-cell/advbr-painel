import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Ticker from "@/components/ui/Ticker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Painel AdvBR",
  description: "Hub de ferramentas jurídicas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Ticker />
        {children}
      </body>
    </html>
  );
}
