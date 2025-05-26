function configurarParaPost() {
    const data = window.dataSelecionada;
    const horario = window.horarioSelecionado;

    if (!data || !horario) {
        console.error('Data ou horário não selecionado.');
        return;
    }

    // TROCAR ESTES VALORES PELO REAL USO
    const idPaciente = 1;
    const idProfissional = 6;
    const valorConsulta = 200;

    const [horas, minutos] = horario.split(':').map(Number);
    const dataComHorario = new Date(data);
    dataComHorario.setHours(horas, minutos, 0, 0);

    const dataISO = dataComHorario.toISOString();

    const dadosAgendamento = {
        data: dataISO,
        valorConsulta: valorConsulta,
        tipoConsulta: "ADULTO",
        idPaciente: idPaciente,
        idProfissional: idProfissional
    };

    axios.post('http://10.110.12.40:9500/consultas/post', dadosAgendamento)
        .then(() => {
            return axios.get(`http://10.110.12.40:9500/profissional/get/${idProfissional}`);
        })
        .then(response => {
            const profissional = response.data;
            const nomeProfissional = profissional.nome || 'Profissional';

            const detalhesAgendamento = document.getElementById('detalhes-agendamento');
            const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));

            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const dataFormatada = new Date(dataComHorario).toLocaleDateString('pt-BR', options);

            detalhesAgendamento.innerHTML = `
                Sua consulta com <strong>${nomeProfissional}</strong> está marcada para:<br>
                <strong>${dataFormatada}</strong> às <strong>${horario}</strong>
            `;

            modalConfirmacao.show();
        })
        .catch(error => {
            console.error('Erro no agendamento ou ao buscar profissional:', error);
            alert('Erro ao realizar agendamento. Tente novamente.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnAgendar');
    if (btn) {
        btn.addEventListener('click', configurarParaPost);
    }
});
