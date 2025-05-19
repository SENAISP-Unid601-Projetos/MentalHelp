window.onload = () => {
    alert('feito')
    const menuBtn = document.querySelector('#menuBtn');
    console.log(menuBtn)
    menuBtn.addEventListener('click', () => {animationMenu(menuBtn)});
}

function animationMenu(x) {
    x.classList.toggle('change');
}