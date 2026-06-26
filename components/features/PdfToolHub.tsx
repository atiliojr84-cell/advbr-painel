"use client";
import { useState, useRef } from "react";
import { FileUp, Split, FileText, LockKeyhole, Minimize2, FileType } from "lucide-react";
import { unirPDFs, comprimirPorDPI, dividirPorTamanho, removerSenha } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [inputVal, setInputVal] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: "unir", title: "Unir", desc: "Juntar vários arquivos", icon: FileUp },
    { id: "dividir", title: "Dividir", desc: "Fatiar por tamanho (MB)", icon: Split },
    { id: "comprimir", title: "Comprimir", desc: "Otimizar DPI/Qualidade", icon: Minimize2 },
    { id: "senha", title: "Senha", desc: "Remover proteção", icon: LockKeyhole },
    { id: "converter", title: "Word", desc: "PDF para Docx", icon: FileType },
  ];

  const handleProcess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    try {
      if (selectedTool.id === "unir") {
        const res = await unirPDFs(files);
        download(res, "unido.pdf");
      } else if (selectedTool.id === "dividir") {
        const pages = await dividirPorTamanho(files[0], Number(inputVal) || 3);
        pages.forEach((p, i) => download(p, `parte_${i + 1}.pdf`));
      } else if (selectedTool.id === "comprimir") {
        const res = await comprimirPorDPI(files[0], (inputVal as any) || '200');
        download(res, "otimizado.pdf");
      } else if (selectedTool.id === "senha") {
        const res = await removerSenha(files[0], inputVal);
        download(res, "desbloqueado.pdf");
      }
    } catch { alert("Erro ao processar arquivo."); }
    setSelectedTool(null); setInputVal("");
  };

  const download = (data: Uint8Array, name: string) => {
    const url = URL.createObjectURL(new Blob([data as any]));
    const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  };

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto">
      <input type="file" ref={fileInputRef} className="hidden" multiple={selectedTool?.id === "unir"} onChange={handleProcess} />
      
      {/* Título do Módulo com o ícone customizado */}
      <div className="mb-8 flex items-center gap-4">
        <div className="relative w-12 h-14 bg-red-600 rounded-md flex flex-col items-center justify-center shadow-lg border-2 border-red-700">
           <span className="text-[10px] font-black text-white tracking-tighter">PDF</span>
           <span className="text-[6px] font-bold text-white mt-0.5">.doc</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Otimizador Inteligente de PDF</h2>
          <p className="text-slate-400 text-sm">Ferramentas essenciais para o dia a dia do seu escritório.</p>
        </div>
      </div>

      {/* Grid de Ferramentas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {tools.map((t) => (
          <button key={t.id} onClick={() => { setSelectedTool(t); if(t.id === "unir") fileInputRef.current?.click(); }} 
            className="flex flex-col items-center group p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all">
            <div className="p-3 bg-slate-950 rounded-full mb-3 group-hover:text-blue-500 text-slate-400">
              <t.icon className="w-8 h-8" />
            </div>
            <span className="font-bold text-white mb-1">{t.title}</span>
            <span className="text-[10px] text-slate-500 text-center">{t.desc}</span>
          </button>
        ))}
      </div>

      {{/* Modal Inteligente de Ajustes */}
      {selectedTool && selectedTool.id !== "unir" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl">
            <h3 className="text-white text-xl font-bold mb-2">
              {selectedTool.id === "senha" ? "Remover Senha" : 
               selectedTool.id === "dividir" ? "Dividir PDF" :
               selectedTool.id === "comprimir" ? "Comprimir PDF" : "Converter para Word"}
            </h3>
            
            <p className="text-slate-400 mb-6 text-sm">
              {selectedTool.id === "senha" ? "Digite a senha do arquivo para desbloqueá-lo:" : 
               selectedTool.id === "dividir" ? "Informe o tamanho máximo (MB) por arquivo:" :
               selectedTool.id === "comprimir" ? "Escolha a qualidade (600, 200 ou 100 DPI):" :
               "O arquivo será convertido para o formato .docx (Word). Confirme para iniciar:"}
            </p>

            {/* O campo de input só aparece se não for conversão simples */}
            {selectedTool.id !== "converter" && (
              <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} 
                className="w-full p-4 mb-6 bg-slate-950 text-white rounded-xl border border-slate-700" 
                placeholder={selectedTool.id === "senha" ? "Senha" : "Ex: 3"} />
            )}

            <div className="flex gap-4">
              <button onClick={() => setSelectedTool(null)} className="flex-1 py-3 text-slate-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500 transition-all">
                {selectedTool.id === "converter" ? "Iniciar Conversão" : "Processar"}
              </button>
            </div>
          </div>
        </div>
      )}
