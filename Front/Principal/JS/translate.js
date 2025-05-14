const translations = {
    pt: {
      professionals: "Profissionais",
      contact: "Contato",
      apoioLink: "Apoio",
      entrar: "Entrar",
      agendeConsulta: "Agende uma Consulta!",
      tituloPrincipal: "Você<br />Não Está<br />Sozinho",
      paragrafoPrincipal1: "Cuidar da mente é um ato de coragem.",
      paragrafoPrincipal2:
        "Aqui, você encontra acolhimento, escuta e apoio profissional para enfrentar os desafios emocionais do dia a dia. Dê o primeiro passo para transformar sua vida — Estamos com você.",
      profissionais: [
        {
          nome: "Dr. Mykael Balbino – Psicólogo Especialista em Neurodivergência",
          descricao:
            "Especialista no desenvolvimento emocional e comportamental de crianças, o Dr. Rafael trabalha com empatia e escuta ativa para ajudar pequenos pacientes a enfrentarem desafios como ansiedade, dificuldades escolares e problemas de socialização.",
          botao: "Agende aqui !",
        },
        {
          nome: "Dra. Gabrielly Milhor – Psicóloga Infantil",
          descricao:
            "Com ampla experiência no atendimento de crianças e adolescentes, Dra. Camila utiliza abordagens lúdicas e terapias baseadas em evidências para promover o bem-estar psicológico desde os primeiros anos de vida.",
          botao: "Agende aqui !",
        },
        {
          nome: "Dr. Vagner Nunes – Psicólogo Geral",
          descricao:
            "Focado em crianças com transtornos do neurodesenvolvimento, como TDAH e TEA, o Dr. Eduardo oferece um olhar técnico e acolhedor, atuando em parceria com escolas e famílias para um cuidado integral.",
          botao: "Agende aqui !",
        },
      ],
      apoioTitulo: "TRANSTORNOS MAIS COMUNS",
      tagTitulo: "Transtorno de Ansiedade Generalizada (TAG)",
      tagDescricao:
        "O TAG é um transtorno caracterizado por uma preocupação excessiva e persistente, mesmo quando não há motivo claro para tanta apreensão...",
      depressaoTitulo: "Depressão Maior (Transtorno Depressivo Maior)",
      depressaoDescricao:
        "A Depressão Maior é um transtorno mental sério que vai muito além da tristeza passageira...",
      contatoTitulo: "Contato Emergencial",
      direitos: "Direitos Reservados a MentalHelp 2025. All Rights Reserved.",
    },
    en: {
      professionals: "Professionals",
      contact: "Contact",
      apoioLink: "Support",
      entrar: "Login",
      agendeConsulta: "Book an Appointment!",
      tituloPrincipal: "You<br />Are Not<br />Alone",
      paragrafoPrincipal1: "Taking care of your mind is an act of courage.",
      paragrafoPrincipal2:
        "Here you will find support, listening and professional help to face emotional challenges. Take the first step — we're with you.",
      profissionais: [
        {
          nome: "Dr. Mykael Balbino – Psychologist Specialized in Neurodivergence",
          descricao:
            "Specialist in emotional and behavioral development of children. Dr. Rafael works with empathy and active listening to help young patients with anxiety, school difficulties, and social challenges.",
          botao: "Book now!",
        },
        {
          nome: "Dr. Gabrielly Milhor – Child Psychologist",
          descricao:
            "With vast experience in child and adolescent therapy, Dr. Camila uses playful approaches and evidence-based therapies to promote well-being from early childhood.",
          botao: "Book now!",
        },
        {
          nome: "Dr. Vagner Nunes – General Psychologist",
          descricao:
            "Focused on children with neurodevelopmental disorders like ADHD and ASD, Dr. Eduardo offers a technical and welcoming perspective, working closely with schools and families.",
          botao: "Book now!",
        },
      ],
      apoioTitulo: "MOST COMMON DISORDERS",
      tagTitulo: "Generalized Anxiety Disorder (GAD)",
      tagDescricao:
        "GAD is characterized by excessive and persistent worry, even when there's no clear reason...",
      depressaoTitulo: "Major Depression (Major Depressive Disorder)",
      depressaoDescricao:
        "Major Depression is a serious mental disorder that goes beyond temporary sadness...",
      contatoTitulo: "Emergency Contact",
      direitos: "All rights reserved to MentalHelp 2025.",
    },
    es: {
      professionals: "Profesionales",
      contact: "Contacto",
      apoioLink: "Apoyo",
      entrar: "Iniciar Sesión",
      agendeConsulta: "¡Agenda una Consulta!",
      tituloPrincipal: "Tú<br />No Estás<br />Solo",
      paragrafoPrincipal1: "Cuidar de la mente es un acto de valentía.",
      paragrafoPrincipal2:
        "Aquí encontrarás acogida, escucha y apoyo profesional para enfrentar los desafíos emocionales. Da el primer paso — Estamos contigo.",
      profissionais: [
        {
          nome: "Dr. Mykael Balbino – Psicólogo Especializado en Neurodivergencia",
          descricao:
            "Especialista en desarrollo emocional y conductual infantil. El Dr. Rafael trabaja con empatía y escucha activa para ayudar a niños con ansiedad, dificultades escolares y sociales.",
          botao: "¡Agenda ahora!",
        },
        {
          nome: "Dra. Gabrielly Milhor – Psicóloga Infantil",
          descricao:
            "Con amplia experiencia en el tratamiento de niños y adolescentes, la Dra. Camila utiliza enfoques lúdicos y terapias basadas en evidencia para promover el bienestar desde los primeros años.",
          botao: "¡Agenda ahora!",
        },
        {
          nome: "Dr. Vagner Nunes – Psicólogo General",
          descricao:
            "Enfocado en niños con trastornos del neurodesarrollo como TDAH y TEA, el Dr. Eduardo trabaja en conjunto con escuelas y familias para un cuidado integral.",
          botao: "¡Agenda ahora!",
        },
      ],
      apoioTitulo: "TRASTORNOS MÁS COMUNES",
      tagTitulo: "Trastorno de Ansiedad Generalizada (TAG)",
      tagDescricao:
        "El TAG se caracteriza por preocupación excesiva y persistente, incluso sin razón aparente...",
      depressaoTitulo: "Depresión Mayor (Trastorno Depresivo Mayor)",
      depressaoDescricao:
        "La Depresión Mayor es un trastorno mental grave que va más allá de la tristeza temporal...",
      contatoTitulo: "Contacto de Emergencia",
      direitos: "Todos los derechos reservados a MentalHelp 2025.",
    },
  };
  
  document.getElementById("languageSelect").addEventListener("change", function () {
    const lang = this.value;
    updateContent(lang);
  });
  
  function updateContent(lang) {
    const t = translations[lang];
  
    document.getElementById("professionals").textContent = t.professionals;
    document.getElementById("contact").textContent = t.contact;
    document.getElementById("apoioLink").textContent = t.apoioLink;
    document.querySelector("a[href*='LoginPage']").textContent = t.entrar;
    document.getElementById("btnAgende").textContent = t.agendeConsulta;
    document.querySelector(".titulo-principal").innerHTML = t.tituloPrincipal;
    document.querySelector(".text-color").textContent = t.paragrafoPrincipal1;
    document.querySelector(".text-colorParagrafo").textContent = t.paragrafoPrincipal2;
  
    // Profissionais
    const nomes = document.querySelectorAll("#vemAqui h5");
    const descricoes = document.querySelectorAll("#vemAqui p");
    const botoes = document.querySelectorAll("#vemAqui a");
  
    t.profissionais.forEach((p, i) => {
      nomes[i].textContent = p.nome;
      descricoes[i].textContent = p.descricao;
      botoes[i].textContent = p.botao;
    });
  
    document.querySelector("#apoio h2").textContent = t.apoioTitulo;
    document.querySelectorAll("#apoio h5")[0].textContent = t.tagTitulo;
    document.querySelectorAll("#apoio p")[0].textContent = t.tagDescricao;
    document.querySelectorAll("#apoio h5")[1].textContent = t.depressaoTitulo;
    document.querySelectorAll("#apoio p")[1].textContent = t.depressaoDescricao;
  
    document.querySelector(".footerTitle").textContent = t.contatoTitulo;
    document.querySelector("footer p").textContent = `© ${t.direitos}`;
  }
  