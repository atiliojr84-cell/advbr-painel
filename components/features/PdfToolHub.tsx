"use client";
import { useState, useRef } from "react";
import { FileUp, Split, FileText, LockKeyhole, Minimize2 } from "lucide-react";
import { unirPDFs, comprimirPorDPI, dividirPorTamanho, removerSenha } from "./PdfProcessor";

export default function PdfToolHub() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [inputVal, setInputVal] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    let result: any = null;

    try {
      if (selectedTool.id === "unir") {
        result = await unirPDFs(files);
        downloadFile(result, "unido.pdf");
      } else if (selectedTool.id === "dividir") {
        const pages = await dividirPorTamanho(files[0], Number(inputVal) || 3);
        pages.forEach((page, i) => downloadFile(page, `parte_${i + 1}.pdf`));
      } else if (selectedTool.id === "comprimir") {
        result = await comprimirPorDPI(files[0], (inputVal as any) || '200');
        downloadFile(result, "comprimido.pdf");
      } else if (selectedTool.id === "senha") {
        result = await removerSenha(files[0], inputVal);
        downloadFile(result, "desbloqueado.pdf");
      }
    } catch (err) { alert("Erro no processamento."); }
    setSelectedTool(null);
    setInputVal("");
  };

  const downloadFile = (data: Uint8Array, name: string) => {
    const blob = new Blob([data as any], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-8 px-4">
      <input type="file" ref={fileInputRef} className="hidden" multiple={selectedTool?.id === "unir"} onChange={handleFileChange} />
      {selectedTool && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 w-80">
            <h3 className="text-white font-bold mb-4">{selectedTool.id === "senha" ? "Senha" : selectedTool.id === "dividir" ? "Tamanho (MB)" : "DPI (600/200/100)"}</h3>
            <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="w-full p-2 mb-4 bg-slate-800 text-white rounded border border-slate-600" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full bg-blue-600 p-2 rounded text-white font-bold">Confirmar</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
        {[
          { id: "unir", title: "Unir", icon: FileUp },
          { id: "dividir", title: "Dividir", icon: Split },
          { id: "comprimir", title: "Comprimir", icon: Minimize2 },
          { id: "senha", title: "Senha", icon: LockKeyhole },
          { id: "converter", title: "Converter", icon: FileText },
        ].map((t) => (
          <button key={t.id} onClick={() => { setSelectedTool(t); if(t.id === "unir") fileInputRef.current?.click(); }} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500">
            <t.icon className="w-6 h-6 text-slate-400 mb-2" />
            <span className="text-xs text-slate-200">{t.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
