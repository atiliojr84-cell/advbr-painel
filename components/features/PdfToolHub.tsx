// PdfToolHub.tsx
"use client";
// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Split, FileText } from "lucide-react";

// Importações das funções do PdfProcessor.ts
import { unirPDFs, comprimirPDF, dividirPDF, removerSenhaPDF, converterParaWord, dividirPDFPorPaginas } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [inputVal, setInputVal] = useState(""); // Valor para MB ou Páginas
  const [divisionType, setDivisionType] = useState<'mb' | 'pages'>('mb'); // Novo estado para tipo de divisão
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: "unir", title: "Unir PDFs", desc: "Organize seu processo", icon: FileUp, help: "Transforme várias peças em um único arquivo. Exemplo: junte sua Petição Inicial, Procuração, Declaração de Hipossuficiência e Custas em um só PDF. Isso facilita a leitura do magistrado e evita erros de protocolo por falta de documentos." },
    { id: "dividir", title: "Dividir PDF", desc: "Adequação aos limites", icon: Split, help: "Divida arquivos grandes em partes menores, respeitando os limites dos sistemas de processo eletrônico. Escolha entre dividir por tamanho (MB) ou por número de páginas." }, // Texto de ajuda atualizado
    { id: "converter", title: "PDF p/ Word", desc: "Edição de texto", icon: FileText, help: "Precisa extrair o texto de uma decisão ou contrato em PDF? Esta ferramenta converte o texto do PDF para um documento .docx editável, preservando a estrutura básica de parágrafos e quebras de linha. ATENÇÃO: Esta conversão extrai apenas o texto, sem formatação, imagens ou tabelas. Você economiza horas digitando e pode aproveitar o conteúdo direto no seu editor de texto." },
  ];

  const download = (data: Uint8Array, filename: string, type: string) => {
    const blob = new Blob([data], { type: type }); // Corrigido para passar Uint8Array diretamente
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
      // CORREÇÃO AQUI: Garante que a string do alert esteja completa e sem caracteres estranhos
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
            alert("Atenção: Um ou mais arquivos resultantes excederam o limite de MB definido. Isso pode ocorrer com PDFs muito densos ou imagens de alta resolução. Considere dividir por número de páginas ou usar um limite maior.");
          }
        } else { // divisionType === 'pages'
          const limitePaginas = Number(inputVal) || 50;
          pages = await dividirPDFPorPaginas(files[0], limitePaginas);
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
      // Adicione aqui outras ferramentas conforme necessário
    } catch (error) {
      console.error("Erro ao processar PDF:", error);
      alert("Ocorreu um erro ao processar o arquivo. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedTool(null); // Fecha o modal após o processamento
    }
  };

  return (
    <section className="w-full py-12 bg-slate-950 text-white flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-4xl font-extrabold mb-8 text-center">Ferramentas PDF para Advogados</h2>
      <p className="text-lg text-slate-400 mb-12 text-center max-w-2xl">
        Simplifique sua rotina jurídica com nossas ferramentas de PDF. Unir, dividir e converter documentos nunca foi tão fácil.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool)}
            className="flex flex-col items-center p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-600 hover:shadow-lg transition-all duration-300"
          >
            <tool.icon className="w-10 h-10 text-blue-500 mb-3" />
            <span className="text-xl font-bold text-white">{tool.title}</span>
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
