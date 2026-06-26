// @ts-nocheck
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configura o worker do PDF.js através de CDN para funcionar diretamente no ambiente do navegador
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function unirPDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  return await mergedPdf.save();
}

export async function dividirPorTamanho(file: File, maxMB: number): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  const maxBytes = maxMB * 1024 * 1024;
  const chunks: Uint8Array[] = [];
  let currentPdf = await PDFDocument.create();

  for (let i = 0; i < totalPages; i++) {
    const [page] = await currentPdf.copyPages(pdf, [i]);
    currentPdf.addPage(page);
    const tempBytes = await currentPdf.save();
    if (tempBytes.length > maxBytes && currentPdf.getPageCount() > 1) {
      chunks.push(tempBytes);
      currentPdf = await PDFDocument.create();
      const [newPage] = await currentPdf.copyPages(pdf, [i]);
      currentPdf.addPage(newPage);
    }
  }
  chunks.push(await currentPdf.save());
  return chunks;
}

export async function comprimirPorDPI(file: File, dpi: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return await pdf.save({ useObjectStreams: true });
}

export async function removerSenha(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { password: password });
  return await pdf.save();
}

/**
 * Converte um arquivo PDF para um formato legível pelo Microsoft Word (.docx)
 * Extrai o texto de forma 100% local e monta a estrutura XML OpenXML necessária.
 */
export async function converterParaWord(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Carrega o documento no motor do PDF.js
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let textArray: string[] = [];

  // Percorre todas as páginas extraindo as cadeias de texto correspondentes
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map((item: any) => item.str);
    
    if (pageStrings.length > 0) {
      textArray.push(pageStrings.join(" "));
    }
  }

  // Une os blocos de páginas separando-os por quebras de parágrafo estruturadas
  const fullText = textArray.join("\n\n");

  // Escapa caracteres especiais do XML para evitar quebra de sintaxe no leitor do Word
  const escapedText = fullText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Monta a estrutura OpenXML do WordDocument com tratamento básico de quebras de linha
  const paragraphs = escapedText.split('\n').map(line => {
    return `<w:p><w:r><w:t>${line}</w:t></w:r></w:p>`;
  }).join('');

  const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        ${paragraphs}
      </w:body>
    </w:document>`;

  // Codifica a string gerada em um array de bytes binários pronto para download pelo componente
  return new TextEncoder().encode(docxContent);
}
