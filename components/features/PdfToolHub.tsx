"use client";

import { useState, useRef } from "react";
import { FileUp, FileSplit, FileText, LockKeyhole, Minimize2 } from "lucide-react";
import Modal from "../ui/Modal";
import { unirPDFs, otimizarPDF } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    let result: Uint8Array;

    if (selectedTool.id === "unir") {
      result = await unirPDFs(files);
      downloadFile(result, "documento_unido.pdf");
    } else if (selectedTool.id === "otimizar") {
      result = await otimizarPDF(files[0]);
      downloadFile(result, "documento_otimizado.pdf");
    }
    
    setSelectedTool(null);
  };

  const downloadFile = (data: Uint8Array, filename: string) => {
    const blob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const tools = [
    { id: "unir", title: "Unir PDFs", icon: FileUp },
    { id: "dividir", title: "Dividir PDF", icon: FileSplit },
    { id: "converter", title: "Converter", icon: FileText },
    { id: "senha", title: "Remover Senha", icon: LockKeyhole },
    { id: "otimizar", title: "Otimizar PDF", icon: Minimize2 },
  ];

  return (
    <section className="py-8 px-4">
      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
      <div className="max-w-5xl mx-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
           <div className="relative w-8 h-10 bg-red-600 rounded-sm flex items-center justify-center shadow-md">
             <span className="text-[9px] font-black text-white">PDF</span>
           </div>
           Ferramentas de PDF
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {tools.map((tool) => (
            <button key={tool.id} onClick={() => { setSelectedTool(tool); fileInputRef.current?.click(); }} 
              className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500 transition-all">
              <tool.icon className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-200">{tool.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
