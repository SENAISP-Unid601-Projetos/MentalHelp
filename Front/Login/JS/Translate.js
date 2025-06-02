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
  