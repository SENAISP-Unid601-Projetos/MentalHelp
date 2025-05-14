const translations = {
    pt: {
      atendimentoSelecionado: "Atendimento selecionado: Adulto",
      agendeCom: "Agende uma reunião com Vagner",
      especialistaEm: "Especialista em: Desenvolvimento Pessoal",
      horariosDisponiveis: "Qual o horário é melhor?",
      horarioLocal: "UTC -3 (Horário de Brasília)",
      confirmarAgendamento: "Confirmar Agendamento",
      erroAgendamento: "Por favor, selecione um dia e um horário para agendar",
      resumoAgendamento: "Resumo do Agendamento:",
      agendamentoConfirmado: "Agendamento Confirmado!",
      sucessoAgendamento: "Consulta agendada com sucesso!",
      fechar: "Fechar",
      diasSemana: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"],
    },
    en: {
      atendimentoSelecionado: "Selected appointment: Adult",
      agendeCom: "Schedule a meeting with Vagner",
      especialistaEm: "Specialist in: Personal Development",
      horariosDisponiveis: "Which time is best?",
      horarioLocal: "UTC -3 (Brasília Time)",
      confirmarAgendamento: "Confirm Appointment",
      erroAgendamento: "Please select a date and time to schedule",
      resumoAgendamento: "Appointment Summary:",
      agendamentoConfirmado: "Appointment Confirmed!",
      sucessoAgendamento: "Appointment successfully scheduled!",
      fechar: "Close",
      diasSemana: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    },
    es: {
      atendimentoSelecionado: "Atención seleccionada: Adulto",
      agendeCom: "Agenda una reunión con Vagner",
      especialistaEm: "Especialista en: Desarrollo Personal",
      horariosDisponiveis: "¿Cuál es el mejor horario?",
      horarioLocal: "UTC -3 (Hora de Brasilia)",
      confirmarAgendamento: "Confirmar Cita",
      erroAgendamento: "Por favor, selecciona un día y una hora para agendar",
      resumoAgendamento: "Resumen de la Cita:",
      agendamentoConfirmado: "¡Cita Confirmada!",
      sucessoAgendamento: "¡Cita agendada con éxito!",
      fechar: "Cerrar",
      diasSemana: ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"],
    }
  };
  function updateAgendamentoContent(lang) {
    const t = translations[lang];
  
    document.querySelector(".tipo-atendimento").textContent = t.atendimentoSelecionado;
    document.querySelector(".reunião").textContent = t.agendeCom;
    document.querySelector(".especialidade").textContent = t.especialistaEm;
    document.querySelector(".text-purple").textContent = t.horariosDisponiveis;
    document.querySelector(".subtexto").textContent = t.horarioLocal;
    document.querySelector("#btnAgendar .btn-text").textContent = t.confirmarAgendamento;
    document.getElementById("mensagemErro").textContent = t.erroAgendamento;
    document.querySelector("#resumo-agendamento h4").textContent = t.resumoAgendamento;
    document.querySelector(".modal-title").textContent = t.agendamentoConfirmado;
    document.querySelector("#modalConfirmacao .modal-body h4").textContent = t.sucessoAgendamento;
    document.querySelector("#modalConfirmacao .modal-footer button").textContent = t.fechar;
  
    // Atualiza os dias da semana
    const diasSemanaElements = document.querySelectorAll(".dias-semana span");
    t.diasSemana.forEach((dia, i) => {
      if (diasSemanaElements[i]) diasSemanaElements[i].textContent = dia;
    });
  }
  const savedLang = localStorage.getItem("lang") || "pt";
  updateAgendamentoContent(savedLang);
  
  const langSelect = document.getElementById("languageSelect");
  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener("change", function () {
      const lang = this.value;
      localStorage.setItem("lang", lang);
      updateAgendamentoContent(lang);
    });
  }
      