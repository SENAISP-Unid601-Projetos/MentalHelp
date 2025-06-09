document.addEventListener('DOMContentLoaded', function() {

  let mesAtual = new Date().getMonth();
  let anoAtual = new Date().getFullYear();
  let dataSelecionada = null;
  let horarioSelecionado = null;

  const btnAgendar = document.getElementById('btnAgendar');
  const mensagemErro = document.getElementById('mensagemErro');
  const resumoAgendamento = document.getElementById('resumo-agendamento');
  const dataSelecionadaElement = document.getElementById('data-selecionada');
  const horarioSelecionadoElement = document.getElementById(
    'horario-selecionado'
  );
  const modalConfirmacao = new bootstrap.Modal(
    document.getElementById('modalConfirmacao')
  );
  const detalhesAgendamento = document.getElementById('detalhes-agendamento');

  const nomesMeses = [

      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  // Inicialização
  gerarCalendario(mesAtual, anoAtual);
  configurarHorarios();
  configurarBotoesNavegacao();

  function gerarCalendario(mes, ano) {

      const diasContainer = document.getElementById('dias');
      const tituloMes = document.getElementById('mes');
      diasContainer.innerHTML = '';

      const primeiroDia = new Date(ano, mes, 1).getDay();
      const totalDias = new Date(ano, mes + 1, 0).getDate();
      const hoje = new Date();

      tituloMes.textContent = `${nomesMeses[mes]} ${ano}`;

      // Dias vazios para começar no dia correto da semana
      for (let i = 0; i < primeiroDia; i++) {
          diasContainer.appendChild(document.createElement('div'));
      }

      // Cria os botões para cada dia do mês
      for (let dia = 1; dia <= totalDias; dia++) {
          const botao = document.createElement('button');
          botao.textContent = dia;
          botao.tabIndex = 0;

          const dataAtual = new Date(ano, mes, dia);
          
          // Desabilita dias passados
          if (dataAtual < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) {
              botao.disabled = true;
              botao.classList.add('text-muted', 'dia-passado');
          }

          botao.addEventListener('click', () => selecionarDia(botao, ano, mes, dia));
          botao.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                  selecionarDia(botao, ano, mes, dia);
              }
          });

          diasContainer.appendChild(botao);
      }
  }

  function selecionarDia(botao, ano, mes, dia) {
      // Remove seleção de outros dias
      document.querySelectorAll('#dias button').forEach(btn => btn.classList.remove('ativo'));
      
      // Marca o dia selecionado
      botao.classList.add('ativo');
      dataSelecionada = new Date(ano, mes, dia);
      
      atualizarResumoAgendamento();
      verificarSelecaoCompleta();
  }

  function configurarHorarios() {
      const horarioBtns = document.querySelectorAll('.horario-btn');
      
      horarioBtns.forEach(botao => {
          botao.addEventListener('click', () => {
              // Remove seleção de outros horários
              horarioBtns.forEach(b => b.classList.remove('ativo'));
              
              // Marca o horário selecionado
              botao.classList.add('ativo');
              horarioSelecionado = botao.textContent;
              
              atualizarResumoAgendamento();
              verificarSelecaoCompleta();
          });

      });
  }

  function configurarBotoesNavegacao() {
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
  }

  function atualizarResumoAgendamento() {
      if (dataSelecionada) {
          const options = { weekday: 'long', day: 'numeric', month: 'long' };
          const dataFormatada = dataSelecionada.toLocaleDateString('pt-BR', options);
          dataSelecionadaElement.textContent = `📅 ${dataFormatada}`;
          resumoAgendamento.classList.remove('d-none');
      }

      if (horarioSelecionado) {
          horarioSelecionadoElement.textContent = `⏰ Horário: ${horarioSelecionado}`;
      }

  }

  function verificarSelecaoCompleta() {
      if (dataSelecionada && horarioSelecionado) {
          btnAgendar.disabled = false;
          mensagemErro.classList.add('d-none');
      } else {
          btnAgendar.disabled = true;
      }
  }


  btnAgendar.addEventListener('click', function() {
      if (!dataSelecionada || !horarioSelecionado) {
          mensagemErro.classList.remove('d-none');
          return;
      }

      // Extrai horas e minutos do horário selecionado
      const [hora, minuto] = horarioSelecionado.split(':').map(Number);
      
      // Cria a data no fuso horário local
      const dataLocal = new Date(
          dataSelecionada.getFullYear(),
          dataSelecionada.getMonth(),
          dataSelecionada.getDate(),
          hora,
          minuto,
          0
      );

      // Converte para ISO string (UTC) para enviar ao backend
      const dataUTC = new Date(dataLocal.getTime() - (dataLocal.getTimezoneOffset() * 60000));

      // Objeto para enviar ao backend
      const novaConsulta = {
          data: dataUTC.toISOString(),
          valorConsulta: 150,
          tipoConsulta: 'ESPECIAL',
          idPaciente: 1,
          idProfissional: 6
      };

      console.log('Dados enviados:', novaConsulta);

      // Envia a requisição para o backend
      axios.post('http://10.110.12.40:9500/consultas/post', novaConsulta, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
      })
      .then(response => {
          // Formata a exibição usando a data local original
          const options = { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long',
              year: 'numeric',
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
          };
          
          detalhesAgendamento.innerHTML = `
              Sua consulta com <strong>Mykael</strong> está marcada para:<br>
              <strong>${dataLocal.toLocaleDateString('pt-BR', options)}</strong>
          `;
          
          modalConfirmacao.show();
          resetarFormulario();
      })
      .catch(error => {
          console.error('Erro detalhado:', error);
          
          let mensagem = 'Erro ao agendar consulta';
          if (error.response) {
              mensagem = `Erro ${error.response.status}: ${error.response.data.message || mensagem}`;
          } else if (error.request) {
              mensagem = 'Não foi possível conectar ao servidor';
          }
          
          mensagemErro.textContent = mensagem;
          mensagemErro.classList.remove('d-none');

      });
  });

  function resetarFormulario() {
      dataSelecionada = null;
      horarioSelecionado = null;
      btnAgendar.disabled = true;
      resumoAgendamento.classList.add('d-none');
      mensagemErro.classList.add('d-none');

      // Remove seleções visuais
      document.querySelectorAll('#dias button').forEach(btn => btn.classList.remove('ativo'));
      document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
  }
});