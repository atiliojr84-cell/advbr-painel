// PdfProcessor.ts
// @ts-nocheck
import { PDFDocument } from 'pdf-lib';

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

export async function dividirPDF(file: File, maxMB: number): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(arrayBuffer);
  const totalPages = originalPdf.getPageCount();
  const maxBytes = maxMB * 1024 * 1024; 

  // CORREÇÃO: Cálculo inteligente de tamanho para não travar o navegador
  const totalBytes = arrayBuffer.byteLength;
  const avgBytesPerPage = totalBytes / totalPages;

  let pagesPerChunk = Math.floor(maxBytes / (avgBytesPerPage * 1.1));
  if (pagesPerChunk < 1) pagesPerChunk = 1; 

  const chunks: Uint8Array[] = [];

  for (let i = 0; i < totalPages; i += pagesPerChunk) {
    const chunkPdf = await PDFDocument.create();
    const pagesToCopy = [];
    for (let j = 0; j < pagesPerChunk && (i + j) < totalPages; j++) {
      pagesToCopy.push(i + j);
    }
    const copiedPages = await chunkPdf.copyPages(originalPdf, pagesToCopy);
    copiedPages.forEach(page => chunkPdf.addPage(page));
    chunks.push(await chunkPdf.save());
  }

  return chunks;
}

export async function dividirPDFPorPaginas(file: File, maxPagesPerChunk: number): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(arrayBuffer); 
  const totalPages = originalPdf.getPageCount();
  const chunks: Uint8Array[] = [];

  for (let i = 0; i < totalPages; i += maxPagesPerChunk) {
    const chunkPdf = await PDFDocument.create();
    const pagesToCopy = [];
    for (let j = 0; j < maxPagesPerChunk && (i + j) < totalPages; j++) {
      pagesToCopy.push(i + j);
    }
    const copiedPages = await chunkPdf.copyPages(originalPdf, pagesToCopy);
    copiedPages.forEach(page => chunkPdf.addPage(page));
    chunks.push(await chunkPdf.save());
  }
  return chunks;
}

export async function comprimirPDF(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const compressedPdfBytes = await pdf.save({
    useObjectStreams: true,
  });
  return compressedPdfBytes;
}

export async function removerSenhaPDF(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const pdf = await PDFDocument.load(arrayBuffer, { password: password });
    return await pdf.save();
  } catch (error: any) {
    if (error.message && error.message.includes('Incorrect password')) {
      throw new Error('Senha incorreta. Por favor, verifique a senha e tente novamente.');
    }
    throw new Error(`Falha ao remover senha: ${error.message || 'Erro desconhecido.'}`);
  }
}

export async function converterParaWord(file: File): Promise<Uint8Array> {
  // CORREÇÃO: Envia o arquivo para a nova API Python na Vercel
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch('/api/convert', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Falha na conversão pelo servidor. Verifique se a API Python está rodando.");
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}
