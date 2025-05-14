import loginService from "./src/service/loginService"

document.addEventListener('DOMContentLoaded', function() {
const senhaInput = document.getElementById('senha');
const toggleSenha = document.getElementById('toggleSenha');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const loginBtn = document.getElementById('loginBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

// Função para alternar a visibilidade da senha
toggleSenha.addEventListener('click', function() {
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleSenha.classList.remove('bi-eye-slash');
        toggleSenha.classList.add('bi-eye');
    } else {
        senhaInput.type = 'password';
        toggleSenha.classList.remove('bi-eye');
        toggleSenha.classList.add('bi-eye-slash');
        }
    }   
);

// Validação do formulário de login
loginForm.addEventListener('submit', function(event) {
    
    event.preventDefault(); // Impede o envio do formulário para testar as validações

    // Verificação básica de campos obrigatórios
    if (!emailInput.value || !senhaInput.value) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Exibe o spinner e desabilita o botão de login
    loginBtn.disabled = true;
    loadingSpinner.classList.remove('d-none');

    // Requisição para o servidor para validar o login
    const loginData = {
        email: emailInput.value,
        senha: senhaInput.value
    };

    //Token de sessão
    const token = loginService.checkUserAuth(loginData.email, loginData.senha);

    console.log(token);
    console.log(loginData.email, loginData.senha);

    // fetch('https://seu-backend.com/api/login', { // URL do seu backend
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(loginData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // Esconde o spinner e reabilita o botão de login
    //     loadingSpinner.classList.add('d-none');
    //     loginBtn.disabled = false;

    //     if (data.success) {
    //         // Se o login for bem-sucedido, redireciona ou realiza outra ação
    //         alert('Login realizado com sucesso!');
    //         window.location.href = 'dashboard.html'; // Redireciona para a página do dashboard
    //     } else {
    //         // Se o login falhar, exibe uma mensagem de erro
    //         alert('Credenciais inválidas. Tente novamente.');
    //     }
    // })
    // .catch(error => {
    // // Erro de rede ou outra falha
    // console.error('Erro:', error);
    // loadingSpinner.classList.add('d-none');
    // loginBtn.disabled = false;
    // alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
    // });
});
});