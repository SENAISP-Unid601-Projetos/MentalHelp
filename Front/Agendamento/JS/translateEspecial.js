//Tradução

const translationsEspecial = {
    pt: {
        tituloPagina: "Agendamento",
        tipoAtendimento: "Atendimento selecionado: Especial",
        agendeReuniao: "Agende reunião com Mykael",
        especialidade: "Especialista em: Atendimento Especial",
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
    },
    en: {
        tituloPagina: "Scheduling",
        tipoAtendimento: "Selected Service: Special",
        agendeReuniao: "Schedule meeting with Mykael",
        especialidade: "Specialist in: Special Care",
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
    },
    es: {
        tituloPagina: "Programación",
        tipoAtendimento: "Servicio seleccionado: Especial",
        agendeReuniao: "Agendar reunión con Mykael",
        especialidade: "Especialista en: Atención Especial",
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
    },
};

document.addEventListener('DOMContentLoaded', function() {
    const languageSelectEspecial = document.getElementById("languageSelectEspecial");
    const savedLangEspecial = localStorage.getItem("langEspecial");

    if (savedLangEspecial) {
        languageSelectEspecial.value = savedLangEspecial;
        updateContentEspecial(savedLangEspecial);
    } else {
        const defaultLangEspecial = 'pt';
        languageSelectEspecial.value = defaultLangEspecial;
        updateContentEspecial(defaultLangEspecial);
    }

    languageSelectEspecial.addEventListener("change", function () {
        const lang = this.value;
        localStorage.setItem("langEspecial", lang);
        updateContentEspecial(lang);
    });
//Tradução
    function updateContentEspecial(lang) {
        const t = translationsEspecial[lang];

        document.title = t.tituloPagina;
        document.querySelector(".tipo-atendimento").textContent = t.tipoAtendimento;
        document.querySelector(".reunião").textContent = t.agendeReuniao;
        document.querySelector(".especialidade").textContent = t.especialidade;
        document.getElementById("anterior").textContent = '‹'; // Mantém o ícone
        document.getElementById("proximo").textContent = '›'; // Mantém o ícone

        const diasSemana = document.querySelectorAll(".dias-semana span");
        diasSemana[0].textContent = t.domingo;
        diasSemana[1].textContent = t.segunda;
        diasSemana[2].textContent = t.terca;
        diasSemana[3].textContent = t.quarta;
        diasSemana[4].textContent = t.quinta;
        diasSemana[5].textContent = t.sexta;
        diasSemana[6].textContent = t.sabado;

        document.querySelector(".text-purple").textContent = t.qualHorarioMelhor;
        document.querySelector(".subtexto").textContent = t.fusoHorario;

        const resumoAgendamento = document.getElementById("resumo-agendamento");
        if (resumoAgendamento) {
            const h4Resumo = resumoAgendamento.querySelector("h4");
            if (h4Resumo) h4Resumo.textContent = t.resumoAgendamento;
            const pData = document.getElementById("data-selecionada");
            if (pData) pData.textContent = t.dataSelecionada;
            const pHora = document.getElementById("horario-selecionado");
            if (pHora) pHora.textContent = t.horarioSelecionado;
        }

        const btnAgendar = document.getElementById("btnAgendar");
        if (btnAgendar) {
            const spanText = btnAgendar.querySelector(".btn-text");
            if (spanText) spanText.textContent = t.confirmarAgendamento;
        }

        const mensagemErro = document.getElementById("mensagemErro");
        if (mensagemErro) mensagemErro.textContent = t.selecioneDiaHorario;

        const modalTitle = document.querySelector("#modalConfirmacao .modal-title");
        if (modalTitle) modalTitle.textContent = t.agendamentoConfirmado;
        const modalBodyH4 = document.querySelector("#modalConfirmacao .modal-body h4");
        if (modalBodyH4) modalBodyH4.textContent = t.consultaAgendadaSucesso;
        const modalBodyP = document.querySelector("#modalConfirmacao .modal-body p");
        if (modalBodyP) modalBodyP.textContent = t.detalhesAgendamento;
        const modalFooterButton = document.querySelector("#modalConfirmacao .modal-footer .btn-primary");
        if (modalFooterButton) modalFooterButton.textContent = t.fecharModal;
    }
});