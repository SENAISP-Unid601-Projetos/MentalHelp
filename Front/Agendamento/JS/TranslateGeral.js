// translateGeral.js

const translationsAdulto = {
    pt: {
        voltar: "Voltar",
        tituloPagina: "Agendamento",
        tipoAtendimento: "Atendimento selecionado: Adulto",
        profissionalEncontrada: "Profissional encontrada: Vagner",
        especialidade: "Especialista em: Desenvolvimento Pessoal",
        mesAnterior: "Mês anterior",
        proximoMes: "Próximo mês",
        domingo: "DOM",
        segunda: "SEG",
        terca: "TER",
        quarta: "QUA",
        quinta: "QUI",
        sexta: "SEX",
        sabado: "SAB",
        qualHorarioMelhor: "Qual o horário é melhor?",
        fusoHorario: "UTC -3 (Horário de Brasília)",
        resumoAgendamento: "Resumo do Agendamento:",
        dataSelecionada: "Data Selecionada:",
        horarioSelecionado: "Horário Selecionado:",
        confirmarAgendamento: "Confirmar Agendamento",
        selecioneDiaHorario: "Por favor, selecione um dia e um horário para agendar",
        agendamentoConfirmado: "Agendamento Confirmado!",
        consultaAgendadaSucesso: "Consulta agendada com sucesso!",
        detalhesAgendamento: "Sua consulta com {0} está marcada para: {1} às {2}",
        fecharModal: "Fechar",
        janeiro: "Janeiro", fevereiro: "Fevereiro", marco: "Março", abril: "Abril", maio: "Maio", junho: "Junho",
        julho: "Julho", agosto: "Agosto", setembro: "Setembro", outubro: "Outubro", novembro: "Novembro", dezembro: "Dezembro",
        tituloMeusAgendamentos: "Meus Agendamentos",
        semAgendamentos: "Nenhum agendamento encontrado.",
        dataAgendamento: "Data:",
        horarioAgendamento: "Horário:",
        profissionalAgendamento: "Profissional:",
        cancelarAgendamento: "Excluir",
        erroAgendamento: "Ocorreu um erro ao agendar. Tente novamente mais tarde.",
        erroServidor: "Erro do servidor.",
        semResposta: "Sem resposta do servidor.",
        erroConfig: "Erro na configuração."
    },
    en: {
        voltar: "Back",
        tituloPagina: "Scheduling",
        tipoAtendimento: "Selected Service: Adult",
        profissionalEncontrada: "Professional found: Vagner",
        especialidade: "Specialist in: Personal Development",
        mesAnterior: "Previous month",
        proximoMes: "Next month",
        domingo: "SUN",
        segunda: "MON",
        terca: "TUE",
        quarta: "WED",
        quinta: "THU",
        sexta: "FRI",
        sabado: "SAT",
        qualHorarioMelhor: "What time works best?",
        fusoHorario: "UTC -3 (Brasilia Time)",
        resumoAgendamento: "Appointment Summary:",
        dataSelecionada: "Selected Date:",
        horarioSelecionado: "Selected Time:",
        confirmarAgendamento: "Confirm Appointment",
        selecioneDiaHorario: "Please select a day and time to schedule",
        agendamentoConfirmado: "Appointment Confirmed!",
        consultaAgendadaSucesso: "Appointment scheduled successfully!",
        detalhesAgendamento: "Your appointment with {0} is scheduled for: {1} at {2}",
        fecharModal: "Close",
        janeiro: "January", fevereiro: "February", marco: "March", abril: "April", maio: "May", junho: "June",
        julho: "July", agosto: "August", september: "September", october: "October", november: "November", december: "December",
        tituloMeusAgendamentos: "My Appointments",
        semAgendamentos: "No appointments found.",
        dataAgendamento: "Date:",
        horarioAgendamento: "Time:",
        profissionalAgendamento: "Professional:",
        cancelarAgendamento: "Delete",
        erroAgendamento: "An error occurred during scheduling. Please try again later.",
        erroServidor: "Server error.",
        semResposta: "No server response.",
        erroConfig: "Configuration error."
    },
    es: {
        voltar: "Volver",
        tituloPagina: "Programación",
        tipoAtendimento: "Servicio seleccionado: Adulto",
        profissionalEncontrada: "Profesional encontrado: Vagner",
        especialidade: "Especialista en: Desarrollo Personal",
        mesAnterior: "Mes anterior",
        proximoMes: "Próximo mes",
        domingo: "DOM",
        segunda: "LUN",
        terca: "MAR",
        quarta: "MIÉ",
        quinta: "JUE",
        sexta: "VIE",
        sabado: "SÁB",
        qualHorarioMelhor: "¿Qué horario es mejor?",
        fusoHorario: "UTC -3 (Hora de Brasilia)",
        resumoAgendamento: "Resumen de la Cita:",
        dataSelecionada: "Fecha Seleccionada:",
        horarioSelecionado: "Hora Seleccionada:",
        confirmarAgendamento: "Confirmar Cita",
        selecioneDiaHorario: "Por favor, seleccione un día y una hora para programar",
        agendamentoConfirmado: "¡Cita Confirmada!",
        consultaAgendadaSucesso: "¡Cita programada con éxito!",
        detalhesAgendamento: "Su cita con {0} está programada para: {1} a las {2}",
        fecharModal: "Cerrar",
        janeiro: "Enero", fevereiro: "Febrero", marco: "Marzo", abril: "Abril", mayo: "Mayo", junho: "Junio",
        julho: "Julio", agosto: "Agosto", septiembre: "Septiembre", octubre: "Octubre", noviembre: "Noviembre", diciembre: "Diciembre",
        tituloMeusAgendamentos: "Mis Citas",
        semAgendamentos: "No se encontraron citas.",
        dataAgendamento: "Fecha:",
        horarioAgendamento: "Hora:",
        profissionalAgendamento: "Profesional:",
        cancelarAgendamento: "Eliminar",
        erroAgendamento: "Ocurrió un error al programar. Por favor, inténtelo de nuevo más tarde.",
        erroServidor: "Error del servidor.",
        semResposta: "Sin respuesta del servidor.",
        erroConfig: "Error de configuración."
    }
};

