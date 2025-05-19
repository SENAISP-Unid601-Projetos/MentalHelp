// JS/Adulto.js

const translationsAdulto = {
    pt: {
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
        detalhesAgendamento: "Detalhes do agendamento:",
        fecharModal: "Fechar",
        modalAppointmentDetails: "Sua consulta com Mykael está marcada para: sábado, 22 de julho de 2028 às 17:30",
    },
    en: {
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
        detalhesAgendamento: "Appointment details:",
        fecharModal: "Close",
        modalAppointmentDetails: "Your appointment with Mykael is scheduled for: Saturday, July 22, 2028 at 5:30 PM",
    },
    es: {
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
        detalhesAgendamento: "Detalles de la cita:",
        fecharModal: "Cerrar",
        modalAppointmentDetails: "Su cita con Mykael está programada para: sábado, 22 de julio de 2028 a las 17:30",
    },
};

document.addEventListener('DOMContentLoaded', function() {
    const languageSelectAdulto = document.getElementById("languageSelectAdulto");
    const savedLangAdulto = localStorage.getItem("langAdulto");

    if (savedLangAdulto) {
        languageSelectAdulto.value = savedLangAdulto;
        updateContentAdulto(savedLangAdulto);
    } else {
        const defaultLangAdulto = 'pt';
        languageSelectAdulto.value = defaultLangAdulto;
        updateContentAdulto(defaultLangAdulto);
    }

    languageSelectAdulto.addEventListener("change", function () {
        const lang = this.value;
        localStorage.setItem("langAdulto", lang);
        updateContentAdulto(lang);
    });

    function updateContentAdulto(lang) {
        const t = translationsAdulto[lang];

        document.title = t.tituloPagina;
        document.getElementById("tipoAtendimento").textContent = t.tipoAtendimento;
        document.getElementById("profissionalEncontrada").textContent = t.profissionalEncontrada;
        document.getElementById("especialidade").textContent = t.especialidade;
        document.getElementById("anterior").setAttribute('aria-label', t.mesAnterior);
        document.getElementById("proximo").setAttribute('aria-label', t.proximoMes);

        const diasSemana = document.querySelectorAll(".dias-semana span");
        diasSemana[0].textContent = t.domingo;
        diasSemana[1].textContent = t.segunda;
        diasSemana[2].textContent = t.terca;
        diasSemana[3].textContent = t.quarta;
        diasSemana[4].textContent = t.quinta;
        diasSemana[5].textContent = t.sexta;
        diasSemana[6].textContent = t.sabado;

        // Translate month in calendar
        const mesElement = document.getElementById("mes");
        if (mesElement && mesElement.textContent) {
            const yearMatch = mesElement.textContent.match(/\d{4}/);
            const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
            const currentDate = new Date();
            mesElement.textContent = `${currentDate.toLocaleString(lang, { month: 'long' })} ${year}`.replace(/^\w/, c => c.toUpperCase());
        }

        document.getElementById("qualHorarioMelhor").textContent = t.qualHorarioMelhor;
        document.getElementById("fusoHorario").textContent = t.fusoHorario;

        const resumoAgendamento = document.getElementById("resumo-agendamento");
        if (resumoAgendamento) {
            const h4Resumo = resumoAgendamento.querySelector("h4");
            if (h4Resumo) h4Resumo.textContent = t.resumoAgendamento;

            const pData = document.getElementById("data-selecionada");
            if (pData && pData.textContent) {
                const dateMatch = pData.textContent.match(/\d{2}\/\d{2}\/\d{4}/);
                if (dateMatch) {
                    const [day, month, year] = dateMatch[0].split('/');
                    const date = new Date(`${year}-${month}-${day}`);
                    pData.textContent = `${t.dataSelecionada} ${date.toLocaleDateString(lang)}`;
                } else {
                    pData.textContent = t.dataSelecionada;
                }
            }

            const pHora = document.getElementById("horario-selecionado");
            if (pHora && pHora.textContent) {
                const timeMatch = pHora.textContent.match(/\d{2}:\d{2}/);
                if (timeMatch) {
                    pHora.textContent = `${t.horarioSelecionado} ${timeMatch[0]}`;
                } else {
                    pHora.textContent = t.horarioSelecionado;
                }
            }
        }

        const btnAgendar = document.getElementById("btnAgendar");
        if (btnAgendar) {
            const spanText = btnAgendar.querySelector(".btn-text");
            if (spanText) spanText.textContent = t.confirmarAgendamento;
        }

        const btnVerAgendamentos = document.getElementById("btnVerAgendamentos");
        if (btnVerAgendamentos) {
            const spanText = btnVerAgendamentos.querySelector(".btn-text");
            if (spanText) spanText.textContent = t.meusAgendamentos || "Meus Agendamentos";
        }

        const mensagemErro = document.getElementById("mensagemErro");
        if (mensagemErro) mensagemErro.textContent = t.selecioneDiaHorario;

        const modalTitle = document.querySelector("#modalConfirmacao .modal-title");
        if (modalTitle) modalTitle.textContent = t.agendamentoConfirmado;
        const modalBodyH4 = document.querySelector("#modalConfirmacao .modal-body h4");
        if (modalBodyH4) modalBodyH4.textContent = t.consultaAgendadaSucesso;

        // Update modal appointment details
        const modalBodyP = document.querySelector("#modalConfirmacao .modal-body p");
        if (modalBodyP) {
            modalBodyP.textContent = t.modalAppointmentDetails;
        }

        const modalFooterButton = document.querySelector("#modalConfirmacao .modal-footer .btn-primary");
        if (modalFooterButton) modalFooterButton.textContent = t.fecharModal;
    }
});