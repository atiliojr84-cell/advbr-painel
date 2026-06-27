// PdfToolHub.tsx
"use client";
// @ts-nocheck
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Split, FileText } from "lucide-react";

// Importações das funções do PdfProcessor.ts
import { unirPDFs, dividirPDF, converterParaWord, dividirPDFPorPaginas } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [inputVal, setInputVal] = useState(""); 
  const [divisionType, setDivisionType] = useState<'mb' | 'pages'>('mb'); 
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: "unir", title: "Unir PDFs", desc: "Organize seu processo", icon: FileUp, help: "Transforme várias peças em um único arquivo. Exemplo: junte sua Petição Inicial, Procuração, Declaração de Hipossuficiência e Custas em um só PDF. Isso facilita a leitura do magistrado e evita erros de protocolo por falta de documentos." },
    { id: "dividir", title: "Dividir PDF", desc: "Adequação aos limites", icon: Split, help: "Divida arquivos grandes em partes menores, respeitando os limites dos sistemas de processo eletrônico. Escolha entre dividir por tamanho (MB) ou por número de páginas." }, 
    { id: "converter", title: "PDF p/ Word", desc: "Edição de texto", icon: FileText, help: "Precisa extrair o texto de uma decisão ou contrato em PDF? Esta ferramenta converte o texto do PDF para um documento .docx editável, preservando a estrutura básica de parágrafos e quebras de linha." },
  ];

  const download = (data: Uint8Array, filename: string, type: string) => {
    const dataToBlob = new Uint8Array(data);
    const blob = new Blob([dataToBlob], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
        const mergedPdf = await unirPDFs(files);
        download(mergedPdf, `${baseName}-unido.pdf`, "application/pdf");
      } 
      else if (selectedTool.id === "dividir") {
        let pages: Uint8Array[] = [];
        const limite = parseInt(inputVal);

        if (isNaN(limite) || limite <= 0) {
          alert("Por favor, insira um valor válido para o limite.");
          setIsLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        if (divisionType === 'mb') {
          pages = await dividirPDF(files[0], limite);
        } else if (divisionType === 'pages') {
          pages = await dividirPDFPorPaginas(files[0], limite);
        }

        if (pages.length > 0) {
          pages.forEach((p, i) => {
            download(p, `${baseName}-parte-${i + 1}.pdf`, "application/pdf");
          });
        } else {
          alert("Nenhuma parte foi gerada. Verifique o arquivo e os limites.");
        }
      }
      else if (selectedTool.id === "converter") {
        const res = await converterParaWord(files[0]);
        download(res, `${baseName}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      }
    } catch (error) {
      console.error("Erro ao processar PDF:", error);
      alert("Ocorreu um erro ao processar o arquivo. Verifique se o arquivo não está corrompido.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedTool(null); 
    }
  };

  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProcess}
        className="hidden"
        multiple={selectedTool?.id === "unir"}
        accept=".pdf" 
      />

      {/* NOVO TÍTULO COM ÍCONE VERMELHO */}
      <div className="w-full max-w-6xl mb-8 flex items-center justify-center gap-3">
        <FileText className="w-8 h-8 text-red-500" />
        <h2 className="text-3xl font-bold text-white">Edição de PDF</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            className="bg-slate-800 p-6 rounded-xl shadow-lg cursor-pointer hover:bg-slate-700 transition-colors duration-200 flex flex-col items-center text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTool(tool)}
          >
            <tool.icon className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">{tool.title}</h3>
            <p className="text-slate-400 text-sm">{tool.desc}</p>
          </motion.div>
        ))}
      </div>

      {selectedTool && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-white text-xl font-bold">{selectedTool.title}</h3>
                <button onClick={() => setSelectedTool(null)} className="text-slate-500 hover:text-white">Fechar</button>
              </div>

              <div className="overflow-y-auto pr-2">
                <p className="text-slate-300 leading-relaxed mb-6">{selectedTool.help}</p>

                {selectedTool.id === "dividir" && (
                  <>
                    <h4 className="text-white text-lg font-bold mb-3">Defina o Limite para Divisão</h4>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => { setDivisionType('mb'); setInputVal(""); }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${divisionType === 'mb' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      >
                        Por Tamanho (MB)
                      </button>
                      <button
                        onClick={() => { setDivisionType('pages'); setInputVal(""); }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${divisionType === 'pages' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      >
                        Por Páginas
                      </button>
                    </div>

                    {divisionType === 'mb' && (
                      <>
                        <input
                          type="number"
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          className="w-full p-4 bg-slate-950 text-white rounded-xl border border-slate-700 mb-3"
                          placeholder="Ex: 3 (para 3 MB)"
                        />
                        <div className="flex gap-2 mb-4">
                          {[3, 5, 10].map(mb => (
                            <button
                              key={mb}
                              onClick={() => setInputVal(mb.toString())}
                              className="px-3 py-1 rounded-md bg-slate-700 text-slate-300 text-sm hover:bg-slate-600"
                            >
                              {mb} MB
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {divisionType === 'pages' && (
                      <>
                        <input
                          type="number"
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          className="w-full p-4 bg-slate-950 text-white rounded-xl border border-slate-700 mb-3"
                          placeholder="Ex: 50 (para 50 páginas)"
                        />
                        <div className="flex gap-2 mb-4">
                          {[20, 50, 100].map(pages => (
                            <button
                              key={pages}
                              onClick={() => setInputVal(pages.toString())}
                              className="px-3 py-1 rounded-md bg-slate-700 text-slate-300 text-sm hover:bg-slate-600"
                            >
                              {pages} Páginas
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
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
