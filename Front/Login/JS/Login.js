import loginService from "../src/service/loginService.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const loginBtn = document.getElementById('loginBtn');
    const languageSelect = document.getElementById('language');
    const toggleSenha = document.getElementById('toggleSenha');

    // Verifica se todos os elementos necessários estão presentes
    if (!loginForm || !emailInput || !senhaInput || !loginBtn || !languageSelect || !toggleSenha) {
        console.error('Um ou mais elementos do formulário não foram encontrados no DOM.');
        Swal.fire({
            title: 'Internal Error',
            text: 'Unable to load the page. Please reload.',
            icon: 'error'
        });
        return;
    }

    // Função para alternar a visibilidade da senha
    toggleSenha.addEventListener('click', () => {
        const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
        senhaInput.setAttribute('type', type);
        toggleSenha.classList.toggle('bi-eye-slash');
        toggleSenha.classList.toggle('bi-eye');
    });

    // Validação do formulário de login
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o envio do formulário para testar as validações

        // Define idiomaSelecionado no escopo do evento submit
        const idiomaSelecionado = languageSelect.value || 'pt';

     
            // Verifica se o objeto traducoes está disponível
            console.log('oi');
            if (!window.traducoes || !window.traducoes[idiomaSelecionado]) {
                console.error('Objeto de traduções não encontrado ou idioma inválido:', idiomaSelecionado);
                Swal.fire({
                    title: 'Internal Error',
                    text: 'Unable to load translations. Please try again.',
                    icon: 'error'
                });
                return;
            }
            console.log('oi2')

            // Verificação básica de campos obrigatórios
            if (!emailInput.value || !senhaInput.value) {
                Swal.fire({
                    title: window.traducoes[idiomaSelecionado].CamposObrigatorios,
                    icon: 'warning'
                });
                return;
            }
            console.log('oi3')
            // Exibe o spinner e desabilita o botão de login
            loginBtn.disabled = true;

            // Requisição para o servidor para validar o login
            const loginData = {
                email: emailInput.value,
                senha: senhaInput.value
            };

            // Token de sessão
            const { token, flag } = await loginService.checkUserAuth(loginData.email, loginData.senha);
            console.log(token, flag);
            if (token && !flag) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: window.traducoes[idiomaSelecionado].LoginSucesso,
                    showConfirmButton: false,
                    timer: 1000
                });
                loginBtn.disabled = false;
                setTimeout(() => { window.location.href = '../index.html?token=' + encodeURIComponent(token) }, 1000);
            } else if (token && flag) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: window.traducoes[idiomaSelecionado].LoginSucesso,
                    showConfirmButton: false,
                    timer: 1000
                });
                loginBtn.disabled = false;
                setTimeout(() => { window.location.href = '../index.html?token=' + encodeURIComponent(token) }, 1000); // WIP trocar para profissional
            } else {
                loginBtn.disabled = false;
                Swal.fire({
                    title: window.traducoes[idiomaSelecionado].LoginInvalidoTitulo,
                    text: window.traducoes[idiomaSelecionado].LoginInvalidoTexto,
                    icon: 'warning'
                });
            }
    });
});