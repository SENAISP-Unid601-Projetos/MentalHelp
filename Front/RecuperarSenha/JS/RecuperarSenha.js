document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recuperarSenhaForm');
    const mensagemErro = document.getElementById('mensagemErro');
    const emailInput = document.getElementById('email');

    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Impede o envio do formulário para validação

        // Limpar mensagens de erro anteriores
        mensagemErro.classList.add('d-none');
        
        const email = emailInput.value;

        // Validação simples do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            mensagemErro.textContent = "Por favor, insira um e-mail válido.";
            mensagemErro.classList.remove('d-none');
            return;
        }

        // Enviar a requisição para o back-end
        fetch('http://seu-backend.com/api/recuperar-senha', {  // Substitua pela URL do seu back-end
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })  // Envia o e-mail para o back-end
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Verifique seu e-mail para redefinir sua senha.");
                window.location.href = "loginPage.html";  // Redireciona para o login
            } else {
                mensagemErro.textContent = data.message || "Erro ao enviar o e-mail.";
                mensagemErro.classList.remove('d-none');
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            mensagemErro.textContent = "Erro ao tentar recuperar a senha. Tente novamente mais tarde.";
            mensagemErro.classList.remove('d-none');
        });
    });
});

