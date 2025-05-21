import loginService from "./src/service/loginService.js"

document.addEventListener('DOMContentLoaded', function() {
    const senhaInput = document.getElementById('senha');
    const toggleSenha = document.getElementById('toggleSenha');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const loginBtn = document.getElementById('loginBtn');

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
    loginForm.addEventListener('submit', async function(event) {
        
        event.preventDefault(); // Impede o envio do formulário para testar as validações
    
        try{

            // Verificação básica de campos obrigatórios
            if (!emailInput.value || !senhaInput.value) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
        
            // Exibe o spinner e desabilita o botão de login
            loginBtn.disabled = true;
        
            // Requisição para o servidor para validar o login
            const loginData = {
                email: emailInput.value,
                senha: senhaInput.value
            };

            //Token de sessão
            const {token , flag } =  await loginService.checkUserAuth(loginData.email, loginData.senha);
            console.log(token,flag)
            if(token && !flag){
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Login efetuado com sucesso!",
                    showConfirmButton: false,
                    timer: 1000
                  });
                loginBtn.disabled = false;
                setTimeout(()=>{window.location.href = "../index.html?token=" + encodeURIComponent(token)},1000)
            } else if(token && flag){
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Login efetuado com sucesso!",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                loginBtn.disabled = false;
                setTimeout(()=>{window.location.href = "../index.html?token=" + encodeURIComponent(token)},1000) //WIP trocar para profissional
            } else {
                loginBtn.disabled = false;
                Swal.fire({
                    title: "Login invalido",
                    text: "Verifique suas credenciais",
                    icon: "warning"
                });
            }
        } catch (err){
            loginBtn.disabled = false;
            Swal.fire({
                title: "Erro de rede",
                text: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
                icon: "error"
            });
        }
    
    
    });
});