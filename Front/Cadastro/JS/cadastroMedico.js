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


    configurarUpload('avatarMedico', 'uploadMedico');


    const form = document.querySelector("form");


    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();


            const nome = form.querySelector('input[placeholder="Nome"]');
            const crm = form.querySelector('input[placeholder="CRM"]');
            const email = form.querySelector('input[placeholder="Email"]');
            const senha = form.querySelector('input[placeholder="Senha"]');
            const especialidades = form.querySelector('input[placeholder="Especialidades"]');
            const fotoInput = document.getElementById('uploadMedico');


            // Validação básica
            if (!nome.value.trim() || !crm.value.trim() || !email.value.trim() || !senha.value.trim()) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }


            if (senha.value.length < 6) {
                alert("A senha deve ter no mínimo 6 caracteres.");
                return;
            }


            if (crm.value.length < 4) {
                alert("O CRM está muito curto.");
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


            // Criando o FormData para enviar a imagem + JSON
            const formData = new FormData();
            const profissionalDTO = {
                nome: nome.value.trim(),
                crm: crm.value.trim(),
                email: email.value.trim(),
                senha: senha.value.trim(),
                especialidade: especialidades.value.trim(), // <- corrigido
                foto: "temporario"
            };
           


            formData.append("foto", fotoInput.files[0]);
            formData.append("profissionalEntradaDTO", new Blob([JSON.stringify(profissionalDTO)], {
                type: "application/json"
            }));


            try {
                const response = await axios.post("http://10.110.12.50:5000/profissional/post", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });


                alert("Cadastro realizado com sucesso!");
                console.log(response.data);
                form.reset();
                document.getElementById('avatarMedico').src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            } catch (error) {
                console.error(error);
                console.log(error.response.data);
                alert("Erro ao cadastrar médico. Verifique os dados e tente novamente.");
            }
        });
    }


    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }


    // Mostrar/ocultar senha
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
