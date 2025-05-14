const translations = {
    pt: {
        tituloCadastro: "Cadastro Médico",
        nome: "Nome",
        crm: "CRM",
        email: "Email",
        senha: "Senha",
        especialidades: "Especialidades",
        cadastrar: "Cadastro",
        loginTexto: "Já tem uma conta?",
        loginLink: "Log in",
    },
    en: {
        tituloCadastro: "Doctor Registration",
        nome: "Name",
        crm: "Medical License (CRM)",
        email: "Email",
        senha: "Password",
        especialidades: "Specialties",
        cadastrar: "Register",
        loginTexto: "Already have an account?",
        loginLink: "Log in",
    },
    es: {
        tituloCadastro: "Registro Médico",
        nome: "Nombre",
        crm: "Licencia Médica (CRM)",
        email: "Correo electrónico",
        senha: "Contraseña",
        especialidades: "Especialidades",
        cadastrar: "Registrarse",
        loginTexto: "¿Ya tienes una cuenta?",
        loginLink: "Iniciar sesión",
    }
};

function updateContent(lang) {
    const t = translations[lang];

    document.getElementById("pageTitle").textContent = t.tituloCadastro + " - MentalHelp"; // Atualiza o título da página
    document.getElementById("mainTitle").textContent = t.tituloCadastro; // Atualiza o título principal (h2)

    document.getElementById("nomeInput").placeholder = t.nome;
    document.getElementById("crmInput").placeholder = t.crm;
    document.getElementById("emailInput").placeholder = t.email;
    document.getElementById("senhaInput").placeholder = t.senha;
    document.getElementById("especialidadesInput").placeholder = t.especialidades;

    document.getElementById("btnCadastro").textContent = t.cadastrar;

    const loginLinkTextElement = document.getElementById("loginLinkText");
    if (loginLinkTextElement) {
        loginLinkTextElement.childNodes[0].nodeValue = t.loginTexto + " ";
    }
    document.getElementById("loginLink").textContent = t.loginLink;
}

// Detectar idioma salvo ou usar "pt" como padrão
const savedLang = localStorage.getItem("lang") || "pt";
updateContent(savedLang);

// Caso queira deixar um <select id="languageSelect"> na página:
const langSelect = document.getElementById("languageSelect");
if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener("change", function () {
        const lang = this.value;
        localStorage.setItem("lang", lang);
        updateContent(lang);
    });
}