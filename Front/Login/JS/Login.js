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

const traducoes = {
    pt: {
      "Titulo": "Entrar",
      "Mental": "MentalHelp",
      "Entrar": "Entrar",
      "placeholder": "Usuário",
      "placeholder1": "Senha",
      "Lembrar": "Lembrar-me",
      "Esquecer": "Esqueci a Senha",
      "SemConta": "Ainda não tem uma conta?",
      "Cadastrar": "Cadastre-se",
      "Paciente": "Paciente",
      "Medico": "Médico",
      "EntrarBtn": "Entrar"
    },
    es: {
      "Titulo": "Entrar",
      "Mental": "MentalHelp",
      "Entrar": "Entrar",  
      "placeholder": "Usuario",
      "placeholder1": "Contraseña",
      "Lembrar": "Recuérdame",
      "Esquecer": "Olvidé la contraseña",
      "SemConta": "¿Aún no tienes cuenta?",
      "Cadastrar": "Regístrate",
      "Paciente": "Paciente",
      "Medico": "Médico",
      "EntrarBtn": "Entrar"
    },
    en: {
      "Titulo": "Log in",
      "Mental": "MentalHelp",
      "Entrar": "Login",
      "placeholder": "Username",
      "placeholder1": "Password",
      "Lembrar": "Remember me",
      "Esquecer": "Forgot Password",
      "SemConta": "Don't have an account yet?",
      "Cadastrar": "Sign up",
      "Paciente": "Patient",
      "Medico": "Doctor",
      "EntrarBtn": "Login"
    }
  };
  
  function trocarIdioma() {
    const idiomaSelecionado = document.getElementById('language').value;
    const elementos = document.querySelectorAll('[data-i18n]');
  

    elementos.forEach(elemento => {
      const chave = elemento.getAttribute('data-i18n');
      if (traducoes[idiomaSelecionado] && traducoes[idiomaSelecionado][chave]) {
        elemento.textContent = traducoes[idiomaSelecionado][chave];
      }
    });
  
    const placeholders = document.querySelectorAll('[data-i18n="placeholder"], [data-i18n="placeholder1"]');
    placeholders.forEach(input => {
      const chave = input.getAttribute('data-i18n');
      if (traducoes[idiomaSelecionado] && traducoes[idiomaSelecionado][chave]) {
        input.placeholder = traducoes[idiomaSelecionado][chave];
      }
    });
  }
  
  window.onload = trocarIdioma;
  