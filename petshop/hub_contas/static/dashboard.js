// Variável global para armazenar as contas e controlar os filtros sem recarregar do banco
let todasAsContas = [];
let filtroAtual = "todas";

document.addEventListener("DOMContentLoaded", () => {
    const areaUpload = document.getElementById("areaUpload");
    const campoArquivo = document.getElementById("arquivoBoleto");
    const botoesFiltro = document.querySelectorAll(".filtro-tabela .btn-filtro");

    // Aciona a janela de escolha de arquivo ao clicar no card de upload
    areaUpload.addEventListener("click", () => campoArquivo.click());

    campoArquivo.addEventListener("change", async () => {
        if (campoArquivo.files.length === 0) return;
        
        const formData = new FormData();
        formData.append("arquivo", campoArquivo.files[0]); // <--- Ajuste perfeito aqui!

        // Muda temporariamente o texto do card de upload para dar feedback visual
        const textoUpload = areaUpload.querySelector("p");
        const textoOriginal = textoUpload.innerText;
        textoUpload.innerText = "Processando boleto com IA...";

        const resposta = await fetch("/api/upload", { method: "POST", body: formData });
        
        textoUpload.innerText = textoOriginal;
        campoArquivo.value = ""; // Limpa o campo de arquivo para permitir novos uploads

        if (resposta.ok) {
            alert("Boleto importado e processado com sucesso!");
            carregarDadosDoDashboard();
        } else {
            alert("Aviso: Estrutura do PDF enviada. Verifique se os dados foram inseridos ou preenchidos como R$ 0,00.");
            carregarDadosDoDashboard();
        }
    });

    // Configuração dos cliques dos Botões de Filtro (Todas / Pendentes / Pagas)
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", (e) => {
            // Remove a classe ativo de todos os botões e adiciona no clicado
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            e.target.classList.add("ativo");

            // Define o filtro atual com base no texto do botão
            const termo = e.target.innerText.toLowerCase();
            if (termo === "todas") filtroAtual = "todas";
            else if (termo === "pendentes") filtroAtual = "pendente";
            else if (termo === "pagas") filtroAtual = "pago";

            // Renderiza novamente a tabela aplicando o filtro selecionado
            renderizarTabela();
        });
    });

    carregarDadosDoDashboard();
});

async function carregarDadosDoDashboard() {
    try {
        const resposta = await fetch("/api/contas");
        todasAsContas = await resposta.json();
        
        // Atualiza os KPIs de resumo calculando com base no array completo
        atualizarKPIs();
        // Desenha as linhas na tabela aplicando o filtro selecionado
        renderizarTabela();
    } catch (erro) {
        console.error("Erro ao carregar dados do servidor:", erro);
    }
}

function atualizarKPIs() {
    let totalAPagar = 0;
    let totalPendentes = 0;
    let totalPagas = 0;

    todasAsContas.forEach(conta => {
        if (conta.status === "Pendente") {
            totalAPagar += conta.valor;
            totalPendentes++;
        } else if (conta.status === "Pago") {
            totalPagas++;
        }
    });

    document.getElementById("kpiTotal").innerText = `R$ ${totalAPagar.toFixed(2).replace(".", ",")}`;
    document.getElementById("kpiPendentes").innerText = totalPendentes;
    document.getElementById("kpiPagas").innerText = totalPagas;
}

function renderizarTabela() {
    const corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.innerHTML = "";

    // Filtra as contas de acordo com o botão clicado
    const contasFiltradas = todasAsContas.filter(conta => {
        if (filtroAtual === "todas") return true;
        return conta.status.toLowerCase() === filtroAtual;
    });

    if (contasFiltradas.length === 0) {
        corpoTabela.innerHTML = `<tr class="linha-vazia"><td colspan="5">Nenhum boleto encontrado nesta categoria.</td></tr>`;
        return;
    }

    contasFiltradas.forEach(conta => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${conta.descricao}</strong></td>
            <td>${conta.vencimento.split("-").reverse().join("/")}</td>
            <td>R$ ${conta.valor.toFixed(2).replace(".", ",")}</td>
            <td><span class="badge ${conta.status.toLowerCase()}">${conta.status}</span></td>
            <td>
                ${conta.status === 'Pendente' ? `<button class="btn-acao" onclick="marcarComoPago(${conta.id})">Pagar</button>` : '---'}
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}

async function marcarComoPago(id) {
    const resposta = await fetch(`/api/pagar/${id}`, { method: "POST" });
    if (resposta.ok) {
        carregarDadosDoDashboard();
    }
}
