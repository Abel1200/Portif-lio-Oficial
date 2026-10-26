// MISSÃO 2:
// Execute o Prettier e o ESLint neste arquivo.
// Observe o que muda e registre uma evidência no CHECKLIST.md.

"use strict";

var botoes = document.querySelectorAll(".curtir");
var mensagem = document.querySelector("#mensagem");

botoes.forEach(function (botao) {
  botao.addEventListener("click", function () {
    mensagem.textContent = "Projeto curtido!";
  });
});
