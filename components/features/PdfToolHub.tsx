// PdfToolHub.tsx
"use client";
// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Split, FileText } from "lucide-react";
import { unirPDFs, comprimirPDF, dividirPDF, removerSenhaPDF, converterParaWord } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: "unir", title: "Unir PDFs", desc: "Organize seu processo", icon: FileUp, help: "Transforme várias peças em um único arquivo. Exemplo: junte sua Petição Inicial, Procuração, Declaração de Hipossuficiência e Custas em um só PDF. Isso facilita a leitura do magistrado e evita erros de protocolo por falta de documentos." },
    { id: "dividir", title: "Dividir PDF", desc: "Adequação aos limites", icon: Split, help: "Divide arquivos grandes em partes menores. Dica: se o documento original possuir páginas escaneadas em resolução muito alta, o sistema pode não conseguir dividir abaixo do limite escolhido. Caso isso ocorra, utilize primeiro a ferramenta 'Comprimir' antes de dividir." },
    { id: "converter", title: "PDF p/ Word", desc: "Edição de texto", icon: FileText, help: "Precisa extrair o texto de uma decisão ou contrato em PDF? Esta ferramenta converte o texto do PDF para um documento .docx editável, preservando a estrutura básica de parágrafos e quebras de linha. ATENÇÃO: Esta conversão extrai apenas o texto, sem formatação, imagens ou tabelas. Você economiza horas digitando e pode aproveitar o conteúdo direto no seu editor de texto." },
  ];

  const handleProcess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const isAllPdf = files.every(file => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));

    if (!isAllPdf) {
      alert("Por favor, selecione apenas arquivos PDF.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const baseName = files[0].name.replace(/\.[^/.]+$/, "");
    setIsLoading(true);

    try {
      if (selectedTool.id === "unir") {
        const res = await unirPDFs(files);
        download(res, `${baseName}-unido.pdf`, "application/pdf");
      }
      else if (selectedTool.id === "dividir") {
        const limiteMB = Number(inputVal) || 3;
        const pages = await dividirPDF(files[0], limiteMB);

        const excedeu = pages.some(p => (p.length / (1024 * 1024)) > limiteMB);
        if (excedeu) {
          alert("Aviso: Algumas partes ainda excederam o limite escolhido. Tente usar a ferramenta 'Comprimir' no arquivo original primeiro.");
        }

        pages.forEach((p, i) => {
          const paddedIndex = (i + 1).toString().padStart(2, '0');
          download(p, `${baseName}-dividido-${paddedIndex}.pdf`, "application/pdf");
        });
      }
      else if (selectedTool.id === "converter") {
        const res = await converterParaWord(files[0]);
        download(res, `${baseName}-convertido.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao processar arquivo: ${err.message || "Verifique se o arquivo não está corrompido ou se a senha está correta."}`);
    } finally {
      setIsLoading(false);
      setSelectedTool(null);
      setInputVal("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const download = (data: Uint8Array, name: string, type: string) => {
    const blob = new Blob([data as any], { type: type });
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
      <input type="file" ref={fileInputRef} className="hidden" multiple={selectedTool?.id === "unir"} accept="application/pdf" onChange={handleProcess} />

      {/* AQUI ESTÁ A MUDANÇA PARA CENTRALIZAR O ÍCONE E O TÍTULO */}
      <div className="mb-8 flex justify-center"> {/* Adicionado flex justify-center */}
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-14 bg-red-600 rounded-md flex flex-col items-center justify-center shadow-lg border-2 border-red-700">
             <div className="absolute top-0 right-0 w-4 h-4 bg-red-800 rounded-bl-lg" />
             <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-bl-sm" />
             <span className="text-[10px] font-black text-white mt-1">PDF</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Otimizador Inteligente de PDF</h2>
            <div className="flex flex-col gap-0.5 mt-1">
              <p className="text-[11px] font-bold text-emerald-400 tracking-wide uppercase">PROCESSAMENTO 100% LOCAL (SEGURO E PRIVADO)</p>
              <p className="text-[10px] text-slate-400">Processamento 100% na sua máquina, visando a segurança e privacidade.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-6">
        {tools.map((t) => (
          <button key={t.id} onClick={() => { setSelectedTool(t); setInputVal(""); }} className="flex flex-col items-center p-4 bg-slate-900 rounded-2xl glow-effect w-40">
            <div className="p-3 bg-slate-950 rounded-full mb-3 text-slate-400"><t.icon className="w-8 h-8" /></div>
            <span className="font-bold text-white mb-1">{t.title}</span>
            <span className="text-[10px] text-slate-500 text-center">{t.desc}</span>
          </button>
        ))}
      </div>

      {selectedTool && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTool(null)} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-white text-xl font-bold">{selectedTool.title}</h3>
                <button onClick={() => setSelectedTool(null)} className="text-slate-500 hover:text-white">Fechar</button>
              </div>

              <div className="overflow-y-auto pr-2">
                <p className="text-slate-300 leading-relaxed mb-6">{selectedTool.help}</p>
                {selectedTool.id === "dividir" && (
                  <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="w-full p-4 bg-slate-950 text-white rounded-xl border border-slate-700 mb-4" placeholder="Limite em MB (ex: 5)" />
                )}
              </div>

              <button disabled={isLoading} onClick={() => fileInputRef.current?.click()} className={`w-full mt-6 py-4 rounded-xl shadow-lg shrink-0 ${isLoading ? 'bg-slate-600 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold`}>
                {isLoading ? "Processando..." : "Processar Arquivo"}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
