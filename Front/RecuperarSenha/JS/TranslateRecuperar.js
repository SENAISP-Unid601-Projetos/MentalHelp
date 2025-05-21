const traducoes = {
  pt: {
    Titulo: "Recuperação de Senha - MentalHelp",
    Recuperar: "Recuperação de Senha",
    Placeholder: "Digite seu e-mail",
    Alerta: "Erro ao enviar e-mail. Verifique o endereço e tente novamente.",
    Enviar: "Enviar Recuperação",
    Conta: "Já tem uma conta?",
    Voltar: "Voltar ao Login",
  },
  es: {
    Titulo: "Recuperación de Contraseña - MentalHelp",
    Recuperar: "Recuperación de Contraseña",
    Placeholder: "Ingrese su correo electrónico",
    Alerta: "Error al enviar el correo electrónico. Verifique la dirección e intente nuevamente.",
    Enviar: "Enviar Recuperación",
    Conta: "¿Ya tienes una cuenta?",
    Voltar: "Volver al Inicio de Sesión",
  },
  en: {
    Titulo: "Password Recovery - MentalHelp",
    Recuperar: "Password Recovery",
    Placeholder: "Enter your email",
    Alerta: "Error sending email. Please check the address and try again.",
    Enviar: "Send Recovery",
    Conta: "Already have an account?",
    Voltar: "Back to Login",
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