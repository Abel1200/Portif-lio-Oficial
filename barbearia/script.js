document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-agendamento');
    const modal = document.getElementById('checkout-modal');
    const resumoPedido = document.getElementById('resumo-pedido');
    const areaPix = document.getElementById('area-pix');
    const areaCartao = document.getElementById('area-cartao');
    const btnFinalizar = document.getElementById('btn-finalizar');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que a página recarregue ao enviar

        // Captura os dados inseridos
        const nome = document.getElementById('nome').value;
        const seletorServico = document.getElementById('servico');
        const nomeServico = seletorServico.options[seletorServico.selectedIndex].text.split(' - ')[0];
        const precoServico = seletorServico.value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const metodoPagamento = document.getElementById('pagamento').value;

        // Trata a data para formato BR (DD/MM/AAAA)
        const dataFormatada = data.split('-').reverse().join('/');

        // Constrói a mensagem informativa de Checkout
        resumoPedido.innerHTML = `Olá <strong>${nome}</strong>! Confirmamos sua vaga para o serviço <strong>${nomeServico}</strong> no dia <strong>${dataFormatada}</strong> às <strong>${hora}h</strong>.<br><br>Valor a ser pago antecipadamente: <strong>R$ ${precoServico}</strong>`;

        // Reseta visibilidade das telas internas de checkout
        areaPix.classList.add('hidden');
        areaCartao.classList.add('hidden');

        // Exibe especificamente o formulário do meio escolhido
        if (metodoPagamento === 'pix') {
            areaPix.classList.remove('hidden');
        } else if (metodoPagamento === 'cartao') {
            areaCartao.classList.remove('hidden');
        }

        // Abre o modal de pagamento na tela
        modal.classList.remove('hidden');
        modal.scrollIntoView({ behavior: 'smooth' });
    });

    btnFinalizar.addEventListener('click', function() {
        alert('Pagamento processado com sucesso! Seu horário na BarberShop VIP foi reservado. Aguardamos você!');
        
        // Limpa as seleções e fecha a janela pós-sucesso
        form.reset();
        modal.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
