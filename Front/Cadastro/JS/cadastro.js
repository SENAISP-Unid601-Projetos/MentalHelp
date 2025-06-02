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
    const languageSelect = document.getElementById("languageSelect");

    if (!form || !languageSelect) {
        console.error('Formulário ou seletor de idioma não encontrados no DOM.');
        Swal.fire({
            title: 'Internal Error',
            text: 'Unable to load the page. Please reload.',
            icon: 'error'
        });
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idiomaSelecionado = languageSelect.value || 'pt';

        // Verifica se o objeto translationsPaciente está disponível
        if (!window.translationsPaciente || !window.translationsPaciente[idiomaSelecionado]) {
            console.error('Objeto de traduções não encontrado ou idioma inválido:', idiomaSelecionado);
            Swal.fire({
                title: 'Internal Error',
                text: 'Unable to load translations. Please try again.',
                icon: 'error'
            });
            return;
        }

        const nome = form.querySelector('#nomeInput');
        const cpf = form.querySelector('#cpfInput');
        const email = form.querySelector('#emailInput');
        const senha = form.querySelector('#senhaInput');
        const fotoInput = document.getElementById('uploadPaciente');

        if (!nome.value.trim() || !cpf.value.trim() || !email.value.trim() || !senha.value.trim()) {
            Swal.fire({
                title: window.translationsPaciente[idiomaSelecionado].camposObrigatorios,
                icon: 'warning'
            });
            return;
        }

        if (senha.value.length < 6) {
            Swal.fire({
                title: window.translationsPaciente[idiomaSelecionado].senhaCurta,
                icon: 'warning'
            });
            return;
        }

        if (!validateEmail(email.value)) {
            Swal.fire({
                title: window.translationsPaciente[idiomaSelecionado].emailInvalido,
                icon: 'warning'
            });
            return;
        }

        if (!fotoInput.files || fotoInput.files.length === 0) {
            Swal.fire({
                title: window.translationsPaciente[idiomaSelecionado].imagemAusente,
                icon: 'warning'
            });
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

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: window.translationsPaciente[idiomaSelecionado].cadastroSucesso,
                showConfirmButton: false,
                timer: 1000
            });
            console.log('Cadastro bem-sucedido:', response.data);
            form.reset();
            document.getElementById('avatarPaciente').src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
        } catch (error) {
            console.error('Erro na requisição de cadastro:', error.message, error);
            let errorTitle = window.translationsPaciente[idiomaSelecionado].cadastroErro;
            let errorText = window.translationsPaciente[idiomaSelecionado].cadastroErro;

            // Tratamento de erros específicos
            if (error.response) {
                // Erro retornado pelo servidor (ex.: 400, 401, 500)
                console.error('Resposta do servidor:', error.response.status, error.response.data);
                errorText = `Error ${error.response.status}: ${error.response.data.message || window.translationsPaciente[idiomaSelecionado].cadastroErro}`;
            } else if (error.request) {
                // Requisição enviada, mas sem resposta (ex.: servidor offline)
                console.error('Nenhuma resposta recebida:', error.request);
                errorText = window.translationsPaciente[idiomaSelecionado].cadastroErro;
            } else {
                // Erro na configuração da requisição
                console.error('Erro de configuração:', error.message);
                errorText = 'Erro interno na requisição. Tente novamente.';
            }

            Swal.fire({
                title: errorTitle,
                text: errorText,
                icon: 'error'
            });
        }
    });
});