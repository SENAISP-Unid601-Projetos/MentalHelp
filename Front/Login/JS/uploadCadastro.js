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
