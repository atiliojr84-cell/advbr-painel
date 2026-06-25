import Header from "../components/ui/Header";
import Ticker from "../components/ui/Ticker";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f19]">
      {/* Ticker de Notícias no topo absoluto */}
      <Ticker />
      
      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <Header />

        {/* Aqui vão entrar os outros módulos em breve */}
      </main>
    </div>
  );
}
