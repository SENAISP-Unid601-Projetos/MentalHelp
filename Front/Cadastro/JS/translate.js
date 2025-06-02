window.translationsPaciente = {
    pt: {
        tituloCadastro: "Cadastro Paciente",
        nome: "Nome",
        cpf: "CPF",
        email: "Email",
        senha: "Senha",
        cadastro: "Cadastro",
        loginTexto: "Já tem uma conta?",
        loginLink: "Log in",
        camposObrigatorios: "Por favor, preencha todos os campos obrigatórios.",
        senhaCurta: "A senha deve ter no mínimo 6 caracteres.",
        emailInvalido: "Formato de e-mail inválido.",
        imagemAusente: "Por favor, selecione uma imagem de perfil.",
        cadastroSucesso: "Cadastro realizado com sucesso!",
        cadastroErro: "Erro ao cadastrar paciente. Verifique os dados e tente novamente."
    },
    en: {
        tituloCadastro: "Registration",
        nome: "Name",
        cpf: "Social Security Number",
        email: "Email",
        senha: "Password",
        cadastro: "Register",
        loginTexto: "Already have an account?",
        loginLink: "Log in",
        camposObrigatorios: "Please fill in all required fields.",
        senhaCurta: "The password must have at least 6 characters.",
        emailInvalido: "Invalid email format.",
        imagemAusente: "Please select a profile picture.",
        cadastroSucesso: "Registration successful!",
        cadastroErro: "Error registering patient. Please check the data and try again."
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
        camposObrigatorios: "Por favor, completa todos los campos obligatorios.",
        senhaCurta: "La contraseña debe tener al menos 6 caracteres.",
        emailInvalido: "Formato de correo electrónico inválido.",
        imagemAusente: "Por favor, selecciona una imagen de perfil.",
        cadastroSucesso: "¡Registro exitoso!",
        cadastroErro: "Error al registrar paciente. Verifica los datos e intenta de nuevo."
    }
};

function updateContentPaciente(lang) {
    const t = window.translationsPaciente[lang];

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