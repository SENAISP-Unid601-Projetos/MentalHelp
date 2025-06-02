
document.addEventListener('DOMContentLoaded', () => {
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

})