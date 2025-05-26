document.addEventListener('DOMContentLoaded', function() {
    // Variáveis de estado
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    window.dataSelecionada = null;
    window.horarioSelecionado = null;

    
    // Elementos DOM
    const btnAgendar = document.getElementById('btnAgendar');
    const mensagemErro = document.getElementById('mensagemErro');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');
  
    // Nomes dos meses
    const nomesMeses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
  
    // Inicialização
    gerarCalendario(mesAtual, anoAtual);
    configurarHorarios();
    configurarBotoesNavegacao();
  
    // Função principal para gerar o calendário
    function gerarCalendario(mes, ano) {
      const diasContainer = document.getElementById('dias');
      const tituloMes = document.getElementById('mes');
      diasContainer.innerHTML = '';
  
      const primeiroDia = new Date(ano, mes, 1).getDay();
      const totalDias = new Date(ano, mes + 1, 0).getDate();
      const hoje = new Date();
  
      tituloMes.textContent = `${nomesMeses[mes]} ${ano}`;
  
      // Dias vazios no início do mês
      for (let i = 0; i < primeiroDia; i++) {
        diasContainer.appendChild(document.createElement('div'));
      }
  
      // Dias do mês
      for (let dia = 1; dia <= totalDias; dia++) {
        const botao = document.createElement('button');
        botao.textContent = dia;
        botao.tabIndex = 0;
        
        // Desabilitar dias passados
        const dataAtual = new Date(ano, mes, dia);
        if (dataAtual < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) {
          botao.disabled = true;
          botao.classList.add('text-muted');
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
  
    // Selecionar dia no calendário
    function selecionarDia(botao, ano, mes, dia) {
      // Limpar seleção anterior
      document.querySelectorAll('.dias button').forEach(btn => {
        btn.classList.remove('ativo');
      });
      
      // Marcar novo selecionado
      botao.classList.add('ativo');
      dataSelecionada = new Date(ano, mes, dia);
      
      // Atualizar resumo
      atualizarResumoAgendamento();
      verificarSelecaoCompleta();
    }
  
    // Selecionar horário
    function selecionarHorario(botao, horario) {
      // Limpar seleção anterior
      document.querySelectorAll('.horario-btn').forEach(btn => {
        btn.classList.remove('ativo');
      });
      
      // Marcar novo selecionado
      botao.classList.add('ativo');
      horarioSelecionado = horario;
      
      // Atualizar resumo
      atualizarResumoAgendamento();
      verificarSelecaoCompleta();
    }
  
    // Configurar listeners para os horários
    function configurarHorarios() {
      const botoesHorario = document.querySelectorAll('.horario-btn');
      
      botoesHorario.forEach(botao => {
        botao.addEventListener('click', () => {
          selecionarHorario(botao, botao.textContent);
        });
      });
    }
  
    // Configurar navegação do calendário
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
  
    // Atualizar resumo do agendamento
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
  
    // Verificar se ambos estão selecionados
    function verificarSelecaoCompleta() {
      if (dataSelecionada && horarioSelecionado) {
        btnAgendar.disabled = false;
        mensagemErro.classList.add('d-none');
      } else {
        btnAgendar.disabled = true;
      }
    }

  });