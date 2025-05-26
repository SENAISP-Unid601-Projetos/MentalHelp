const translationsPaciente = {
    pt: {
        tituloCadastro: "Cadastro",
        nome: "Nome",
        cpf: "CPF",
        email: "Email",
        senha: "Senha",
        cadastro: "Cadastro",
        loginTexto: "Já tem uma conta?",
        loginLink: "Log in",
    },
    en: {
        tituloCadastro: "Register",
        nome: "Name",
        cpf: "Social Security Number",
        email: "Email",
        senha: "Password",
        cadastro: "Register",
        loginTexto: "Already have an account?",
        loginLink: "Log in",
    },
    es: {
        tituloCadastro: "Registro",
        nome: "Nombre",
        cpf: "Número de Identificación Fiscal",
        email: "Correo electrónico",
        senha: "Contraseña",
        cadastro: "Registrarse",
        loginTexto: "¿Ya tienes una cuenta?",
        loginLink: "Iniciar sesión",
    }
};

function updateContentPaciente(lang) {
    const t = translationsPaciente[lang];

    document.getElementById("pageTitle").textContent = t.tituloCadastro + " - MentalHelp";
    document.getElementById("mainTitle").textContent = t.tituloCadastro;
    document.getElementById("nomeInput").placeholder = t.nome;
    document.getElementById("cpfInput").placeholder = t.cpf;
    document.getElementById("emailInput").placeholder = t.email;
    document.getElementById("senhaInput").placeholder = t.senha;
    document.getElementById("btnCadastro").textContent = t.cadastro;

    const loginLinkTextElement = document.getElementById("loginLinkText");
    if (loginLinkTextElement) {
        loginLinkTextElement.childNodes[0].nodeValue = t.loginTexto + " ";
    }
    document.getElementById("loginLink").textContent = t.loginLink;
}

const savedLangPaciente = localStorage.getItem("lang") || "pt";
updateContentPaciente(savedLangPaciente);

const langSelectPaciente = document.getElementById("languageSelect");
if (langSelectPaciente) {
    langSelectPaciente.value = savedLangPaciente;
    langSelectPaciente.addEventListener("change", function () {
        const lang = this.value;
        localStorage.setItem("lang", lang);
        updateContentPaciente(lang);
    });
}
