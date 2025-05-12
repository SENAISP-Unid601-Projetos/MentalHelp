document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = form.querySelector('input[placeholder="Nome"]');
        const email = form.querySelector('input[type="email"]');
        const senha = form.querySelector('input[type="password"]');
        const campoExtra = form.querySelector('input[placeholder="CPF"]') || form.querySelector('input[placeholder="CRM"]'); // paciente ou médico
        const avatar = document.querySelector('#avatarPaciente, #avatarMedico');


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


        // Se tudo passou:
        alert("Formulário enviado com sucesso!");
        form.submit(); // ou ajax, fetch, etc
    });

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
});
