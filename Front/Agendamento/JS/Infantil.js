import axios from 'axios';

document.addEventListener('DOMContentLoaded', function() {
    // Variáveis de estado
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    let dataSelecionada = null;
    let horarioSelecionado = null;
    
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
  
    // Evento de agendamento
    btnAgendar.addEventListener('click', function() {
      if (!dataSelecionada || !horarioSelecionado) {
        mensagemErro.classList.remove('d-none');
        return;
      }
  
      // Formatar data e hora
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const dataFormatada = dataSelecionada.toLocaleDateString('pt-BR', options);
      
      // Mostrar modal de confirmação
      detalhesAgendamento.innerHTML = `
        Sua consulta com <strong>Gabrielly</strong> está marcada para:<br>
        <strong>${dataFormatada}</strong> às <strong>${horarioSelecionado}</strong>
      `;
      
      modalConfirmacao.show();
      
      // Aqui você pode adicionar a lógica para enviar para o backend
      console.log('Agendamento confirmado:', {
        data: dataSelecionada,
        horario: horarioSelecionado
      });
    });
  });

  
  // FETCH

document.addEventListener("DOMContentLoaded", function () {
  const btnAgendar = document.getElementById("btnAgendar");
  const mensagemErro = document.getElementById("mensagemErro");
  const resumoAgendamento = document.getElementById("resumo-agendamento");
  const dataSelecionada = document.getElementById("data-selecionada");
  const horarioSelecionado = document.getElementById("horario-selecionado");
  const detalhesAgendamento = document.getElementById("detalhes-agendamento");

  let dataConsulta = null;
  let horarioConsulta = null;

  // Obter os dados do paciente e do profissional do armazenamento ou API
  const idPaciente = localStorage.getItem("idPaciente");  // Supondo que está armazenado no localStorage
  const idProfissional = localStorage.getItem("idProfissional");  // Supondo que está armazenado no localStorage

  // Se os dados não estiverem no localStorage, você pode pegar da sessão ou fazer uma requisição.
  if (!idPaciente || !idProfissional) {
    console.error("Paciente ou Profissional não encontrados. Por favor, faça login novamente.");
    return;
  }

  // Função para formatar a data em ISO 8601
  function formatarData(data) {
    return new Date(data).toISOString();
  }

  // Função para habilitar o botão de agendar se a data e horário estiverem selecionados
  function verificarSelecao() {
    if (dataConsulta && horarioConsulta) {
      btnAgendar.disabled = false;
      mensagemErro.classList.add("d-none");
      resumoAgendamento.classList.remove("d-none");
      dataSelecionada.textContent = `Data selecionada: ${dataConsulta.toLocaleDateString()}`;
      horarioSelecionado.textContent = `Horário selecionado: ${horarioConsulta}`;
    } else {
      btnAgendar.disabled = true;
      resumoAgendamento.classList.add("d-none");
      mensagemErro.classList.remove("d-none");
    }
  }

  // Seleção da data
  document.getElementById("dias").addEventListener("click", function (e) {
    if (e.target && e.target.tagName === "SPAN") {
      // Captura a data clicada no calendário
      const dia = e.target.textContent;
      const mes = document.getElementById("mes").textContent;
      const ano = new Date().getFullYear();  // Supondo que estamos no ano atual

      const data = `${ano}-${mes}-${dia}`; // Formato simples (ex: 2025-05-14)
      dataConsulta = new Date(data);
      verificarSelecao();
    }
  });

  // Seleção do horário
  document.querySelectorAll(".horario-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      horarioConsulta = btn.textContent;
      verificarSelecao();
    });
  });

  // Função para agendar a consulta
  async function agendarConsulta() {
    if (!dataConsulta || !horarioConsulta) return;

    const dadosConsulta = {
      data: formatarData(dataConsulta) + "T" + horarioConsulta + ":00Z",  // Hora do agendamento
      valorConsulta: 0,  // Valor da consulta (pode ser alterado de acordo com a lógica de preços)
      tipoConsulta: "INFANTIL",
      idPaciente: idPaciente,  // ID do paciente logado
      idProfissional: idProfissional  // ID do profissional selecionado
    };

    try {
      const response = await axios.post('http://localhost:8080/api/consultas', dadosConsulta, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Exibe o modal de confirmação
      detalhesAgendamento.textContent = `Consulta agendada para ${dataConsulta.toLocaleDateString()} às ${horarioConsulta}`;
      const modal = new bootstrap.Modal(document.getElementById("modalConfirmacao"));
      modal.show();

    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
    }
  }

  // Evento para o botão de agendar consulta
  btnAgendar.addEventListener("click", agendarConsulta);
});
