// PdfToolHub.tsx
"use client";
// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Split, FileText } from "lucide-react";
// REMOVER ESTA LINHA: import * as pdfjsLib from 'pdfjs-dist'; // <--- ESTA LINHA DEVE SER REMOVIDA

// Importações das funções do PdfProcessor.ts
// Certifique-se de que todas as funções necessárias estão aqui, incluindo dividirPDFPorPaginas
import { unirPDFs, comprimirPDF, dividirPDF, removerSenhaPDF, converterParaWord, dividirPDFPorPaginas } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [inputVal, setInputVal] = useState(""); // Valor para MB ou Páginas
  const [divisionType, setDivisionType] = useState<'mb' | 'pages'>('mb'); // Novo estado para tipo de divisão
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // REMOVER ESTE useEffect:
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  //   }
  // }, []);

  const tools = [
    { id: "unir", title: "Unir PDFs", desc: "Organize seu processo", icon: FileUp, help: "Transforme várias peças em um único arquivo. Exemplo: junte sua Petição Inicial, Procuração, Declaração de Hipossuficiência e Custas em um só PDF. Isso facilita a leitura do magistrado e evita erros de protocolo por falta de documentos." },
    { id: "dividir", title: "Dividir PDF", desc: "Adequação aos limites", icon: Split, help: "Divida arquivos grandes em partes menores, respeitando os limites dos sistemas de processo eletrônico. Escolha entre dividir por tamanho (MB) ou por número de páginas." }, // Texto de ajuda atualizado
    { id: "converter", title: "PDF p/ Word", desc: "Edição de texto", icon: FileText, help: "Precisa extrair o texto de uma decisão ou contrato em PDF? Esta ferramenta converte o texto do PDF para um documento .docx editável, preservando a estrutura básica de parágrafos e quebras de linha. ATENÇÃO: Esta conversão extrai apenas o texto, sem formatação, imagens ou tabelas. Você economiza horas digitando e pode aproveitar o conteúdo direto no seu editor de texto." },
  ];

  const download = (data: Uint8Array, filename: string, type: string) => {
    // Cria uma nova ArrayBuffer a partir do Uint8Array para compatibilidade com Blob
    const blob = new Blob([data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)], { type: type });
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
        const res = await unirPDFs(files);
        download(res, `${baseName}-unido.pdf`, "application/pdf");
      }
      else if (selectedTool.id === "dividir") {
        let pages: Uint8Array[] = [];
        if (divisionType === 'mb') {
          const limiteMB = Number(inputVal) || 3;
          pages = await dividirPDF(files[0], limiteMB); // Usando a função existente
          const excedeu = pages.some(p => (p.length / (1024 * 1024)) > limiteMB);
          if (excedeu) {
            alert("Aviso: Algumas partes ainda excederam o limite de MB escolhido. Isso pode ocorrer com páginas muito densas ou imagens de alta resolução. Considere dividir por número de páginas ou usar um limite maior.");
          }
        } else { // divisionType === 'pages'
          const limitePaginas = Number(inputVal) || 10;
          pages = await dividirPDFPorPaginas(files[0], limitePaginas);
        }

        pages.forEach((p, i) => {
          const paddedIndex = (i + 1).toString().padStart(2, '0');
          download(p, `${baseName}-dividido-${paddedIndex}.pdf`, "application/pdf");
        });
      }
      else if (selectedTool.id === "converter") {
        const res = await converterParaWord(files[0]);
        download(res, `${baseName}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      }
    } catch (error: any) {
      console.error("Erro ao processar PDF:", error);
      alert(`Ocorreu um erro: ${error.message || "Erro desconhecido"}`);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedTool(null); // Fecha o modal após o processamento
    }
  };

  return (
    <section className="relative z-10 py-16 px-4 md:px-8 bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Otimizador Inteligente de PDF</h2>
        </div>
      </div>

      <p className="text-slate-400 text-center max-w-2xl mx-auto">
        Ferramentas essenciais para advogados: una, divida e converta PDFs com facilidade, otimizando seu tempo e garantindo a conformidade com os requisitos dos tribunais.
      </p>

      <div className="flex justify-center flex-wrap gap-6 mb-12"> {/* Centraliza os botões */}
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool)}
            className="w-40 h-40 bg-slate-800 hover:bg-slate-700 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white text-center p-4 transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105 border border-slate-700"
          >
            <tool.icon size={36} className="mb-3 text-blue-400" />
            <span className="font-semibold text-lg">{tool.title}</span>
            <span className="text-sm text-slate-400 mt-1">{tool.desc}</span>
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
                        <p className="text-slate-400 text-sm mb-4">
                          Defina o tamanho máximo de cada arquivo PDF resultante em Megabytes. Essencial para sistemas de processo eletrônico com limites de upload.
                        </p>
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
                        <p className="text-slate-400 text-sm mb-4">
                          Defina o número máximo de páginas para cada arquivo PDF resultante. Útil para sistemas que limitam a quantidade de páginas por documento.
                        </p>
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
