window.onload = function () {
  const logo = document.querySelector('#logoSection');
  const contactLinks = document.querySelectorAll('.js-scroll-contact');
  const professionalLinks = document.querySelectorAll('.js-scroll-professionals');
  const apoioLinks = document.querySelectorAll('.js-scroll-apoio');
  const agendeLinks = document.querySelectorAll('.js-scroll-agende');

  // Logo scroll to top
  if (logo instanceof HTMLDivElement) {
    logo.addEventListener('click', () => {
      smoothScrollWithEasing(0, 1000);
    });
  }

  // Contato
  contactLinks.forEach(link => {
    link.addEventListener('click', function () {
      const contatoSection = document.querySelector('#contatoFooter');
      if (contatoSection) {
        const top = contatoSection.offsetTop;
        smoothScrollWithEasing(top, 1000);
      }
    });
  });

  // Profissionais
  professionalLinks.forEach(link => {
    link.addEventListener('click', function () {
      const section = document.querySelector('#vemAqui');
      if (section) {
        const top = section.offsetTop;
        smoothScrollWithEasing(top, 1000);
      }
    });
  });

  // Apoio
  apoioLinks.forEach(link => {
    link.addEventListener('click', function () {
      const apoioSection = document.querySelector('#apoio');
      if (apoioSection) {
        const top = apoioSection.offsetTop;
        smoothScrollWithEasing(top, 1000);
      }
    });
  });

  // Agende
  agendeLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const section = document.querySelector('#vemAqui');
      if (section) {
        const top = section.offsetTop;
        smoothScrollWithEasing(top, 1000);
      }
    });
  });

  // Scroll function
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
};
