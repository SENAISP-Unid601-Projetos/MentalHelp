let a = null; // Armazena data formatada completa
let b = null; // Armazena dia da semana
let c = null; // Armazena horário

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
        meusAgendamentos: "Meus Agendamentos",
        mensagemErro: "Por favor, selecione um dia e um horário para agendar",
        agendamentoConfirmado: "Agendamento Confirmado!",
        consultaAgendadaSucesso: "Consulta agendada com sucesso!",
        detalhesAgendamento: "Sua consulta com <strong>{0}</strong> está marcada para: <strong>{1}</strong>, 27 de maio de 2025 às <strong>{2}</strong>",
        fecharModal: "Fechar",
        // Traduções para os meses
        janeiro: "Janeiro",
        fevereiro: "Fevereiro",
        marco: "Março",
        abril: "Abril",
        maio: "Maio",
        junho: "Junho",
        julho: "Julho",
        agosto: "Agosto",
        setembro: "Setembro",
        outubro: "Outubro",
        novembro: "Novembro",
        dezembro: "Dezembro",
        // Traduções para a página Meus Agendamentos
        tituloMeusAgendamentos: "Meus Agendamentos",
        semAgendamentos: "Nenhum agendamento encontrado.",
        horarioAgendamento: "Horário:",
        profissionalAgendamento: "Profissional:",
        cancelarAgendamento: "Excluir"
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
        meusAgendamentos: "My Appointments",
        mensagemErro: "Please select a day and time to schedule",
        agendamentoConfirmado: "Appointment Confirmed!",
        consultaAgendadaSucesso: "Appointment scheduled successfully!",
        detalhesAgendamento: "Your appointment with <strong>{0}</strong> is scheduled for: <strong>{1}</strong>, May 27, 2025 at <strong>{2}</strong>",
        fecharModal: "Close",
        // Traduções para os meses
        janeiro: "January",
        fevereiro: "February",
        marco: "March",
        abril: "April",
        maio: "May",
        junho: "June",
        julho: "July",
        agosto: "August",
        setembro: "September",
        outubro: "October",
        novembro: "November",
        dezembro: "December",
        // Traduções para a página Meus Agendamentos
        tituloMeusAgendamentos: "My Appointments",
        semAgendamentos: "No appointments found.",
        horarioAgendamento: "Time:",
        profissionalAgendamento: "Professional:",
        cancelarAgendamento: "Delete"
    },
    es: {
        tituloPagina: "Programación",
        tipoAtendimento: "Servicio seleccionado: Especial",
        agendeReuniao: "Agendar una reunión con Mykael",
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
        meusAgendamentos: "Mis Citas",
        mensagemErro: "Por favor, seleccione un día y una hora para programar",
        agendamentoConfirmado: "¡Cita Confirmada!",
        consultaAgendadaSucesso: "¡Cita programada con éxito!",
        detalhesAgendamento: "Su cita con <strong>{0}</strong> está programada para: <strong>{1}</strong>, 27 de mayo de 2025 a las <strong>{2}</strong>",
        fecharModal: "Cerrar",
        // Traduções para os meses
        janeiro: "Enero",
        fevereiro: "Febrero",
        marco: "Marzo",
        abril: "Abril",
        maio: "Mayo",
        junho: "Junio",
        julho: "Julio",
        agosto: "Agosto",
        setembro: "Septiembre",
        outubro: "Octubre",
        novembro: "Noviembre",
        dezembro: "Diciembre",
        // Traduções para a página Meus Agendamentos
        tituloMeusAgendamentos: "Mis Citas",
        semAgendamentos: "No se encontraron citas.",
        horarioAgendamento: "Hora:",
        profissionalAgendamento: "Profesional:",
        cancelarAgendamento: "Eliminar"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const languageSelectEspecial = document.getElementById("languageSelectEspecial");
    const savedLangEspecial = localStorage.getItem("langEspecial") || 'pt';

    languageSelectEspecial.value = savedLangEspecial;
    updateContentEspecial(savedLangEspecial);

    languageSelectEspecial.addEventListener("change", function() {
        const lang = this.value;
        localStorage.setItem("langEspecial", lang);
        updateContentEspecial(lang);
    });

    function updateContentEspecial(lang) {
        const t = translationsEspecial[lang];

        // Atualizar título da página e elementos principais
        document.title = t.tituloPagina;
        document.querySelector(".tipo-atendimento").textContent = t.tipoAtendimento;
        document.querySelector(".reunião").textContent = t.agendeReuniao;
        document.querySelector(".especialidade").textContent = t.especialidade;
        document.getElementById("anterior").textContent = '‹'; // Mantém o ícone
        document.getElementById("proximo").textContent = '›'; // Mantém o ícone

        // Atualizar dias da semana
        const diasSemana = document.querySelectorAll(".dias-semana span");
        diasSemana[0].textContent = t.domingo;
        diasSemana[1].textContent = t.segunda;
        diasSemana[2].textContent = t.terca;
        diasSemana[3].textContent = t.quarta;
        diasSemana[4].textContent = t.quinta;
        diasSemana[5].textContent = t.sexta;
        diasSemana[6].textContent = t.sabado;

        // Atualizar elementos do painel direito
        document.querySelector(".text-purple").textContent = t.qualHorarioMelhor;
        document.querySelector(".subtexto").textContent = t.fusoHorario;

        // Atualizar resumo do agendamento
        const resumoAgendamento = document.getElementById("resumo-agendamento");
        if (resumoAgendamento) {
            const h4Resumo = resumoAgendamento.querySelector("h4");
            if (h4Resumo) h4Resumo.textContent = t.resumoAgendamento;
        }

        // Atualizar botões
        const btnAgendar = document.getElementById("btnAgendar");
        if (btnAgendar) {
            const spanText = btnAgendar.querySelector(".btn-text");
            if (spanText) spanText.textContent = t.confirmarAgendamento;
        }

        const btnVerAgendamentos = document.getElementById("btnVerAgendamentos");
        if (btnVerAgendamentos) {
            const spanText = btnVerAgendamentos.querySelector(".btn-text");
            if (spanText) spanText.textContent = t.meusAgendamentos;
        }

        // Atualizar mensagem de erro
        const mensagemErro = document.getElementById("mensagemErro");
        if (mensagemErro) mensagemErro.textContent = t.mensagemErro;

        // Atualizar modal de confirmação
        const modalTitle = document.querySelector("#modalConfirmacao .modal-title");
        if (modalTitle) modalTitle.textContent = t.agendamentoConfirmado;
        const modalBodyH4 = document.querySelector("#modalConfirmacao .modal-body h4");
        if (modalBodyH4) modalBodyH4.textContent = t.consultaAgendadaSucesso;
        const modalFooterButton = document.querySelector("#modalConfirmacao .modal-footer .btn-primary");
        if (modalFooterButton) modalFooterButton.textContent = t.fecharModal;

        // Atualizar detalhes do agendamento (se variáveis disponíveis)
        const modalBodyP = document.querySelector("#modalConfirmacao .modal-body p");
        if (modalBodyP && b && c) {
            modalBodyP.innerHTML = t.detalhesAgendamento
                .replace("{0}", "Mykael")
                .replace("{1}", b)
                .replace("{2}", c);
        }
    }
});