function getTranslations(lang) {
    return translationsAdulto[lang] || translationsAdulto['pt'];
}

function updatePageContent(lang, {
    dataSelecionadaFormatada,
    horarioSelecionadoString,
    agendamentosArray
}) {
    const t = getTranslations(lang);

    document.title = t.tituloPagina;
    document.getElementById("tipoAtendimento").textContent = t.tipoAtendimento;
    document.getElementById("profissionalEncontrada").textContent = t.profissionalEncontrada;
    document.getElementById("especialidade").textContent = t.especialidade;

    const prevBtn = document.getElementById("anterior");
    if (prevBtn) prevBtn.setAttribute("aria-label", t.mesAnterior);
    const nextBtn = document.getElementById("proximo");
    if (nextBtn) nextBtn.setAttribute("aria-label", t.proximoMes);

    const voltarBtn = document.getElementById("voltar");
    if (voltarBtn) {
        const spanText = voltarBtn.querySelector(".btn-text");
        if (spanText) spanText.textContent = t.voltar;
    }

    const diasSemana = document.querySelectorAll(".dias-semana span");
    diasSemana[0].textContent = t.domingo;
    diasSemana[1].textContent = t.segunda;
    diasSemana[2].textContent = t.terca;
    diasSemana[3].textContent = t.quarta;
    diasSemana[4].textContent = t.quinta;
    diasSemana[5].textContent = t.sexta;
    diasSemana[6].textContent = t.sabado;

    document.getElementById("qualHorarioMelhor").textContent = t.qualHorarioMelhor;
    document.getElementById("fusoHorario").textContent = t.fusoHorario;

    const resumoAgendamentoElem = document.getElementById('resumo-agendamento');
    if (resumoAgendamentoElem) {
        const h4Resumo = resumoAgendamentoElem.querySelector("h4");
        if (h4Resumo) h4Resumo.textContent = t.resumoAgendamento;
    }

    const btnAgendarElem = document.getElementById('btnAgendar');
    if (btnAgendarElem) {
        const spanText = btnAgendarElem.querySelector(".btn-text");
        if (spanText) spanText.textContent = t.confirmarAgendamento;
    }

    const btnVerAgendamentos = document.getElementById('btnVerAgendamentos');
    if (btnVerAgendamentos) {
        const spanText = btnVerAgendamentos.querySelector(".btn-text");
        if (spanText) spanText.textContent = t.tituloMeusAgendamentos;
    }

    const mensagemErroElem = document.getElementById('mensagemErro');
    if (mensagemErroElem) mensagemErroElem.textContent = t.selecioneDiaHorario;

    const modalTitle = document.querySelector("#modalConfirmacao .modal-title");
    if (modalTitle) modalTitle.textContent = t.agendamentoConfirmado;
    const modalBodyH4 = document.querySelector("#modalConfirmacao .modal-body h4");
    if (modalBodyH4) modalBodyH4.textContent = t.consultaAgendadaSucesso;
    const modalFooterButton = document.querySelector("#modalConfirmacao .modal-footer .btn-primary");
    if (modalFooterButton) modalFooterButton.textContent = t.fecharModal;

    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');

    if (dataSelecionadaFormatada) {
        dataSelecionadaElement.textContent = `📅 ${t.dataSelecionada} ${dataSelecionadaFormatada.date}`;
        if (resumoAgendamentoElem) resumoAgendamentoElem.classList.remove('d-none');
    } else {
        if (resumoAgendamentoElem) resumoAgendamentoElem.classList.add('d-none');
        dataSelecionadaElement.textContent = '';
    }

    if (horarioSelecionadoString) {
        horarioSelecionadoElement.textContent = `⏰ ${t.horarioSelecionado} ${horarioSelecionadoString}`;
        if (resumoAgendamentoElem) resumoAgendamentoElem.classList.remove('d-none');
    } else {
        horarioSelecionadoElement.textContent = '';
    }
    
    if (detalhesAgendamento && dataSelecionadaFormatada && horarioSelecionadoString) {
        detalhesAgendamento.innerHTML = t.detalhesAgendamento
            .replace("{0}", "Vagner")
            .replace("{1}", dataSelecionadaFormatada.fullDate)
            .replace("{2}", horarioSelecionadoString);
    }
}

