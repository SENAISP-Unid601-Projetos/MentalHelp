function configurarUpload(avatarId, inputId) {
    const avatar = document.getElementById(avatarId);
    const input = document.getElementById(inputId);

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                avatar.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Chama a função para o paciente, se os elementos existirem
if (document.getElementById('avatarPaciente') && document.getElementById('uploadPaciente')) {
    configurarUpload('avatarPaciente', 'uploadPaciente');
}

// Chama a função para o médico, se os elementos existirem
if (document.getElementById('avatarMedico') && document.getElementById('uploadMedico')) {
    configurarUpload('avatarMedico', 'uploadMedico');
}



  const translations = {
    pt: {
      title: "Cadastro Médico",
      name: "Nome",
      crm: "CRM",
      email: "Email",
      password: "Senha",
      specialties: "Especialidades",
      remember: "Lembrar-me",
      register: "Cadastro",
      alreadyAccount: "Já tem uma conta?",
      login: "Log in"
    },
    en: {
      title: "Doctor Registration",
      name: "Name",
      crm: "Medical License",
      email: "Email",
      password: "Password",
      specialties: "Specialties",
      remember: "Remember me",
      register: "Register",
      alreadyAccount: "Already have an account?",
      login: "Log in"
    },
    es: {
      title: "Registro Médico",
      name: "Nombre",
      crm: "Licencia Médica",
      email: "Correo electrónico",
      password: "Contraseña",
      specialties: "Especialidades",
      remember: "Recuérdame",
      register: "Registro",
      alreadyAccount: "¿Ya tienes una cuenta?",
      login: "Iniciar sesión"
    }
  };

  const langSelect = document.getElementById("languageSelect");

  function updateTexts(lang) {
    const t = translations[lang];
    document.querySelector("h2").textContent = t.title;
    document.querySelectorAll("input")[0].placeholder = t.name;
    document.querySelectorAll("input")[1].placeholder = t.crm;
    document.querySelectorAll("input")[2].placeholder = t.email;
    document.querySelectorAll("input")[3].placeholder = t.password;
    document.querySelectorAll("input")[4].placeholder = t.specialties;
    document.querySelector("label[for='lembrar']").textContent = t.remember;
    document.querySelector("button[type='submit']").textContent = t.register;
    document.querySelector(".text-center.small").innerHTML =
      `${t.alreadyAccount} <a href="#" class="text-purple fw-semibold fst-italic">${t.login}</a>`;
  }

  if (langSelect) {
    langSelect.addEventListener("change", () => {
      const lang = langSelect.value;
      localStorage.setItem("language", lang);
      updateTexts(lang);
    });

    const savedLang = localStorage.getItem("language") || "pt";
    langSelect.value = savedLang;
    updateTexts(savedLang);
  }

