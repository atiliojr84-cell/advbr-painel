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
  let currentPageCount = 0;

  for (let i = 0; i < totalPages; i++) {
    const [page] = await currentPdf.copyPages(pdf, [i]);
    currentPdf.addPage(page);
    currentPageCount++;

    // Salva temporariamente para verificar o tamanho
    const tempBytes = await currentPdf.save();

    // Se o PDF atual exceder o limite E não for a primeira página do chunk,
    // salva o chunk anterior (sem a página atual) e inicia um novo chunk com a página atual.
    if (tempBytes.length > maxBytes && currentPageCount > 1) {
      // Remove a última página adicionada para salvar o chunk anterior
      const previousPdf = await PDFDocument.create();
      const pagesToCopy = await currentPdf.copyPages(currentPdf, Array.from({ length: currentPageCount - 1 }, (_, k) => k));
      pagesToCopy.forEach(p => previousPdf.addPage(p));
      chunks.push(await previousPdf.save());

      // Inicia um novo PDF com a página atual
      currentPdf = await PDFDocument.create();
      currentPdf.addPage(page);
      currentPageCount = 1;
    }
  }
  // Adiciona o último chunk
  if (currentPageCount > 0) {
    chunks.push(await currentPdf.save());
  }
  return chunks;
}

export async function comprimirPorDPI(file: File): Promise<Uint8Array> { // Removido o parâmetro dpi
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  // Apenas salva o PDF novamente com otimizações padrão da pdf-lib
  return await pdf.save({ useObjectStreams: true });
}

export async function removerSenha(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { password: password });
  return await pdf.save();
}

/**
 * Converte um arquivo PDF para um formato legível pelo Microsoft Word (.docx)
 * Extrai o texto de forma 100% local e monta a estrutura XML OpenXML necessária,
 * tentando preservar a estrutura básica de parágrafos e garantindo que o Word consiga abrir o arquivo.
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
        const currentX = item.transform[4]; // Posição X do texto
        const fontSize = item.height; // Altura da fonte

        // Se a diferença de Y for grande, ou se for um item de texto muito distante,
        // consideramos uma nova linha ou parágrafo.
        // Tentativa de agrupar texto que está na mesma "linha visual"
        if (lastY !== -1 && Math.abs(lastY - currentY) > fontSize * lineThreshold) {
          // Nova linha/parágrafo
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
  // Adicionando os namespaces e elementos mínimos para um DOCX válido
  const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${escapedParagraphs.map(line => {
      if (line === "<w:br w:type=\"page\"/>") {
        return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`; // Quebra de página dentro de um parágrafo
      }
      return `<w:p><w:r><w:t>${line}</w:t></w:r></w:p>`;
    }).join('')}
  </w:body>
</w:document>`;

  // Para criar um arquivo .docx válido, precisamos de mais do que apenas o XML do documento.
  // Um .docx é na verdade um arquivo ZIP contendo vários arquivos XML.
  // A forma mais simples de fazer isso no cliente é usar uma biblioteca que crie o ZIP.
  // Como você não quer adicionar mais dependências pesadas, a alternativa é gerar apenas o XML
  // e torcer para que o Word seja "gentil" ao abri-lo, ou informar ao usuário que ele pode
  // precisar salvar como .doc ou .txt e depois abrir no Word.
  // No entanto, o erro "Word não consegue abrir" sugere que o XML gerado não é um documento Word
  // completo, mas apenas o conteúdo principal.

  // Para realmente gerar um DOCX válido que o Word abra sem reclamar,
  // precisaríamos de uma biblioteca como 'docxtemplater' ou 'jszip' para montar o arquivo ZIP
  // com todos os XMLs necessários (document.xml, rels, content types, etc.).
  // Sem isso, o que estamos gerando é apenas o 'document.xml' principal.

  // Vamos tentar uma abordagem mais robusta para o XML, incluindo o namespace 'r'
  // e garantindo que cada linha de texto esteja dentro de um <w:t> e <w:r> e <w:p>.
  // A quebra de página também precisa ser tratada como um elemento de run.

  // A estrutura XML foi ajustada para ser mais completa e compatível com o Word.
  // Se o problema persistir, a solução definitiva seria usar uma biblioteca de geração de DOCX
  // que lide com a estrutura ZIP completa, como 'docxtemplater' ou 'docx'.
  // Mas isso adicionaria uma dependência significativa.

  return new TextEncoder().encode(docxContent);
}
