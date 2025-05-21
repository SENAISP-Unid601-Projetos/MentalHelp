const traducoes = {
  pt: {
    Titulo: "Recuperação de Senha - MentalHelp",
    Recuperar: "Recuperação de Senha",
    placeholder: "Digite seu e-mail",
    Alerta: "Erro ao enviar e-mail. Verifique o endereço e tente novamente.",
    Enviar: "Enviar Recuperação",
    Conta: "Já tem uma conta?",
    Voltar: "Voltar ao Login",
  },
  es: {
    Titulo: "Recuperación de Contraseña - MentalHelp",
    Recuperar: "Recuperación de Contraseña",
    placeholder: "Ingrese su correo electrónico",
    Alerta: "Error al enviar el correo electrónico. Verifique la dirección e intente nuevamente.",
    Enviar: "Enviar Recuperación",
    Conta: "¿Ya tienes una cuenta?",
    Voltar: "Volver al Inicio de Sesión",
  },
  en: {
    Titulo: "Password Recovery - MentalHelp",
    Recuperar: "Password Recovery",
    placeholder: "Enter your email",
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
      if (elemento.placeholder !== undefined && elemento.tagName === "INPUT") {
        elemento.placeholder = traducoes[idiomaSelecionado][chave];
      } else {
        elemento.textContent = traducoes[idiomaSelecionado][chave];
      }
    }
  });
}

window.onload = trocarIdioma;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("recuperarSenhaForm");
  const emailInput = document.getElementById("email");
  const mensagemErro = document.getElementById("mensagemErro");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Impede envio real

    const email = emailInput.value.trim();

    if (email === "") {
      mensagemErro.classList.remove("d-none");
      return;
    }

    mensagemErro.classList.add("d-none"); // Esconde erro

    // Simula envio e mostra toast de sucesso
    setTimeout(() => {
      const toastEl = document.getElementById("toastSucesso");
      const toast = new bootstrap.Toast(toastEl);
      toast.show();

      // Limpa o campo após "envio"
      emailInput.value = "";
    }, 500);
  });
});
