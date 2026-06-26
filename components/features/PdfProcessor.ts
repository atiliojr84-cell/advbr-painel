// Adicione estas funções abaixo da função 'unirPDFs' no seu PdfProcessor.ts

// Função para Dividir PDF (retorna um array de Uint8Arrays, uma página por arquivo)
export async function dividirPDF(file: File): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  const result: Uint8Array[] = [];

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(copiedPage);
    result.push(await newPdf.save());
  }
  return result;
}

// Função para Remover Senha
export async function removerSenha(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  // A pdf-lib permite carregar com a senha fornecida
  const pdf = await PDFDocument.load(arrayBuffer, { password: password });
  return await pdf.save();
}
