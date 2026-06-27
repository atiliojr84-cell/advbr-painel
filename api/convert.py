from http.server import BaseHTTPRequestHandler
import cgi
import tempfile
import os
from pdf2docx import Converter

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Configura o recebimento do arquivo vindo do frontend
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST',
                     'CONTENT_TYPE': self.headers['Content-Type'],
                     }
        )

        if 'file' not in form:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Nenhum arquivo enviado.")
            return

        file_item = form['file']

        # Cria arquivos temporários seguros no servidor da Vercel
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            temp_pdf.write(file_item.file.read())
            pdf_path = temp_pdf.name

        docx_path = pdf_path.replace('.pdf', '.docx')

        try:
            # Realiza a conversão mantendo layout, tabelas e imagens
            cv = Converter(pdf_path)
            cv.convert(docx_path)
            cv.close()

            # Lê o arquivo Word gerado
            with open(docx_path, 'rb') as docx_file:
                docx_data = docx_file.read()

            # Envia a resposta de sucesso (o arquivo .docx) para o frontend
            self.send_response(200)
            self.send_header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            self.send_header('Content-Disposition', 'attachment; filename="documento_convertido.docx"')
            self.end_headers()
            self.wfile.write(docx_data)

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"Erro na conversão: {str(e)}".encode('utf-8'))

        finally:
            # Limpeza obrigatória para não travar a memória do servidor
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
            if os.path.exists(docx_path):
                os.remove(docx_path)
