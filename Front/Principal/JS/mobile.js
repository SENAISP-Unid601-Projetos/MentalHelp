window.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('#menuBtn');
  const mobileMenu = document.querySelector('#mobileMenu');
  menuBtn.addEventListener('click', () => {
    navbarMenu(mobileMenu);
  });
  document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
      mobileMenu.style.display = 'none';
    }
  });
});

function navbarMenu(mobileMenu) {
  if (mobileMenu.style.display === 'none' || mobileMenu.style.display === '') {
    mobileMenu.style.display = 'block';
  } else {
    mobileMenu.style.display = 'none';
  }
}

document.addEventListener('click', function (event) {});
