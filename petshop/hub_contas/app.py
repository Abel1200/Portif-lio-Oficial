from flask import Flask, render_template, request, jsonify
import sqlite3
import pdfplumber
import re
import os
from datetime import datetime

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def limpar_e_formatar_dados(valores, datas):
    # Tratamento do Valor Monetário com proteção total contra listas vazias
    valor_final = 0.0
    if valores and len(valores) > 0:
        try:
            # Pega a primeira captura de valor encontrada
            valor_limpo = valores[0]
            
            # Remove símbolos monetários comuns e espaços em branco
            valor_limpo = valor_limpo.upper().replace("R$", "").replace(" ", "")
            
            # Ajusta pontos de milhar e formata a vírgula para ponto decimal
            if "," in valor_limpo and "." in valor_limpo:
                valor_limpo = valor_limpo.replace(".", "")
            valor_limpo = valor_limpo.replace(",", ".")
            
            valor_final = float(valor_limpo)
        except (ValueError, IndexError, AttributeError):
            valor_final = 0.0

    # Tratamento da Data de Vencimento com proteção contra listas vazias
    data_final = datetime.now().strftime("%Y-%m-%d") # Data de hoje como segurança
    if datas and len(datas) > 0:
        try:
            # Converte formatos comuns de data brasileira (DD/MM/AAAA) para formato SQL
            data_limpa = datas[0].replace("-", "/")
            data_objeto = datetime.strptime(data_limpa, "%d/%m/%Y")
            data_final = data_objeto.strftime("%Y-%m-%d")
        except (ValueError, IndexError, AttributeError):
            pass
            
    return valor_final, data_final

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/api/contas', methods=['GET'])
def listar_contas():
    conexao = sqlite3.connect("sistema_contas.db")
    cursor = conexao.cursor()
    cursor.execute("SELECT id, descricao, valor, data_vencimento, status FROM contas ORDER BY data_vencimento ASC")
    linhas = cursor.fetchall()
    conexao.close()
    
    # CORREÇÃO DO MAPEAMENTO DO BANCO DE DADOS
    contas = [
        {
            "id": l[0], 
            "descricao": l[1], 
            "valor": l[2], 
            "vencimento": l[3], 
            "status": l[4]
        } for l in linhas
    ]
    return jsonify(contas)

@app.route('/api/upload', methods=['POST'])
def receber_pdf():
    if 'arquivo' not in request.files:
        return jsonify({"erro": "Nenhum arquivo recebido"}), 400
        
    arquivo = request.files['arquivo']
    if arquivo.filename == '' or not arquivo.filename.lower().endswith('.pdf'):
        return jsonify({"erro": "Arquivo inválido"}), 400

    caminho = os.path.join(UPLOAD_FOLDER, arquivo.filename)
    arquivo.save(caminho)
    
    texto = ""
    try:
        with pdfplumber.open(caminho) as pdf:
            for pagina in pdf.pages:
                texto += pagina.extract_text() or ""
    except Exception as e:
        if os.path.exists(caminho):
            os.remove(caminho)
        return jsonify({"erro": f"Falha ao ler estrutura do PDF: {str(e)}"}), 500
            
    if os.path.exists(caminho):
        os.remove(caminho) # Remove o arquivo temporário com segurança

    # Algoritmo de Extração Avançado e Ampliado para Faturas Reais
    valores = re.findall(r"(?:Valor do Documento|VALOR|Total a Pagar|Total da Fatura|Valor Total|Líquido|R\$)\s*([\d\.,]+)", texto, re.IGNORECASE)
    datas = re.findall(r"(\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4})", texto)
    
    valor, vencimento = limpar_e_formatar_dados(valores, datas)
    
    # CORREÇÃO DA EXTRAÇÃO DE TEXTO DO NOME DO ARQUIVO
    nome_limpo = arquivo.filename.rsplit('.', 1)
    descricao = nome_limpo[0].replace("_", " ").replace("-", " ").capitalize()

    # Inserção SQL segura no Banco de Dados
    conexao = sqlite3.connect("sistema_contas.db")
    cursor = conexao.cursor()
    cursor.execute("INSERT INTO contas (descricao, valor, data_vencimento, status) VALUES (?, ?, ?, 'Pendente')", 
                   (descricao, valor, vencimento))
    conexao.commit()
    conexao.close()

    return jsonify({"sucesso": True})

@app.route('/api/pagar/<int:conta_id>', methods=['POST'])
def pagar_conta(conta_id):
    conexao = sqlite3.connect("sistema_contas.db")
    cursor = conexao.cursor()
    cursor.execute("UPDATE contas SET status = 'Pago' WHERE id = ?", (conta_id,))
    conexao.commit()
    conexao.close()
    return jsonify({"sucesso": True})

if __name__ == '__main__':
    app.run(debug=True)
