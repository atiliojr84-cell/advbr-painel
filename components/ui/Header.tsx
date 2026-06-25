import { AlertCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-1">
          ADVBR<span className="text-white">.info</span>
        </h1>
        <p className="text-sm text-slate-400">Suporte Tecnológico Integrado para Profissionais do Direito</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <p className="text-[11px] text-slate-500 leading-tight">
          Nos ajude a monitorar os portais comunicando o seu problema.
        </p>
        <button className="w-full sm:w-auto bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-800/60 text-slate-300 hover:text-red-400 text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-sm whitespace-nowrap">
          <AlertCircle size={16} /> Estou com problema!
        </button>
      </div>
    </header>
  );
}
