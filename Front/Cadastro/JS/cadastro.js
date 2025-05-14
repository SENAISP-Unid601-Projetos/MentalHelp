document.addEventListener("DOMContentLoaded", () => {
    // ----------- UPLOAD DE AVATAR -----------
    function configurarUpload(avatarId, inputId) {
        const avatar = document.getElementById(avatarId);
        const input = document.getElementById(inputId);

        if (avatar && input) {
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
    }

    configurarUpload('avatarPaciente', 'uploadPaciente');
    configurarUpload('avatarMedico', 'uploadMedico');

    // ----------- VALIDAÇÃO DE FORMULÁRIO -----------
    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = form.querySelector('input[placeholder="Nome"]');
            const email = form.querySelector('input[type="email"]');
            const senha = form.querySelector('input[type="password"]');
            const campoExtra = form.querySelector('input[placeholder="CPF"]') || form.querySelector('input[placeholder="CRM"]');
            const avatar = document.querySelector('#avatarPaciente') || document.querySelector('#avatarMedico');

            if (!nome.value.trim() || !email.value.trim() || !senha.value.trim() || !campoExtra.value.trim()) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            if (!validateEmail(email.value)) {
                alert("Formato de e-mail inválido.");
                return;
            }

            if (senha.value.length < 6) {
                alert("A senha deve ter no mínimo 6 caracteres.");
                return;
            }

            if (campoExtra.placeholder === "CPF" && campoExtra.value.length !== 11) {
                alert("O CPF deve ter 11 números.");
                return;
            }

            if (campoExtra.placeholder === "CRM" && campoExtra.value.length < 4) {
                alert("O CRM está muito curto.");
                return;
            }

            if (!avatar || avatar.src.includes("847969.png")) {
                alert("Por favor, selecione uma imagem de perfil.");
                return;
            }

            alert("Formulário enviado com sucesso!");
            form.submit(); // Substituir por AJAX/fetch se necessário
        });
    }

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    // ----------- MOSTRAR/OCULTAR SENHA -----------
    const togglePassword = document.querySelector(".toggle-password");
    const senhaInput = document.querySelector('input[type="password"]');

    if (togglePassword && senhaInput) {
        togglePassword.addEventListener("click", () => {
            const isPassword = senhaInput.type === "password";
            senhaInput.type = isPassword ? "text" : "password";
            togglePassword.classList.toggle("bi-eye");
            togglePassword.classList.toggle("bi-eye-slash");
        });
    }
});
