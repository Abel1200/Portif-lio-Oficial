package br.com.petshop;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Servidor {
    public static void main(String[] args) throws IOException {
        // Inicializa o servidor na porta 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        System.out.println("Servidor do PetShop rodando na porta 8080...");

        // Rota para a página inicial
        server.createContext("/", exchange -> enviarArquivo(exchange, "index.html", "text/html"));

        // Rota para a página de serviços
        server.createContext("/servicos.html", exchange -> enviarArquivo(exchange, "servicos.html", "text/html"));

        // Rota para carregar o arquivo CSS
        server.createContext("/estilo.css", exchange -> enviarArquivo(exchange, "estilo.css", "text/css"));

        // Rota para receber os dados do formulário de contato
        server.createContext("/enviar-contato", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    // Aqui você processaria os dados (salvar no banco de dados, enviar email, etc.)
                    String resposta = "<h1>Obrigado! Recebemos sua mensagem. Retornaremos em breve.</h1><a href='/'>Voltar</a>";
                    exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
                    exchange.sendResponseHeaders(200, resposta.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(resposta.getBytes());
                    os.close();
                }
            }
        });

        server.setExecutor(null);
        server.start();
    }

    // Função utilitária para ler arquivos HTML/CSS do disco e enviar ao navegador
    private static void enviarArquivo(HttpExchange exchange, String caminho, String contentType) throws IOException {
        byte[] resposta = Files.readAllBytes(Paths.get(caminho));
        exchange.getResponseHeaders().set("Content-Type", contentType + "; charset=UTF-8");
        exchange.sendResponseHeaders(200, resposta.length);
        OutputStream os = exchange.getResponseBody();
        os.write(resposta);
        os.close();
    }
}
