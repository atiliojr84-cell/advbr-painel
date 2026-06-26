// @ts-nocheck
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip'; // Importa JSZip

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

export async function dividirPDF(file: File, maxMB: number): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(arrayBuffer);
  const totalPages = originalPdf.getPageCount();
  const maxBytes = maxMB * 1024 * 1024;
  const chunks: Uint8Array[] = [];
  let currentPdf = await PDFDocument.create();
  let currentChunkPageCount = 0;

  for (let i = 0; i < totalPages; i++) {
    const [page] = await currentPdf.copyPages(originalPdf, [i]);
    currentPdf.addPage(page);
    currentChunkPageCount++;

    const tempBytes = await currentPdf.save();

    // Se o PDF atual exceder o limite E não for a primeira página do chunk,
    // salva o chunk anterior (sem a página atual) e inicia um novo chunk com a página atual.
    if (tempBytes.length > maxBytes && currentChunkPageCount > 1) {
      // Salva o chunk anterior (sem a página que o fez exceder)
      const previousPdf = await PDFDocument.create();
      const pagesToCopy = await currentPdf.copyPages(currentPdf, Array.from({ length: currentChunkPageCount - 1 }, (_, k) => k));
      pagesToCopy.forEach(p => previousPdf.addPage(p));
      chunks.push(await previousPdf.save());

      // Inicia um novo PDF com a página atual
      currentPdf = await PDFDocument.create();
      const [currentPage] = await currentPdf.copyPages(originalPdf, [i]);
      currentPdf.addPage(currentPage);
      currentChunkPageCount = 1;
    } else if (tempBytes.length > maxBytes && currentChunkPageCount === 1) {
      // Caso uma única página já exceda o limite, salva-a como um chunk e continua
      chunks.push(tempBytes);
      currentPdf = await PDFDocument.create();
      currentChunkPageCount = 0;
    }
  }
  // Adiciona o último chunk se houver páginas restantes
  if (currentChunkPageCount > 0) {
    chunks.push(await currentPdf.save());
  }
  return chunks;
}

export async function comprimirPDF(file: File): Promise<Uint8Array> { // Removido o parâmetro dpi
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  // Apenas salva o PDF novamente com otimizações padrão da pdf-lib
  return await pdf.save({ useObjectStreams: true });
}

export async function removerSenhaPDF(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const pdf = await PDFDocument.load(arrayBuffer, { password: password });
    // Se chegou aqui, a senha estava correta.
    // Tenta salvar o PDF sem criptografia.
    // A pdf-lib não tem um método direto para "remover senha",
    // mas salvar um PDF carregado com senha geralmente o salva sem a proteção.
    return await pdf.save();
  } catch (error: any) {
    // Captura erros específicos da pdf-lib para senhas
    if (error.message && error.message.includes('Incorrect password')) {
      throw new Error('Senha incorreta. Por favor, verifique a senha e tente novamente.');
    }
    // Outros erros
    throw new Error(`Não foi possível remover a senha: ${error.message || 'Erro desconhecido.'}`);
  }
}

/**
 * Converte um arquivo PDF para um formato legível pelo Microsoft Word (.docx)
 * Extrai o texto de forma 100% local e monta a estrutura XML OpenXML necessária,
 * empacotando-a em um arquivo .docx válido usando JSZip.
 */
export async function converterParaWord(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();

  // Carrega o documento no motor do PDF.js
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let docxParagraphs: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    let lastY = -1;
    let currentParagraph = "";
    const lineThreshold = 2; // Heurística para nova linha (distância vertical)

    for (const item of textContent.items) {
      if ('str' in item && item.str.trim() !== '') { // Verifica se é um item de texto não vazio
        const currentY = item.transform[5]; // Posição Y do texto
        const fontSize = item.height; // Altura da fonte (aproximada)

        // Se a diferença de Y for grande, consideramos uma nova linha ou parágrafo.
        if (lastY !== -1 && Math.abs(lastY - currentY) > fontSize * lineThreshold) {
          if (currentParagraph.trim() !== "") {
            docxParagraphs.push(currentParagraph.trim());
          }
          currentParagraph = item.str;
        } else {
          // Continua o parágrafo, adicionando espaço se necessário
          currentParagraph += (currentParagraph === "" ? "" : " ") + item.str;
        }
        lastY = currentY;
      }
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
  const wordBodyContent = escapedParagraphs.map(line => {
    if (line === "<w:br w:type=\"page\"/>") {
      return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`; // Quebra de página dentro de um parágrafo
    }
    return `<w:p><w:r><w:t>${line}</w:t></w:r></w:p>`;
  }).join('');

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${wordBodyContent}
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
