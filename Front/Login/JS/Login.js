document.addEventListener('DOMContentLoaded', function() {
    const senhaInput = document.getElementById('senha');
    const toggleSenha = document.getElementById('toggleSenha');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const loginBtn = document.getElementById('loginBtn');

    axios.defaults.baseURL = 'http://10.110.12.50:9500/';

    toggleSenha.addEventListener('click', function() {
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            toggleSenha.classList.replace('bi-eye-slash', 'bi-eye');
        } else {
            senhaInput.type = 'password';
            toggleSenha.classList.replace('bi-eye', 'bi-eye-slash');
        }
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        loginBtn.disabled = true;

        const loginData = {
            email: email,
            senha: senha
        };

        axios.post('/profissional/login', loginData)
            .then(response => {
                const data = response.data;
                console.log(data);

                if (data.message === 'Login successful!') {
                    alert('Login realizado com sucesso!');
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Credenciais inválidas. Tente novamente.');
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
            })
            .finally(() => {
                loginBtn.disabled = false;
            });
    });
});


function validarFormulario(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (email === '' || senha === '') {
      // Mostrar modal de erro
      const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
      erroModal.show();
    } else {
      // Mostrar modal de sucesso
      const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));
      sucessoModal.show();
    }
  }