function setupMyAppointmentsModal(agendamentosArray) {
    const btnVerAgendamentos = document.getElementById('btnVerAgendamentos');
    if (!btnVerAgendamentos) return;

    btnVerAgendamentos.addEventListener('click', function() {
        const t = getTranslations(localStorage.getItem('langAdulto') || 'pt');

        const modalHTML = `
            <div class="modal fade" id="modalAgendamentos" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${t.tituloMeusAgendamentos}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="agendamentos-lista"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${t.fecharModal}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);

        const modal = new bootstrap.Modal(modalDiv.querySelector('.modal'));
        updateMyAppointmentsModalContent(modalDiv, modal, agendamentosArray);
        modal.show();

        modalDiv.querySelector('.modal').addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modalDiv);
        });
    });
}

function updateMyAppointmentsModalContent(modalDiv, modalInstance, agendamentosArray) {
    const t = getTranslations(localStorage.getItem('langAdulto') || 'pt');
    const agendamentosLista = modalDiv.querySelector('.agendamentos-lista');

    agendamentosLista.innerHTML = agendamentosArray.length === 0
        ? `<p>${t.semAgendamentos}</p>`
        : agendamentosArray.map((ag, index) => {
            const agDate = new Date(ag.data);
            const dataFormatada = agDate.toLocaleDateString(
                localStorage.getItem('langAdulto') === 'pt' ? 'pt-BR' : localStorage.getItem('langAdulto') === 'en' ? 'en-US' : 'es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            return `
                <div class="agendamento-item mb-3 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${dataFormatada}</strong><br>
                            ⏰ ${t.horarioAgendamento} ${ag.horario} - ${t.profissionalAgendamento} ${ag.profissional}
                        </div>
                        <button class="btn btn-danger btn-sm btn-excluir" data-index="${index}">
                            <i class="bi bi-trash"></i> ${t.cancelarAgendamento}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    modalDiv.querySelectorAll('.btn-excluir').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            let currentAgendamentos = JSON.parse(localStorage.getItem('agendamentosAdulto')) || [];
            currentAgendamentos.splice(index, 1);
            localStorage.setItem('agendamentosAdulto', JSON.stringify(currentAgendamentos));
            
            updateMyAppointmentsModalContent(modalDiv, modalInstance, currentAgendamentos);
            
            const event = new CustomEvent('agendamentosAtualizados');
            document.dispatchEvent(event);
        });
    });
}

export { getTranslations, updatePageContent, setupMyAppointmentsModal };