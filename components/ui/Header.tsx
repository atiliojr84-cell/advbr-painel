import { AlertCircle } from "lucide-react";
import ProblemReporter from "../features/ProblemReporter";

export default function Header() {
  return (
    <header className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-1">
          adv<span className="text-blue-500">BR</span>.info
        </h1>
        <p className="text-sm text-slate-400">Suporte Tecnológico Integrado para Profissionais do Direito</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
        <p className="hidden sm:block text-[11px] text-slate-500 leading-tight max-w-[180px] text-right">
          Nos ajude a monitorar os portais comunicando o seu problema.
        </p>
        
        <ProblemReporter />
      </div>
    </header>
  );
}
