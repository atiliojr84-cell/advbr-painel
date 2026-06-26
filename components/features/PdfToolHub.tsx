"use client";

import { useState, useRef } from "react";
import { FileUp, Split, FileText, LockKeyhole, Minimize2 } from "lucide-react";
import { unirPDFs, otimizarPDF, dividirPorTamanho, removerSenha } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [maxMB, setMaxMB] = useState(3); // Padrão 3MB
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    let result: Uint8Array | Uint8Array[] | null = null;

    try {
      if (selectedTool.id === "unir") {
        result = await unirPDFs(files);
        downloadFile(result as Uint8Array, "unido.pdf");
      } else if (selectedTool.id === "dividir") {
        const pages = await dividirPorTamanho(files[0], maxMB);
        pages.forEach((page, i) => downloadFile(page, `parte_${i + 1}.pdf`));
      } else if (selectedTool.id === "otimizar") {
        result = await otimizarPDF(files[0]);
        downloadFile(result as Uint8Array, "otimizado.pdf");
      } else if (selectedTool.id === "senha") {
        result = await removerSenha(files[0], password);
        downloadFile(result as Uint8Array, "desbloqueado.pdf");
      }
    } catch (error) {
      alert("Erro ao processar: verifique o arquivo ou a senha.");
    }
    
    setSelectedTool(null);
    setPassword("");
  };

  const downloadFile = (data: Uint8Array, filename: string) => {
    const blob = new Blob([data as any], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tools = [
    { id: "unir", title: "Unir", icon: FileUp },
    { id: "dividir", title: "Dividir", icon: Split },
    { id: "otimizar", title: "Comprimir", icon: Minimize2 },
    { id: "senha", title: "Senha", icon: LockKeyhole },
    { id: "converter", title: "Converter", icon: FileText },
  ];

  return (
    <section className="py-8 px-4">
      <input type="file" ref={fileInputRef} className="hidden" multiple={selectedTool?.id === "unir"} onChange={handleFileChange} />
      
      {/* Modal Inteligente para Dividir ou Senha */}
      {selectedTool && (selectedTool.id === "senha" || selectedTool.id === "dividir") && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 w-80 shadow-2xl">
            <h3 className="text-white font-bold mb-4">{selectedTool.id === "senha" ? "Senha do PDF" : "Limite de Tamanho (MB)"}</h3>
            {selectedTool.id === "senha" ? (
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 bg-slate-800 text-white rounded border border-slate-600" />
            ) : (
              <input type="number" value={maxMB} onChange={(e) => setMaxMB(Number(e.target.value))} className="w-full p-2 mb-4 bg-slate-800 text-white rounded border border-slate-600" />
            )}
            <button onClick={() => { if(selectedTool.id !== "senha") setSelectedTool(selectedTool); fileInputRef.current?.click(); }} className="w-full bg-blue-600 p-2 rounded text-white font-bold hover:bg-blue-500">Confirmar</button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
           <div className="relative w-8 h-10 bg-red-600 rounded-sm flex items-center justify-center shadow-md">
             <span className="text-[9px] font-black text-white">PDF</span>
           </div>
           Ferramentas de PDF
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {tools.map((tool) => (
            <button key={tool.id} onClick={() => { setSelectedTool(tool); if(tool.id !== "senha" && tool.id !== "dividir") fileInputRef.current?.click(); }} 
              className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500 transition-all active:scale-95">
              <tool.icon className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-200">{tool.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
