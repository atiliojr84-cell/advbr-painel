"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Split, FileText, LockKeyhole, Minimize2 } from "lucide-react";
import { unirPDFs, comprimirPorDPI, dividirPorTamanho, removerSenha, converterParaWord } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [inputVal, setInputVal] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: "unir", title: "Unir", desc: "Juntar arquivos", icon: FileUp, help: "Esta ferramenta combina múltiplos arquivos PDF em um único documento sequencial." },
    { id: "dividir", title: "Dividir", desc: "Fatiar por MB", icon: Split, help: "Divide arquivos grandes em partes menores com um limite de tamanho definido." },
    { id: "comprimir", title: "Comprimir", desc: "Otimizar DPI", icon: Minimize2, help: "Reduz o tamanho do arquivo mantendo a legibilidade." },
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
        <div className="relative w-12 h-14 bg-red-600 rounded-md flex flex-col items-center justify-center shadow-lg border-2 border-red-700">
           <div className="absolute top-0 right-0 w-4 h-4 bg-red-800 rounded-bl-lg" />
           <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-bl-sm" />
           <span className="text-[10px] font-black text-white mt-1">PDF</span>
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
            onClick={() => { setSelectedTool(t); setInputVal(""); }} 
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
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTool(null)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-bold">{selectedTool.title}</h3>
                <button onClick={() => setSelectedTool(null)} className="text-slate-500 hover:text-white">Fechar</button>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6">{selectedTool.help}</p>
              
              {selectedTool.id === "comprimir" && (
                <div className="mb-6">
                  <label className="block text-slate-400 text-sm mb-3">Escolha o nível de compressão:</label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: "Mínima", val: "350", desc: "Qualidade Máxima" },
                      { label: "Média", val: "200", desc: "Equilibrado" },
                      { label: "Máxima", val: "150", desc: "Menor tamanho" }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setInputVal(opt.val)}
                        className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                          inputVal === opt.val 
                          ? "bg-blue-600 border-blue-500 text-white" 
                          : "bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {opt.label}<br/><span className="text-[9px] opacity-70">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-white">Dica:</strong> Quanto maior a compressão, menor o tamanho do arquivo, mas a qualidade visual diminui. Sempre confira o resultado final.
                    </p>
                  </div>
                </div>
              )}
              
              {(selectedTool.id === "dividir" || selectedTool.id === "senha") && (
                <input 
                  type={selectedTool.id === "senha" ? "password" : "text"} 
                  value={inputVal} 
                  onChange={(e) => setInputVal(e.target.value)} 
                  className="w-full p-4 mb-6 bg-slate-950 text-white rounded-xl border border-slate-700" 
                  placeholder={selectedTool.id === "dividir" ? "Tamanho máximo (MB)" : "Senha do documento"} 
                />
              )}
              
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                Processar Arquivo
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
