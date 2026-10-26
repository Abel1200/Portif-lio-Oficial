import sqlite3

def inicializar_banco():
    conexao = sqlite3.connect("sistema_contas.db")
    cursor = conexao.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        data_vencimento DATE NOT NULL,
        codigo_barras TEXT,
        status TEXT DEFAULT 'Pendente'
    );
    """)
    
    conexao.commit()
    conexao.close()
    print("Sucesso: Arquivo 'sistema_contas.db' criado!")

if __name__ == "__main__":
    inicializar_banco()
