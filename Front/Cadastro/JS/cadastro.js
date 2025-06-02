document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // Upload de imagem de perfil
    // ===============================
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

    // ===============================
    // Mostrar/esconder senha
    // ===============================
    function configurarToggleSenha() {
        const togglePassword = document.querySelector(".toggle-password");
        const senhaInput = document.getElementById("senhaInput");

        if (togglePassword && senhaInput) {
            togglePassword.addEventListener("click", () => {
                const senhaVisivel = senhaInput.type === "text";
                senhaInput.type = senhaVisivel ? "password" : "text";

                togglePassword.classList.toggle("bi-eye", senhaVisivel);
                togglePassword.classList.toggle("bi-eye-slash", !senhaVisivel);
            });
        }
    }

    configurarToggleSenha();

    // ===============================
    // Validação de email
    // ===============================
    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    // ===============================
    // Lógica de envio do formulário
    // ===============================
    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = form.querySelector('#nomeInput');
            const cpf = form.querySelector('#cpfInput');
            const email = form.querySelector('#emailInput');
            const senha = form.querySelector('#senhaInput');
            const fotoInput = document.getElementById('uploadPaciente');

            if (!nome.value.trim() || !cpf.value.trim() || !email.value.trim() || !senha.value.trim()) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            if (senha.value.length < 6) {
                alert("A senha deve ter no mínimo 6 caracteres.");
                return;
            }

            if (!validateEmail(email.value)) {
                alert("Formato de e-mail inválido.");
                return;
            }

            if (!fotoInput.files || fotoInput.files.length === 0) {
                alert("Por favor, selecione uma imagem de perfil.");
                return;
            }

            const formData = new FormData();
            const pacienteDTO = {
                nome: nome.value.trim(),
                cpf: cpf.value.trim(),
                email: email.value.trim(),
                senha: senha.value.trim(),
                foto: "temporario" // será substituído no backend
            };

            formData.append("foto", fotoInput.files[0]);
            formData.append("pacienteEntradaDTO", new Blob([JSON.stringify(pacienteDTO)], {
                type: "application/json"
            }));

            try {
                const response = await axios.post("http://10.110.12.49:9500/paciente/post", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                alert("Cadastro realizado com sucesso!");
                console.log(response.data);
                form.reset();
                document.getElementById('avatarPaciente').src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            } catch (error) {
                console.error(error);
                alert("Erro ao cadastrar paciente. Verifique os dados e tente novamente.");
            }
        });
    }
});
