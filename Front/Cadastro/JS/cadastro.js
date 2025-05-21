document.addEventListener("DOMContentLoaded", () => {
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

    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = form.querySelector('input[placeholder="Nome"]');
            const cpf = form.querySelector('input[placeholder="CPF"]');
            const email = form.querySelector('input[placeholder="Email"]');
            const senha = form.querySelector('input[placeholder="Senha"]');
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
                foto: "temporario"
            };

            formData.append("foto", fotoInput.files[0]);
            formData.append("pacienteEntradaDTO", new Blob([JSON.stringify(pacienteDTO)], {
                type: "application/json"
            }));

            try {
                const response = await axios.post("http://10.110.12.52:9500/paciente/post", formData, {
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

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
});