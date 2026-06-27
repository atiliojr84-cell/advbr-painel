from http.server import BaseHTTPRequestHandler
import cgi
import tempfile
import os
from pdf2docx import Converter

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST'}
        )

        if 'file' not in form:
            self.send_response(400)
            self.end_headers()
            return

        file_item = form['file']

        # Cria arquivos temporários
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            temp_pdf.write(file_item.file.read())
            pdf_path = temp_pdf.name

        docx_path = pdf_path.replace('.pdf', '.docx')

        try:
            # Converte mantendo a formatação
            cv = Converter(pdf_path)
            cv.convert(docx_path)
            cv.close()

            # Lê o Word gerado
            with open(docx_path, 'rb') as docx_file:
                docx_data = docx_file.read()

            self.send_response(200)
            self.send_header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            self.send_header('Content-Disposition', 'attachment; filename="convertido.docx"')
            self.end_headers()
            self.wfile.write(docx_data)

        finally:
            # Limpa o servidor
            if os.path.exists(pdf_path): os.remove(pdf_path)
            if os.path.exists(docx_path): os.remove(docx_path)
