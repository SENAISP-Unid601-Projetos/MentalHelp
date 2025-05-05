let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function gerarCalendario(mes, ano) {
  const diasContainer = document.getElementById('dias');
  const tituloMes = document.getElementById('mes');
  diasContainer.innerHTML = '';

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  tituloMes.textContent = `${nomesMeses[mes]} ${ano}`;

  // Preencher espaço antes do primeiro dia
  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement('div');
    diasContainer.appendChild(vazio);
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const botao = document.createElement('button');
    botao.textContent = dia;
    botao.addEventListener('click', () => {
      document.querySelectorAll('.dias button').forEach(btn => btn.classList.remove('ativo'));
      botao.classList.add('ativo');
    });
    diasContainer.appendChild(botao);
  }
}

// Botões de navegação
document.getElementById('anterior').addEventListener('click', () => {
  mesAtual--;
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }
  gerarCalendario(mesAtual, anoAtual);
});

document.getElementById('proximo').addEventListener('click', () => {
  mesAtual++;
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }
  gerarCalendario(mesAtual, anoAtual);
});

// Inicia com o mês atual
gerarCalendario(mesAtual, anoAtual);
