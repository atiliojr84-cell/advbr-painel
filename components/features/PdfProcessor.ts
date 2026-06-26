// @ts-nocheck
import { PDFDocument } from 'pdf-lib';

export async function unirPDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const arrayBuffer = await (file as any).arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  return await mergedPdf.save();
}

export async function dividirPorTamanho(file: File, maxMB: number): Promise<Uint8Array[]> {
  const arrayBuffer = await (file as any).arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  const maxBytes = maxMB * 1024 * 1024;
  
  const chunks: Uint8Array[] = [];
  let currentPdf = await PDFDocument.create();

  for (let i = 0; i < totalPages; i++) {
    const [page] = await currentPdf.copyPages(pdf, [i]);
    currentPdf.addPage(page);
    
    // Calcula o tamanho aproximado
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

export async function removerSenha(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await (file as any).arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { password: password });
  return await pdf.save();
}

export async function otimizarPDF(file: File): Promise<Uint8Array> {
  const arrayBuffer = await (file as any).arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return await pdf.save({ useObjectStreams: true });
}
