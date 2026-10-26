// Variáveis do Cronômetro Pomodoro
let timerInterval;
let timeLeft = 25 * 60; // 25 minutos em segundos
let isRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function toggleTimer() {
    const startBtn = document.getElementById('start-btn');
    if (isRunning) {
        // Modo: Pausar
        clearInterval(timerInterval);
        startBtn.textContent = 'Iniciar';
        startBtn.style.backgroundColor = 'var(--primary)';
    } else {
        // Modo: Iniciar
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                alert('Tempo de foco esgotado! Faça uma pausa de 5 minutos.');
                resetTimer();
            }
        }, 1000);
        startBtn.textContent = 'Pausar';
        startBtn.style.backgroundColor = '#eab308'; // Cor amarela para indicar pausa
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 25 * 60;
    isRunning = false;
    updateTimerDisplay();
    const startBtn = document.getElementById('start-btn');
    startBtn.textContent = 'Iniciar';
    startBtn.style.backgroundColor = 'var(--primary)';
}

// Funções do Gerenciador de Tarefas (To-Do List)
function addTask() {
    const input = document.getElementById('task-input');
    const taskText = input.value.trim();

    if (taskText === '') {
        alert('Digite uma tarefa antes de adicionar!');
        return;
    }

    const ul = document.getElementById('task-list');
    const li = document.createElement('li');

    // Insere o texto e o botão de excluir na nova linha
    li.innerHTML = `
        <span class="task-text" onclick="toggleTask(this)">${taskText}</span>
        <button class="delete-btn" onclick="deleteTask(this)">❌</button>
    `;

    ul.appendChild(li);
    input.value = ''; // Limpa a caixa de texto
}

function handleKeyPress(event) {
    // Permite adicionar a tarefa ao apertar a tecla Enter
    if (event.key === 'Enter') {
        addTask();
    }
}

function toggleTask(element) {
    // Liga/desliga o efeito de texto riscado (tarefa feita)
    element.parentElement.classList.toggle('completed');
}

function deleteTask(element) {
    // Remove a linha da tarefa permanentemente
    element.parentElement.remove();
}
