window.onload = function () {
  const logo = document.querySelector('#logoSection');
  const contact = document.querySelector('#contact');
  if (logo instanceof HTMLDivElement) {
    logo.addEventListener('click', () => {
      smoothScrollWithEasing(0, 1000);
    });
  }

  if(contact instanceof HTMLAnchorElement) {
    contact.addEventListener('click', function() {
      smoothScrollWithEasing(scrollContact, 1000);
    })
  }
};


function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  const scrollContact = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
  
  function smoothScrollWithEasing(targetY, duration) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;
  
    function scrollStep(currentTime) {
      if (startTime === null) startTime = currentTime;
      const progress = currentTime - startTime;
      const scroll = Math.min(easeInOutQuad(progress, 0, 1, duration), 1);
      window.scrollTo(0, startY + distance * scroll);
  
      if (progress < duration) {
        requestAnimationFrame(scrollStep);
      }
    }
    requestAnimationFrame(scrollStep);
  }



  const translations = {
    pt: {
      header1: "Você<br />Não Está<br />Sozinho",
      paragraph1: "Cuidar da mente é um ato de coragem.",
      paragraph2: "Aqui, você encontra acolhimento, escuta e apoio profissional para enfrentar os desafios emocionais do dia a dia. Dê o primeiro passo para transformar sua vida — Estamos com você.",
      button: "Agende uma Consulta!",
      footerText: "Direitos Reservados a MentalHelp 2025. Todos os direitos reservados.",
      drMikael: "Dr. Mykael Balbino – Psicólogo Especialista em Neurodivergência"
    },
    en: {
      header1: "You<br />Are Not<br />Alone",
      paragraph1: "Taking care of your mind is an act of courage.",
      paragraph2: "Here, you will find welcome, listening, and professional support to face emotional challenges. Take the first step to transform your life — We are with you.",
      button: "Book an Appointment!",
      footerText: "All Rights Reserved to MentalHelp 2025.",
      drMikael: "Dr. Mykael Balbino – Psychologist Specialist in Neurodiversity"
    },
    es: {
      header1: "Tú<br />No Estás<br />Solo",
      paragraph1: "Cuidar de la mente es un acto de valentía.",
      paragraph2: "Aquí encontrarás acogida, escucha y apoyo profesional para afrontar los desafíos emocionales del día a día. Da el primer paso para transformar tu vida — Estamos contigo.",
      button: "¡Agenda una Cita!",
      footerText: "Todos los derechos reservados a MentalHelp 2025.",
      drMikael: "Dr. Mykael Balbino – Psicólogo Especialista en Neurodivergencia"
    }
  };
  
  function updateTexts(lang) {
    const t = translations[lang];
    document.querySelector(".titulo-principal").innerHTML = t.header1;
    document.querySelector(".text-color").textContent = t.paragraph1;
    document.querySelector(".text-colorParagrafo").textContent = t.paragraph2;
    document.querySelector(".custom-hover-btn").textContent = t.button;
    document.querySelector(".footer p").textContent = t.footerText;
    document.querySelector(".fw-bold").textContent = t.drMikael;
  }
  
  // Seletor de idioma
  const langSelect = document.getElementById("languageSelect");
  if (langSelect) {
    langSelect.addEventListener("change", () => {
      const lang = langSelect.value;
      localStorage.setItem("language", lang);
      updateTexts(lang);
    });
  
    // Carregar o idioma salvo
    const savedLang = localStorage.getItem("language") || "pt";
    langSelect.value = savedLang;
    updateTexts(savedLang);
  }
  