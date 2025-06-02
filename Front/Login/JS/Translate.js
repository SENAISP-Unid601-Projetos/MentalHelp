window.traducoes = {
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
    "EntrarBtn": "Entrar",
    "LoginSucesso": "Login efetuado com sucesso!",
    "LoginInvalidoTitulo": "Login inválido",
    "LoginInvalidoTexto": "Verifique suas credenciais",
    "ErroRedeTitulo": "Erro de rede",
    "ErroRedeTexto": "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
    "CamposObrigatorios": "Por favor, preencha todos os campos."
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
    "EntrarBtn": "Entrar",
    "LoginSucesso": "¡Inicio de sesión exitoso!",
    "LoginInvalidoTitulo": "Inicio de sesión inválido",
    "LoginInvalidoTexto": "Verifica tus credenciales",
    "ErroRedeTitulo": "Error de red",
    "ErroRedeTexto": "No se pudo conectar al servidor. Intenta de nuevo más tarde.",
    "CamposObrigatorios": "Por favor, completa todos los campos."
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
    "EntrarBtn": "Login",
    "LoginSucesso": "Login successful!",
    "LoginInvalidoTitulo": "Invalid login",
    "LoginInvalidoTexto": "Please check your credentials",
    "ErroRedeTitulo": "Network error",
    "ErroRedeTexto": "Unable to connect to the server. Please try again later.",
    "CamposObrigatorios": "Please fill in all fields."
  }
};

function trocarIdioma() {
  const idiomaSelecionado = document.getElementById('language').value;
  const elementos = document.querySelectorAll('[data-i18n]');

  elementos.forEach(elemento => {
    const chave = elemento.getAttribute('data-i18n');
    if (window.traducoes[idiomaSelecionado] && window.traducoes[idiomaSelecionado][chave]) {
      elemento.textContent = window.traducoes[idiomaSelecionado][chave];
    }
  });

  const placeholders = document.querySelectorAll('[data-i18n="placeholder"], [data-i18n="placeholder1"]');
  placeholders.forEach(input => {
    const chave = input.getAttribute('data-i18n');
    if (window.traducoes[idiomaSelecionado] && window.traducoes[idiomaSelecionado][chave]) {
      input.placeholder = window.traducoes[idiomaSelecionado][chave];
    }
  });
}

window.onload = trocarIdioma;