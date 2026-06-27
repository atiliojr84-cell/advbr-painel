// PdfProcessor.ts
// @ts-nocheck
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist'; // Manter a importação
import JSZip from 'jszip';

// REMOVER ESTA LINHA:
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// O restante do código permanece o mesmo
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
  const maxBytes = maxMB * 1024 * 1024; // Converte MB para bytes

  const chunks: Uint8Array[] = [];
  let currentChunkPdf = await PDFDocument.create();
  let currentPageIndexInChunk = 0;

  for (let i = 0; i < totalPages; i++) {
    const [page] = await currentChunkPdf.copyPages(originalPdf, [i]);
    currentChunkPdf.addPage(page);
    currentPageIndexInChunk++;

    let tempBytes: Uint8Array;
    try {
      tempBytes = await currentChunkPdf.save();
    } catch (e) {
      console.error("Erro ao salvar PDF temporário para verificação de tamanho:", e);
      if (currentPageIndexInChunk > 1) {
        const previousPdf = await PDFDocument.create();
        const pagesToCopy = await previousPdf.copyPages(currentChunkPdf, Array.from({ length: currentPageIndexInChunk - 1 }, (_, k) => k));
        pagesToCopy.forEach(p => previousPdf.addPage(p));
        chunks.push(await previousPdf.save());
      }
      currentChunkPdf = await PDFDocument.create();
      currentPageIndexInChunk = 0;
      continue;
    }

    if (tempBytes.length > maxBytes && currentPageIndexInChunk > 1) {
      const previousPdf = await PDFDocument.create();
      const pagesToCopy = await previousPdf.copyPages(currentChunkPdf, Array.from({ length: currentPageIndexInChunk - 1 }, (_, k) => k));
      pagesToCopy.forEach(p => previousPdf.addPage(p));
      chunks.push(await previousPdf.save());

      currentChunkPdf = await PDFDocument.create();
      const [currentPage] = await currentChunkPdf.copyPages(originalPdf, [i]);
      currentChunkPdf.addPage(currentPage);
      currentPageIndexInChunk = 1;
    } else if (tempBytes.length > maxBytes && currentPageIndexInChunk === 1) {
      chunks.push(tempBytes);
      currentChunkPdf = await PDFDocument.create();
      currentPageIndexInChunk = 0;
    }
  }

  if (currentPageIndexInChunk > 0) {
    chunks.push(await currentChunkPdf.save());
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
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let docxParagraphs: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    let currentParagraph = "";
    let lastY = -1;
    let lastFontSize = -1;
    let lastX = -1;

    for (const item of textContent.items as any[]) {
      const currentY = item.transform[5];
      const currentFontSize = item.fontHeight;
      const currentX = item.transform[4];

      const isNewParagraph = lastY !== -1 && (
        Math.abs(currentY - lastY) > (lastFontSize * 1.5) ||
        Math.abs(currentFontSize - lastFontSize) > 1 ||
        (currentX - lastX > (lastFontSize * 2) && currentY === lastY)
      );

      if (isNewParagraph) {
        if (currentParagraph.trim() !== "") {
          docxParagraphs.push(currentParagraph.trim());
        }
        currentParagraph = item.str;
      } else {
        currentParagraph += (currentParagraph === "" ? "" : " ") + item.str;
      }
      lastY = currentY;
      lastFontSize = currentFontSize;
      lastX = currentX + item.width;
    }
    if (currentParagraph.trim() !== "") {
      docxParagraphs.push(currentParagraph.trim());
    }
    if (i < pdf.numPages) {
      docxParagraphs.push("<w:br w:type=\"page\"/>");
    }
  }

  const escapedParagraphs = docxParagraphs.map(p => {
    if (p === "<w:br w:type=\"page\"/>") return p;
    return p
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  });

  const wordBodyContent = escapedParagraphs.map(line => {
    if (line === "<w:br w:type=\"page\"/>") {
      return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }
    return `<w:p><w:r><w:t>${line}</w:t></w:r></w:p>`;
  }).join('');

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:ns0="http://schemas.openxmlformats.org/package/2006/relationships">
  <w:body>
    ${wordBodyContent}
    <w:sectPr w:rsidR="007F0723" w:rsidSect="007F0723">
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="720"/>
      <w:docGrid w:type="lines" w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const zip = new JSZip();
  zip.file("word/document.xml", documentXml);
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
  zip.file("word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`);

  const docxBlob = await zip.generateAsync({ type: "uint8array" });
  return docxBlob;
}
