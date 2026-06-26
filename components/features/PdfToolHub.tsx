"use client";
import { useState, useRef } from "react";
import { FileUp, Split, FileText, LockKeyhole, Minimize2 } from "lucide-react";
import { unirPDFs, comprimirPorDPI, dividirPorTamanho, removerSenha, converterParaWord } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [inputVal, setInputVal] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: "unir", title: "Unir", desc: "Juntar arquivos", icon: FileUp, help: "Esta ferramenta combina múltiplos arquivos PDF em um único documento sequencial." },
    { id: "dividir", title: "Dividir", desc: "Fatiar por MB", icon: Split, help: "Divide arquivos grandes em partes menores com um limite de peso definido." },
    { id: "comprimir", title: "Comprimir", desc: "Otimizar DPI", icon: Minimize2, help: "Reduz o peso do arquivo mantendo a legibilidade." },
    { id: "senha", title: "Senha", desc: "Remover proteção", icon: LockKeyhole, help: "Remove a camada de proteção de PDFs bloqueados." },
    { id: "converter", title: "Converter", desc: "PDF p/ Word", icon: FileText, help: "Extrai o conteúdo do seu PDF para um formato editável (.doc)." },
  ];

  const handleProcess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    try {
      if (selectedTool.id === "unir") { const res = await unirPDFs(files); download(res, "unido.pdf"); }
      else if (selectedTool.id === "dividir") { const pages = await dividirPorTamanho(files[0], Number(inputVal) || 3); pages.forEach((p, i) => download(p, `parte_${i + 1}.pdf`)); }
      else if (selectedTool.id === "comprimir") { const res = await comprimirPorDPI(files[0], (inputVal as any) || '200'); download(res, "otimizado.pdf"); }
      else if (selectedTool.id === "senha") { const res = await removerSenha(files[0], inputVal); download(res, "desbloqueado.pdf"); }
      else if (selectedTool.id === "converter") { const res = await converterParaWord(files[0]); download(res, "convertido.doc"); }
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
      
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-14 bg-red-600 rounded-md flex flex-col items-center justify-center shadow-lg border-2 border-red-700">
           <span className="text-[10px] font-black text-white">PDF</span>
           <span className="text-[6px] font-bold text-white">.doc</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Otimizador Inteligente</h2>
          <p className="text-slate-400 text-sm">Ferramentas essenciais para o seu escritório.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {tools.map((t) => (
          <button 
            key={t.id} 
            onClick={() => { setSelectedTool(t); if(t.id === "unir") fileInputRef.current?.click(); }} 
            /* AQUI A MUDANÇA: Substituí as classes de borda pela classe global glow-effect */
            className="flex flex-col items-center p-4 bg-slate-900 rounded-2xl glow-effect"
          >
            <div className="p-3 bg-slate-950 rounded-full mb-3 text-slate-400">
              <t.icon className="w-8 h-8" />
            </div>
            <span className="font-bold text-white mb-1">{t.title}</span>
            <span className="text-[10px] text-slate-500 text-center">{t.desc}</span>
          </button>
        ))}
      </div>

      {selectedTool && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl">
            <h3 className="text-white text-xl font-bold mb-4">{selectedTool.title}</h3>
            <p className="text-slate-300 leading-relaxed mb-6">{selectedTool.help}</p>
            
            {selectedTool.id !== "unir" && selectedTool.id !== "converter" && (
              <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} 
                className="w-full p-4 mb-6 bg-slate-950 text-white rounded-xl border border-slate-700" 
                placeholder={selectedTool.id === "dividir" ? "Tamanho (MB)" : selectedTool.id === "comprimir" ? "DPI (600/200/100)" : "Senha"} />
            )}
            
            <div className="flex gap-4">
              <button onClick={() => setSelectedTool(null)} className="flex-1 py-3 text-slate-400">Cancelar</button>
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white">Processar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
