document.addEventListener('DOMContentLoaded', () => {
  const calendario = new CalendarioAgendamento();
  calendario.init();
});

class CalendarioAgendamento {
  constructor() {
    // Data atual
    this.mesAtual = new Date().getMonth();
    this.anoAtual = new Date().getFullYear();
    this.dataSelecionada = null;
    this.horarioSelecionado = null;

    // Elementos DOM
    this.btnAgendar = document.getElementById('btnAgendar');
    this.mensagemErro = document.getElementById('mensagemErro');
    this.resumoAgendamento = document.getElementById('resumo-agendamento');
    this.dataSelecionadaElement = document.getElementById('data-selecionada');
    this.horarioSelecionadoElement = document.getElementById('horario-selecionado');
    this.modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    this.detalhesAgendamento = document.getElementById('detalhes-agendamento');

    this.nomesMeses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
  }

  init() {
    this.gerarCalendario(this.mesAtual, this.anoAtual);
    this.configurarHorarios();
    this.configurarNavegacao();
    this.configurarAgendamento();
  }

  gerarCalendario(mes, ano) {
    const diasContainer = document.getElementById('dias');
    const tituloMes = document.getElementById('mes');
    diasContainer.innerHTML = '';

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const hoje = new Date();

    tituloMes.textContent = `${this.nomesMeses[mes]} ${ano}`;

    // Preenchimento dos dias vazios no início
    for (let i = 0; i < primeiroDia; i++) {
      diasContainer.appendChild(document.createElement('div'));
    }

    // Geração de botões de dias
    for (let dia = 1; dia <= totalDias; dia++) {
      const botao = document.createElement('button');
      botao.textContent = dia;
      botao.tabIndex = 0;

      const data = new Date(ano, mes, dia);
      if (data < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) {
        botao.disabled = true;
        botao.classList.add('text-muted');
      }

      botao.addEventListener('click', () => this.selecionarDia(botao, ano, mes, dia));
      botao.addEventListener('keydown', (e) => {
        if (['Enter', ' '].includes(e.key)) {
          this.selecionarDia(botao, ano, mes, dia);
        }
      });

      diasContainer.appendChild(botao);
    }
  }

  selecionarDia(botao, ano, mes, dia) {
    document.querySelectorAll('#dias button').forEach(btn => btn.classList.remove('ativo'));
    botao.classList.add('ativo');
    this.dataSelecionada = new Date(ano, mes, dia);
    this.atualizarResumo();
    this.verificarSelecao();
  }

  selecionarHorario(botao, horario) {
    document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
    botao.classList.add('ativo');
    this.horarioSelecionado = horario;
    this.atualizarResumo();
    this.verificarSelecao();
  }

  configurarHorarios() {
    const botoesHorario = document.querySelectorAll('.horario-btn');
    botoesHorario.forEach(botao => {
      botao.addEventListener('click', () => this.selecionarHorario(botao, botao.textContent));
    });
  }

  configurarNavegacao() {
    document.getElementById('anterior').addEventListener('click', () => {
      this.mesAtual--;
      if (this.mesAtual < 0) {
        this.mesAtual = 11;
        this.anoAtual--;
      }
      this.gerarCalendario(this.mesAtual, this.anoAtual);
    });

    document.getElementById('proximo').addEventListener('click', () => {
      this.mesAtual++;
      if (this.mesAtual > 11) {
        this.mesAtual = 0;
        this.anoAtual++;
      }
      this.gerarCalendario(this.mesAtual, this.anoAtual);
    });
  }

  atualizarResumo() {
    if (this.dataSelecionada) {
      const dataFormatada = this.dataSelecionada.toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long'
      });
      this.dataSelecionadaElement.textContent = `📅 ${dataFormatada}`;
      this.resumoAgendamento.classList.remove('d-none');
    }

    if (this.horarioSelecionado) {
      this.horarioSelecionadoElement.textContent = `⏰ Horário: ${this.horarioSelecionado}`;
    }
  }

  verificarSelecao() {
    const selecionado = this.dataSelecionada && this.horarioSelecionado;
    this.btnAgendar.disabled = !selecionado;
    this.mensagemErro.classList.toggle('d-none', selecionado);
  }

  configurarAgendamento() {
    this.btnAgendar.addEventListener('click', () => {
      if (!this.dataSelecionada || !this.horarioSelecionado) {
        this.mensagemErro.classList.remove('d-none');
        return;
      }

      const [hora, minuto] = this.horarioSelecionado.split(':').map(Number);
      const dataHora = new Date(this.dataSelecionada);
      dataHora.setHours(hora, minuto, 0, 0);

      const consulta = {
        data: dataHora.toISOString(),
        valorConsulta: 150,
        tipoConsulta: 'ADULTO',
        idPaciente: 1,
        idProfissional: 1
      };

      axios.post('http://localhost:8080/consultas/post', consulta)
        .then(() => this.exibirConfirmacao(dataHora))
        .catch(error => {
          this.mensagemErro.textContent = 'Erro ao enviar agendamento: ' +
            (error.response?.data?.message || error.message);
          this.mensagemErro.classList.remove('d-none');
        });
    });
  }

  exibirConfirmacao(dataHora) {
    const options = {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };

    this.detalhesAgendamento.innerHTML = `
      Sua consulta com <strong>Vagner</strong> está marcada para:<br>
      <strong>${dataHora.toLocaleDateString('pt-BR', options)}</strong> às <strong>${this.horarioSelecionado}</strong>
    `;

    this.modalConfirmacao.show();
    this.resetarSelecao();
  }

  resetarSelecao() {
    this.dataSelecionada = null;
    this.horarioSelecionado = null;
    this.btnAgendar.disabled = true;
    this.resumoAgendamento.classList.add('d-none');
    this.mensagemErro.classList.add('d-none');

    document.querySelectorAll('#dias button').forEach(btn => btn.classList.remove('ativo'));
    document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
  }
}
