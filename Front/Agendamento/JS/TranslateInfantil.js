// === Objeto de Traduções ===
const translationsInfantil = {
  pt: {
    tituloPagina: "Agendamento",
    tipoAtendimento: "Atendimento selecionado: Infantil",
    profissionalEncontrada: "Profissional encontrada: Gabrielly",
    especialidade: "Especialista em: Atendimento Infantil",
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
    detalhesAgendamento: "Sua consulta com {0} está marcada para: {1} às {2}",
    fecharModal: "Fechar"
  },
  en: {
    tituloPagina: "Scheduling",
    tipoAtendimento: "Selected Service: Child Care",
    profissionalEncontrada: "Professional found: Gabrielly",
    especialidade: "Specialist in: Child Care",
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
    detalhesAgendamento: "Your appointment with {0} is scheduled for: {1} at {2}",
    fecharModal: "Close"
  },
  es: {
    tituloPagina: "Programación",
    tipoAtendimento: "Servicio seleccionado: Infantil",
    profissionalEncontrada: "Profesional encontrada: Gabrielly",
    especialidade: "Especialista en: Atención Infantil",
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
    detalhesAgendamento: "Su cita con {0} está programada para: {1} a las {2}",
    fecharModal: "Cerrar"
  }
};

// === Função principal de tradução ===
document.addEventListener("DOMContentLoaded", function () {
  const languageSelectInfantil = document.getElementById("languageSelectInfantil");
  const savedLang = localStorage.getItem("langInfantil") || "pt";
  languageSelectInfantil.value = savedLang;

  updateContentInfantil(savedLang);

  languageSelectInfantil.addEventListener("change", function () {
    const lang = this.value;
    localStorage.setItem("langInfantil", lang);
    updateContentInfantil(lang);
  });
});

// === Função de atualização ===
function updateContentInfantil(lang) {
  const t = translationsInfantil[lang];
  if (!t) {
    console.error(`Traduções não encontradas para o idioma: ${lang}`);
    return;
  }

  function safeSet(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  function safeSetById(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // Atualiza a página
  document.title = t.tituloPagina;
  safeSet(".tipo-atendimento", t.tipoAtendimento);
  safeSet(".reunião", t.profissionalEncontrada);
  safeSet(".especialidade", t.especialidade);
  safeSetById("anterior", "‹");
  safeSetById("proximo", "›");
  safeSetById("voltar", t.voltar);

  const diasSemana = document.querySelectorAll(".dias-semana span");
  if (diasSemana.length === 7) {
    diasSemana[0].textContent = t.domingo;
    diasSemana[1].textContent = t.segunda;
    diasSemana[2].textContent = t.terca;
    diasSemana[3].textContent = t.quarta;
    diasSemana[4].textContent = t.quinta;
    diasSemana[5].textContent = t.sexta;
    diasSemana[6].textContent = t.sabado;
  }

  safeSet(".text-purple", t.qualHorarioMelhor);
  safeSet(".subtexto", t.fusoHorario);

  const resumo = document.querySelector("#resumo-agendamento h4");
  if (resumo) resumo.textContent = t.resumoAgendamento;

  const btnAgendar = document.querySelector("#btnAgendar .btn-text");
  if (btnAgendar) btnAgendar.textContent = t.confirmarAgendamento;

  const btnVer = document.querySelector("#btnVerAgendamentos .btn-text");
  if (btnVer) btnVer.textContent = t.meusAgendamentos;

  safeSetById("mensagemErro", t.mensagemErro);
  safeSet("#modalConfirmacao .modal-title", t.agendamentoConfirmado);
  safeSet("#modalConfirmacao .modal-body h4", t.consultaAgendadaSucesso);
  safeSet("#modalConfirmacao .modal-footer .btn-primary", t.fecharModal);

  // Se você tiver as variáveis "a" e "c" definidas:
  if (typeof a !== "undefined" && typeof c !== "undefined") {
    const modalBodyP = document.querySelector("#modalConfirmacao .modal-body p");
    if (modalBodyP) {
      modalBodyP.innerHTML = t.detalhesAgendamento
        .replace("{0}", "Gabrielly")
        .replace("{1}", a || "___")
        .replace("{2}", c || "___");
    }
  }
}
