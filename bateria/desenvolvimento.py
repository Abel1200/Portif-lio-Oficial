import pygame
import sys
import os
from PIL import Image
# Inicialização do Pygame e do Mixer de Áudio
pygame.init()
pygame.mixer.init(frequency=44100, size=-16, channels=2, buffer=512) # Baixa latência

# --- CONFIGURAÇÕES DA TELA ---
LARGURA = 700
ALTURA = 450
FPS = 60  # <--- AQUI ESTÁ A CORREÇÃO: Definindo a taxa de quadros por segundo
tela = pygame.display.set_mode((LARGURA, ALTURA))
pygame.display.set_caption("Python Drum Kit Simulator 🥁")
clock = pygame.time.Clock()

# --- CORES (RGB) ---
COR_FUNDO = (25, 25, 35)
COR_TEXTO = (240, 240, 240)
COR_BORDA = (100, 100, 120)

# Mapeamento de Cores dos Instrumentos (Normal, Quando Tocado)
CORES_PEÇAS = {
    "PRATO": ((230, 190, 50), (255, 230, 100)),
    "CHIMBAU": ((190, 160, 40), (240, 210, 90)),
    "CAIXA": ((180, 180, 180), (230, 230, 230)),
    "TOM": ((130, 80, 60), (180, 120, 90)),
    "BUMBO": ((50, 50, 60), (90, 90, 110))
}

# --- CARREGAR SONS ---
sons = {}

def carregar_som(nome_peca, arquivo):
    if os.path.exists(arquivo):
        sons[nome_peca] = pygame.mixer.Sound(arquivo)
    else:
        sons[nome_peca] = None
        print(f"Aviso: Arquivo '{arquivo}' não encontrado. Rodando em modo silencioso para esta peça.")

carregar_som("BUMBO", "kick.wav")
carregar_som("CAIXA", "snare.wav")
carregar_som("CHIMBAU", "hi-hat.wav")
carregar_som("PRATO", "Ride.wav")
carregar_som("TOM", "Tom.wav")

# --- DICIONÁRIO DE CONFIGURAÇÃO DA BATERIA ---
bateria = {
    pygame.K_SPACE: {"nome": "BUMBO", "pos": (350, 310), "raio": 75, "tipo": "BUMBO", "ativo": 0, "tecla_txt": "ESPAÇO"},
    pygame.K_f:     {"nome": "CAIXA", "pos": (220, 230), "raio": 45, "tipo": "CAIXA", "ativo": 0, "tecla_txt": "F"},
    pygame.K_j:     {"nome": "TOM", "pos": (440, 190), "raio": 50, "tipo": "TOM", "ativo": 0, "tecla_txt": "J"},
    pygame.K_d:     {"nome": "CHIMBAU", "pos": (120, 160), "raio": 40, "tipo": "CHIMBAU", "ativo": 0, "tecla_txt": "D"},
    pygame.K_k:     {"nome": "PRATO", "pos": (550, 110), "raio": 60, "tipo": "PRATO", "ativo": 0, "tecla_txt": "K"}
}

def tocar_peca(tecla):
    if tecla in bateria:
        bateria[tecla]["ativo"] = 5 
        if sons[bateria[tecla]["nome"]]:
            sons[bateria[tecla]["nome"]].play()

# --- LOOP PRINCIPAL ---
while True:
    tela.fill(COR_FUNDO)
    
    # 1. Gerenciamento de Entradas (Teclado)
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        
        if evento.type == pygame.KEYDOWN:
            tocar_peca(evento.key)

    # 2. Desenhar Suportes/Ferragens da Bateria
    pygame.draw.line(tela, COR_BORDA, (350, 310), (350, 420), 4) 
    pygame.draw.line(tela, COR_BORDA, (220, 230), (220, 420), 3) 
    pygame.draw.line(tela, COR_BORDA, (440, 190), (440, 420), 3) 
    pygame.draw.line(tela, COR_BORDA, (120, 160), (120, 420), 3) 
    pygame.draw.line(tela, COR_BORDA, (550, 110), (550, 420), 3) 

    # 3. Desenhar os Tambores e Pratos
    for tecla, dados in bateria.items():
        cor_idx = 1 if dados["ativo"] > 0 else 0
        cor_atual = CORES_PEÇAS[dados["tipo"]][cor_idx]
        
        if dados["ativo"] > 0:
            dados["ativo"] -= 1
            
        pygame.draw.circle(tela, cor_atual, dados["pos"], dados["raio"])
        pygame.draw.circle(tela, COR_BORDA, dados["pos"], dados["raio"], 3) 
        
        if dados["tipo"] in ["PRATO", "CHIMBAU"]:
            pygame.draw.circle(tela, COR_FUNDO, dados["pos"], 6)

        fonte_peca = pygame.font.SysFont("Helvetica", 14, bold=True)
        txt_nome = fonte_peca.render(dados["nome"], True, COR_TEXTO if cor_idx == 0 else COR_FUNDO)
        txt_tecla = fonte_peca.render(f"[{dados['tecla_txt']}]", True, (200, 50, 50) if cor_idx == 0 else COR_FUNDO)
        
        tela.blit(txt_nome, (dados["pos"][0] - txt_nome.get_width()//2, dados["pos"][1] - 10))
        tela.blit(txt_tecla, (dados["pos"][0] - txt_tecla.get_width()//2, dados["pos"][1] + 8))

    # 4. Texto de Instruções Superior
    fonte_titulo = pygame.font.SysFont("Impact", 32)
    titulo = fonte_titulo.render(" DRUM KIT virtual", True, COR_TEXTO)
    tela.blit(titulo, (LARGURA // 2 - titulo.get_width() // 2, 20))
    
    fonte_instrucoes = pygame.font.SysFont("Arial", 16)
    instrucoes = fonte_instrucoes.render("Use o seu teclado para tocar! Pressione as teclas indicadas nas peças.", True, (150, 150, 160))
    tela.blit(instrucoes, (LARGURA // 2 - instrucoes.get_width() // 2, 60))

    pygame.display.flip()
    clock.tick(FPS) 