window.onload = function () {
  const logo = document.querySelector('#logoSection');
  if (logo instanceof HTMLDivElement) {
    logo.addEventListener('click', () => {
      smoothScrollWithEasing(0, 1000);
    });
  }
};


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
