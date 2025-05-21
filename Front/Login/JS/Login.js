document.addEventListener('DOMContentLoaded', function () {
    const senhaInput = document.getElementById('senha');
    const toggleSenha = document.getElementById('toggleSenha');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const loginBtn = document.getElementById('loginBtn');

    // Inicializa as instâncias dos modais do Bootstrap
    const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
    // O modal de sucesso não será usado para redirecionamento neste cenário,
    // mas pode ser mantido para exibir mensagens fictícias se desejar.
    // const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));

    // Alterna a visibilidade da senha
    toggleSenha.addEventListener('click', function () {
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            toggleSenha.classList.replace('bi-eye-slash', 'bi-eye');
        } else {
            senhaInput.type = 'password';
            toggleSenha.classList.replace('bi-eye', 'bi-eye-slash');
        }
    });

    // Lida com o envio do formulário de login
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Previne o envio padrão do formulário

        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        // **Validação dos campos no frontend:**
        if (email === '' || senha === '') {
            erroModal.show(); // Mostra o modal de erro se os campos estiverem vazios
            return; // Interrompe o processo
        }

        // Se os campos NÃO estiverem vazios, redireciona.
        // Nenhuma chamada a API ou verificação de credenciais fictícia aqui.
        console.log('Campos preenchidos. Redirecionando para:', '../../index.html');
        window.location.href = '../../index.html'; // Redireciona para a página principal

        // Neste cenário fictício, o botão pode até permanecer desabilitado rapidamente,
        // mas a página vai mudar tão rápido que o usuário não perceberá.
        // Se você quiser, pode remover a linha abaixo:
        // loginBtn.disabled = true;
    });

    // **Comportamento ao fechar o modal de erro:**
    // O usuário permanece na mesma página.
    document.getElementById('erroModal').addEventListener('hidden.bs.modal', function () {
        // Nada a fazer aqui. O usuário permanece na página.
    });

    // Neste cenário, o modal de sucesso e seu evento de fechamento não são usados
    // para o redirecionamento principal, pois o redirecionamento é imediato.
    // Você pode remover este bloco se não for usá-lo para outras mensagens.
    // document.getElementById('sucessoModal').addEventListener('hidden.bs.modal', function () {
    //     window.location.href = '../../index.html';
    // });
});

// A função `validarFormulario` não é mais necessária e pode ser removida.
// Ou mantida como um aviso, caso ainda esteja sendo referenciada em algum lugar.
function validarFormulario(event) {
    event.preventDefault();
    console.warn('validarFormulario foi chamada, mas sua lógica está no listener de submit do loginForm.');
}