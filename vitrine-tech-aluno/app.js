// MISSÃO 2:
// Execute o Prettier e o ESLint neste arquivo.
// Observe o que muda e registre uma evidência no CHECKLIST.md.

const botoes = document.querySelectorAll(".curtir");
const mensagem = document.querySelector("#mensagem");

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    mensagem.textContent = "Projeto curtido!";
  });
});
