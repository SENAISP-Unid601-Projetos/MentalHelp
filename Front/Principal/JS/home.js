window.onload = function () {
  const logo = document.querySelector('#logoSection');
  const contact = document.querySelector('#contact');
  const professionals = document.querySelector('#professionals');
  const apoioLink = document.querySelector('#apoioLink');
  const agendeBtn = document.querySelector('#btnAgende');

  if (logo instanceof HTMLDivElement) {
    logo.addEventListener('click', () => {
      smoothScrollWithEasing(0, 1000);
    });
  }

  if (contact instanceof HTMLAnchorElement) {
    contact.addEventListener('click', function () {
      const contatoSection = document.querySelector('#contatoFooter');
      if (contatoSection) {
        const top = contatoSection.offsetTop;
        smoothScrollWithEasing(top, 1000);
      }
    });
  }

  if (professionals instanceof HTMLAnchorElement) {
    professionals.addEventListener('click', function () {
      const section = document.querySelector('#vemAqui');
      if (section) {
        const top = section.offsetTop;
        smoothScrollWithEasing(top, 1000);
      }
    });
  }

  if (apoioLink instanceof HTMLAnchorElement) {
    apoioLink.addEventListener('click', function () {
      const apoioSection = document.querySelector('#apoio');
      if (apoioSection) {
        const top = apoioSection.offsetTop;
        smoothScrollWithEasing(top, 1000);
      }
    });

    if (agendeBtn instanceof HTMLAnchorElement) {
  agendeBtn.addEventListener('click', function (event) {
    event.preventDefault(); // impede o comportamento padrão do href
    const section = document.querySelector('#vemAqui');
    if (section) {
      const top = section.offsetTop;
      smoothScrollWithEasing(top, 1000);
    }
  });
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

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
  }
  
  const translations = {
    pt: {
      header1: "Você<br />Não Está<br />Sozinho",
      paragraph1: "Cuidar da mente é um ato de coragem.",
      paragraph2: "Aqui, você encontra acolhimento, escuta e apoio profissional para enfrentar os desafios emocionais do dia a dia. Dê o primeiro passo para transformar sua vida — Estamos com você.",
      button: "Agende uma Consulta!",
      footerText: "Direitos Reservados a MentalHelp 2025. Todos os direitos reservados."
    },
    en: {
      header1: "You<br />Are Not<br />Alone",
      paragraph1: "Taking care of your mind is an act of courage.",
      paragraph2: "Here, you will find welcome, listening, and professional support to face emotional challenges. Take the first step to transform your life — We are with you.",
      button: "Book an Appointment!",
      footerText: "All Rights Reserved to MentalHelp 2025."
    },
    es: {
      header1: "Tú<br />No Estás<br />Solo",
      paragraph1: "Cuidar de la mente es un acto de valentía.",
      paragraph2: "Aquí encontrarás acogida, escucha y apoyo profesional para afrontar los desafíos emocionales del día a día. Da el primer paso para transformar tu vida — Estamos contigo.",
      button: "¡Agenda una Cita!",
      footerText: "Todos los derechos reservados a MentalHelp 2025."
    }
  };
  
  function updateTexts(lang) {
    const t = translations[lang];
    document.querySelector(".titulo-principal").innerHTML = t.header1;
    document.querySelector(".text-color").textContent = t.paragraph1;
    document.querySelector(".text-colorParagrafo").textContent = t.paragraph2;
    document.querySelector(".custom-hover-btn").textContent = t.button;
    document.querySelector(".footer p").textContent = t.footerText;
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
}
