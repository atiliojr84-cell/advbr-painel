// PdfProcessor.ts
// @ts-nocheck
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Configura o worker do PDF.js através de CDN para funcionar diretamente no ambiente do navegador
// Esta linha é executada no ambiente onde o módulo é importado.
// Para Client Components, isso é no navegador. Para Server Components, isso pode causar problemas.
// A solução mais robusta para Next.js é garantir que pdfjs-dist seja carregado apenas no cliente.
// No PdfToolHub.tsx, usaremos next/dynamic para isso.
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

    // Tenta salvar o PDF atual para verificar o tamanho
    let tempBytes: Uint8Array;
    try {
      tempBytes = await currentChunkPdf.save();
    } catch (e) {
      console.error("Erro ao salvar PDF temporário para verificação de tamanho:", e);
      // Em caso de erro ao salvar, forçamos a criação de um novo chunk
      // para evitar loop infinito ou falha total.
      if (currentPageIndexInChunk > 1) {
        const previousPdf = await PDFDocument.create();
        const pagesToCopy = await previousPdf.copyPages(currentChunkPdf, Array.from({ length: currentPageIndexInChunk - 1 }, (_, k) => k));
        pagesToCopy.forEach(p => previousPdf.addPage(p));
        chunks.push(await previousPdf.save());
      }
      currentChunkPdf = await PDFDocument.create();
      currentPageIndexInChunk = 0;
      // Adiciona a página atual ao novo chunk e tenta novamente na próxima iteração
      // Ou, se for a primeira página e deu erro, ela será tratada no próximo passo
      continue;
    }

    // Se o tamanho exceder o limite E não for a primeira página do chunk
    if (tempBytes.length > maxBytes && currentPageIndexInChunk > 1) {
      // Salva o chunk anterior (sem a página que o fez exceder)
      const previousPdf = await PDFDocument.create();
      const pagesToCopy = await previousPdf.copyPages(currentChunkPdf, Array.from({ length: currentPageIndexInChunk - 1 }, (_, k) => k));
      pagesToCopy.forEach(p => previousPdf.addPage(p));
      chunks.push(await previousPdf.save());

      // Inicia um novo PDF com a página atual
      currentChunkPdf = await PDFDocument.create();
      const [currentPage] = await currentChunkPdf.copyPages(originalPdf, [i]);
      currentChunkPdf.addPage(currentPage);
      currentPageIndexInChunk = 1; // O novo chunk já tem 1 página
    } else if (tempBytes.length > maxBytes && currentPageIndexInChunk === 1) {
      // Caso uma única página já exceda o limite, salva-a como um chunk
      // e inicia um novo PDF vazio.
      chunks.push(tempBytes);
      currentChunkPdf = await PDFDocument.create();
      currentPageIndexInChunk = 0;
    }
    // Se não excedeu, continua adicionando páginas ao currentChunkPdf
  }

  // Adiciona o último chunk se houver páginas restantes
  if (currentPageIndexInChunk > 0) {
    chunks.push(await currentChunkPdf.save());
  }

  return chunks;
}

export async function comprimirPDF(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);

  // Tenta otimizar o PDF salvando com useObjectStreams e flatten
  // Isso ajuda a remover objetos não utilizados e a "achatar" o PDF,
  // mas não comprime imagens de forma agressiva.
  const compressedPdfBytes = await pdf.save({
    useObjectStreams: true,
    // flatten: true // 'flatten' pode remover interatividade, usar com cautela
  });

  return compressedPdfBytes;
}

export async function removerSenhaPDF(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const pdf = await PDFDocument.load(arrayBuffer, { password: password });
    // Se carregou com sucesso, a senha foi aceita. Salvar sem senha.
    return await pdf.save();
  } catch (error: any) {
    // Captura erros específicos da pdf-lib para senhas
    if (error.message && error.message.includes('Incorrect password')) {
      throw new Error('Senha incorreta. Por favor, verifique a senha e tente novamente.');
    }
    throw new Error(`Falha ao remover senha: ${error.message || 'Erro desconhecido.'}`);
  }
}

/**
 * Converte um arquivo PDF para um formato legível pelo Microsoft Word (.docx).
 * ATENÇÃO: Esta função extrai APENAS O TEXTO do PDF e tenta preservar a estrutura básica de parágrafos.
 * Não há suporte para formatação (negrito, itálico, fontes, cores), imagens, tabelas ou outros elementos complexos.
 * Para uma conversão de alta fidelidade, um serviço de API externo ou uma solução de backend robusta é recomendada.
 */
export async function converterParaWord(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();

  // Carrega o documento no motor do PDF.js
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let docxParagraphs: string[] = [];

  // Percorre todas as páginas extraindo as cadeias de texto correspondentes
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    let currentParagraph = "";
    let lastY = -1; // Posição Y da última linha processada
    let lastFontSize = -1; // Tamanho da fonte da última linha processada
    let lastX = -1; // Posição X da última palavra processada

    for (const item of textContent.items as any[]) {
      const currentY = item.transform[5];
      const currentFontSize = item.fontHeight;
      const currentX = item.transform[4];

      // Heurística para detectar novas linhas ou parágrafos
      // Se a posição Y mudou significativamente (mais que 1.5x o tamanho da fonte)
      // ou se o tamanho da fonte mudou drasticamente, consideramos uma nova linha/parágrafo.
      // Se a distância horizontal for muito grande para ser uma continuação da mesma linha, também.
      const isNewParagraph = lastY !== -1 && (
        Math.abs(currentY - lastY) > (lastFontSize * 1.5) || // Grande salto vertical
        Math.abs(currentFontSize - lastFontSize) > 1 || // Mudança de tamanho de fonte
        (currentX - lastX > (lastFontSize * 2) && currentY === lastY) // Grande salto horizontal na mesma linha
      );

      if (isNewParagraph) {
        if (currentParagraph.trim() !== "") {
          docxParagraphs.push(currentParagraph.trim());
        }
        currentParagraph = item.str;
      } else {
        // Se for a mesma linha ou continuação de parágrafo, adiciona o texto
        currentParagraph += (currentParagraph === "" ? "" : " ") + item.str;
      }
      lastY = currentY;
      lastFontSize = currentFontSize;
      lastX = currentX + item.width; // Posição X final da palavra
    }
    if (currentParagraph.trim() !== "") {
      docxParagraphs.push(currentParagraph.trim());
    }
    // Adiciona uma quebra de página no Word após cada página do PDF
    if (i < pdf.numPages) { // Não adiciona quebra de página após a última página
      docxParagraphs.push("<w:br w:type=\"page\"/>");
    }
  }

  // Escapa caracteres especiais do XML
  const escapedParagraphs = docxParagraphs.map(p => {
    if (p === "<w:br w:type=\"page\"/>") return p; // Não escapar a tag de quebra de página
    return p
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  });

  // Monta a estrutura OpenXML do WordDocument
  // Adicionado mais elementos para uma estrutura DOCX mais "completa"
  const wordBodyContent = escapedParagraphs.map(line => {
    if (line === "<w:br w:type=\"page\"/>") {
      return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`; // Quebra de página dentro de um parágrafo
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

  // Cria o arquivo .docx usando JSZip
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
  <!-- Adicione aqui outras relações se houver imagens, cabeçalhos, etc. -->
</Relationships>`);

  const docxBlob = await zip.generateAsync({ type: "uint8array" });
  return docxBlob;
}
