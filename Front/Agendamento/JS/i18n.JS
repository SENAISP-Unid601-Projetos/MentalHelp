// 📁 i18n.js
const translations = {
    pt: {
      agendamentoRealizado: "Agendamento realizado com sucesso!",
      selecioneData: "Por favor, selecione uma data.",
      selecioneHorario: "Por favor, selecione um horário.",
      confirmar: "Confirmar Agendamento",
      diasSemana: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      meses: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ]
    },
    en: {
      agendamentoRealizado: "Appointment successfully scheduled!",
      selecioneData: "Please select a date.",
      selecioneHorario: "Please select a time.",
      confirmar: "Confirm Appointment",
      diasSemana: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      meses: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
    },
    es: {
      agendamentoRealizado: "¡Cita programada con éxito!",
      selecioneData: "Por favor seleccione una fecha.",
      selecioneHorario: "Por favor seleccione una hora.",
      confirmar: "Confirmar Cita",
      diasSemana: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      meses: [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ]
    }
  };
  
  function getTranslation(lang, key) {
    return translations[lang][key];
  }
  
  // 📁 translate.js
  function translatePage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
  }
  
  // 📁 Infantil.js
  let currentLang = localStorage.getItem("language") || "pt";
  
  function renderizarCalendario() {
    // Exemplo de uso de tradução
    const diasSemana = getTranslation(currentLang, "diasSemana");
    const meses = getTranslation(currentLang, "meses");
  
    const hoje = new Date();
    const nomeMes = meses[hoje.getMonth()];
  
    // renderizar dias da semana na tabela
    const cabecalho = document.querySelector("thead tr");
    cabecalho.innerHTML = "";
    diasSemana.forEach((dia) => {
      const th = document.createElement("th");
      th.textContent = dia;
      cabecalho.appendChild(th);
    });
    // ... resto da renderização do calendário
  }
  
  function mostrarErro(msgKey) {
    const msg = getTranslation(currentLang, msgKey);
    const erro = document.getElementById("mensagemErro");
    erro.textContent = msg;
  }
  
  function agendar() {
    const dataSelecionada = /* data do input */ null;
    const horarioSelecionado = /* horario do input */ null;
    if (!dataSelecionada) {
      mostrarErro("selecioneData");
      return;
    }
    if (!horarioSelecionado) {
      mostrarErro("selecioneHorario");
      return;
    }
    alert(getTranslation(currentLang, "agendamentoRealizado"));
  }
  
  // Ao trocar idioma
  function trocarIdioma(novoIdioma) {
    currentLang = novoIdioma;
    localStorage.setItem("language", currentLang);  
    translatePage(currentLang);
    renderizarCalendario();
  }