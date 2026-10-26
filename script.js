const botaoMenu = document.querySelector("#botaoMenu");
const menu = document.querySelector("#menu");
const trilha = document.querySelector("#trilha");
const slides = document.querySelectorAll(".slide");
const indicadores = document.querySelector("#indicadores");
const anterior = document.querySelector("#anterior");
const proximo = document.querySelector("#proximo");
const botoesFiltro = document.querySelectorAll("[data-filtro]");
const projetos = document.querySelectorAll("[data-categoria]");

let slideAtual = 0;

botaoMenu.addEventListener("click", () => {
  menu.classList.toggle("aberto");
});

// Cria os indicadores do carrossel automaticamente.
slides.forEach((slide, indice) => {
  const indicador = document.createElement("button");
  indicador.className = "indicador";
  indicador.setAttribute("aria-label", `Ir para o slide ${indice + 1}`);
  indicador.addEventListener("click", () => mostrarSlide(indice));
  indicadores.appendChild(indicador);
});

const botoesIndicadores = document.querySelectorAll(".indicador");

function mostrarSlide(indice) {
  slideAtual = (indice + slides.length) % slides.length;
  trilha.style.transform = `translateX(-${slideAtual * 100}%)`;

  botoesIndicadores.forEach((botao, indiceBotao) => {
    botao.classList.toggle("ativo", indiceBotao === slideAtual);
  });
}

anterior.addEventListener("click", () => mostrarSlide(slideAtual - 1));
proximo.addEventListener("click", () => mostrarSlide(slideAtual + 1));

setInterval(() => {
  mostrarSlide(slideAtual + 1);
}, 5000);

// Filtra os cards usando o valor do atributo data-categoria.
botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    const filtro = botao.dataset.filtro;

    botoesFiltro.forEach((item) => item.classList.remove("ativo"));
    botao.classList.add("ativo");

    projetos.forEach((projeto) => {
      const deveAparecer = filtro === "todos" || projeto.dataset.categoria === filtro;
      projeto.style.display = deveAparecer ? "block" : "none";
    });
  });
});

mostrarSlide(0);
