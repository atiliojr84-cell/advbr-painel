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
    { id: "converter", title: "Converter", desc: "PDF p/ Word", icon: FileText, help: "Extrai o conteúdo do seu PDF para um formato editável (.docx), preservando a estrutura para edição." },
  ];

  const handleProcess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // TRAVA DE SEGURANÇA: Bloqueia qualquer arquivo que não seja PDF
    const files = Array.from(e.target.files);
    const isAllPdf = files.every(file => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
    
    if (!isAllPdf) {
      alert("Por favor, selecione apenas arquivos PDF.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const tool = selectedTool;
    try {
      if (tool.id === "unir") { 
        const res = await unirPDFs(files); 
        download(res, "unido.pdf", "application/pdf"); 
      }
      else if (tool.id === "dividir") { 
        const pages = await dividirPorTamanho(files[0], Number(inputVal) || 3); 
        pages.forEach((p, i) => download(p, `parte_${i + 1}.pdf`, "application/pdf")); 
      }
      else if (tool.id === "comprimir") { 
        const res = await comprimirPorDPI(files[0], (inputVal as "350" | "200" | "150") || '200'); 
        download(res, "otimizado.pdf", "application/pdf"); 
      }
      else if (tool.id === "senha") { 
        const res = await removerSenha(files[0], inputVal); 
        download(res, "desbloqueado.pdf", "application/pdf"); 
      }
      else if (tool.id === "converter") { 
        const res = await converterParaWord(files[0]); 
        download(res, "convertido.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"); 
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao processar arquivo. Verifique se o arquivo não está corrompido ou se a senha está correta.");
    } finally {
      setSelectedTool(null); 
      setInputVal("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const download = (data: Uint8Array, name: string, type: string) => {
    const blob = new Blob([data.buffer as ArrayBuffer], { type: type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  };

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto">
      {/* INPUT FILTRADO PARA MAC E WINDOWS */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple={selectedTool?.id === "unir"} 
        accept="application/pdf" 
        onChange={handleProcess} 
      />
      
      <div className="mb-8 flex items-center gap-4">
        <div className="relative w-12 h-14 bg-red-600 rounded-md flex flex-col items-center justify-center shadow-lg border-2 border-red-700">
           <div className="absolute top-0 right-0 w-4 h-4 bg-red-800 rounded-bl-lg" />
           <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-bl-sm" />
           <span className="text-[10px] font-black text-white mt-1">PDF</span>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-white">Otimizador Inteligente</h2>
          <div className="flex items-center gap-1.5 text-emerald-400 mt-1">
            <p className="text-[11px] font-medium tracking-wide uppercase">Processamento 100% local (Seguro e Privado)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {tools.map((t) => (
          <button 
            key={t.id} 
            onClick={() => { setSelectedTool(t); setInputVal(""); }} 
            className="flex flex-col items-center p-4 bg-slate-900 rounded-2xl glow-effect"
          >
            <div className="p-3 bg-slate-950 rounded-full mb-3 text-slate-400"><t.icon className="w-8 h-8" /></div>
            <span className="font-bold text-white mb-1">{t.title}</span>
            <span className="text-[10px] text-slate-500 text-center">{t.desc}</span>
          </button>
        ))}
      </div>

      {selectedTool && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTool(null)} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.3, ease: "easeOut" }} onClick={(e) => e.stopPropagation()} className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-bold">{selectedTool.title}</h3>
                <button onClick={() => setSelectedTool(null)} className="text-slate-500 hover:text-white">Fechar</button>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">{selectedTool.help}</p>
              
              {selectedTool.id === "comprimir" && (
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[{ label: "Mínima", val: "350" }, { label: "Média", val: "200" }, { label: "Máxima", val: "150" }].map((opt) => (
                      <button key={opt.val} onClick={() => setInputVal(opt.val)} className={`p-5 rounded-xl border-2 ${inputVal === opt.val ? "bg-blue-600 border-blue-400" : "bg-slate-950 border-slate-700"}`}>
                        <span className="text-lg font-bold text-white">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedTool.id === "dividir" && (
                <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="w-full p-4 bg-slate-950 text-white rounded-xl border border-slate-700" placeholder="Limite em MB (ex: 5)" />
              )}

              {selectedTool.id === "senha" && (
                <input type="password" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="w-full p-4 bg-slate-950 text-white rounded-xl border border-slate-700" placeholder="Senha do PDF..." />
              )}
              
              <button onClick={() => fileInputRef.current?.click()} className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">Processar Arquivo</button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
