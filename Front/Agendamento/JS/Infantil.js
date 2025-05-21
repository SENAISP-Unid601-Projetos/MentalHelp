document.addEventListener('DOMContentLoaded', function() {
    // Variáveis de estado
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    let dataSelecionada = null;
    let horarioSelecionado = null;
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    // Elementos DOM
    const btnAgendar = document.getElementById('btnAgendar');
    const btnVerAgendamentos = document.getElementById('btnVerAgendamentos');
    const mensagemErro = document.getElementById('mensagemErro');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');
    const horariosContainer = document.querySelector('.horarios');

    // Inicialização
    gerarCalendario(mesAtual, anoAtual);
    configurarHorarios();
    configurarBotoesNavegacao();
    atualizarListaHorariosDisponiveis();

    // Função principal para gerar o calendário
    function gerarCalendario(mes, ano) {
        const diasContainer = document.getElementById('dias');
        const tituloMes = document.getElementById('mes');
        diasContainer.innerHTML = '';

        const primeiroDia = new Date(ano, mes, 1).getDay();
        const totalDias = new Date(ano, mes + 1, 0).getDate();
        const hoje = new Date();

        // Usar traduções para o nome do mês
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];
        const monthNames = [
            t.janeiro, t.fevereiro, t.marco, t.abril, t.maio, t.junho,
            t.julho, t.agosto, t.setembro, t.outubro, t.novembro, t.dezembro
        ];
        tituloMes.textContent = `${monthNames[mes]} ${ano}`;

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
        document.querySelectorAll('.dias button').forEach(btn => {
            btn.classList.remove('ativo');
        });

        botao.classList.add('ativo');
        dataSelecionada = new Date(ano, mes, dia);
        dataSelecionada.setHours(0, 0, 0, 0); // Normaliza a data
        horarioSelecionado = null;
        document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
        atualizarListaHorariosDisponiveis();
        atualizarResumoAgendamento();
        verificarSelecaoCompleta();
    }

    // Configurar listeners para os horários
    function configurarHorarios() {
        horariosContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('horario-btn')) {
                selecionarHorario(e.target);
            }
        });
    }

    // Selecionar horário
    function selecionarHorario(botao) {
        document.querySelectorAll('.horario-btn').forEach(btn => {
            btn.classList.remove('ativo');
        });

        botao.classList.add('ativo');
        horarioSelecionado = botao.textContent;
        atualizarResumoAgendamento();
        verificarSelecaoCompleta();
    }

    // Atualizar lista de horários disponíveis
    function atualizarListaHorariosDisponiveis() {
        const todosHorarios = ['10:00', '11:30', '14:30', '16:00', '17:30', '19:00'];
        let horariosAgendados = [];

        if (dataSelecionada) {
            horariosAgendados = agendamentos
                .filter(ag => {
                    const agendamentoData = new Date(ag.data);
                    return agendamentoData.getFullYear() === dataSelecionada.getFullYear() &&
                           agendamentoData.getMonth() === dataSelecionada.getMonth() &&
                           agendamentoData.getDate() === dataSelecionada.getDate();
                })
                .map(ag => ag.horario);
        }

        const horariosDisponiveis = todosHorarios.filter(h => !horariosAgendados.includes(h));

        horariosContainer.innerHTML = '';
        horariosDisponiveis.forEach(horario => {
            const botao = document.createElement('button');
            botao.className = 'btn horario-btn';
            botao.textContent = horario;
            horariosContainer.appendChild(botao);
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
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];

        if (dataSelecionada) {
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            const dataFormatada = dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', options);
            dataSelecionadaElement.textContent = `📅 ${t.dataSelecionada} ${dataFormatada}`;
            resumoAgendamento.classList.remove('d-none');
        } else {
            resumoAgendamento.classList.add('d-none');
        }

        if (horarioSelecionado) {
            horarioSelecionadoElement.textContent = `⏰ ${t.horarioSelecionado} ${horarioSelecionado}`;
        } else {
            horarioSelecionadoElement.textContent = '';
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
            const lang = localStorage.getItem('langInfantil') || 'pt';
            const t = translationsInfantil[lang] || translationsInfantil['pt'];
            mensagemErro.textContent = t.mensagemErro;
            mensagemErro.classList.remove('d-none');
            return;
        }

        // Adicionar aos agendamentos
        const novoAgendamento = {
            data: new Date(dataSelecionada),
            horario: horarioSelecionado,
            profissional: "Gabrielly"
        };
        agendamentos.push(novoAgendamento);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

        // Configurar variáveis a, b, c
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        a = dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', options);
        b = dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'long' });
        c = horarioSelecionado;

        // Mostrar modal com texto traduzido
        detalhesAgendamento.innerHTML = t.detalhesAgendamento
            .replace("{0}", "Gabrielly")
            .replace("{1}", a)
            .replace("{2}", c);
        modalConfirmacao.show();

        // Resetar seleções
        dataSelecionada = null;
        horarioSelecionado = null;
        a = null;
        b = null;
        c = null;
        document.querySelectorAll('.ativo').forEach(el => el.classList.remove('ativo'));
        btnAgendar.disabled = true;
        resumoAgendamento.classList.add('d-none');
        atualizarListaHorariosDisponiveis();
    });

    // Função auxiliar para atualizar o conteúdo do modal de agendamentos
    function atualizarModalAgendamentos(modalDiv, modal) {
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];

        const agendamentosLista = modalDiv.querySelector('.agendamentos-lista');
        agendamentosLista.innerHTML = agendamentos.length === 0
            ? `<p>${t.semAgendamentos}</p>`
            : agendamentos.map((ag, index) => {
                const dataFormatada = new Date(ag.data).toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                return `
                    <div class="agendamento-item mb-3 p-3 border rounded">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${dataFormatada}</strong><br>
                                ⏰ ${t.horarioAgendamento} ${ag.horario} - ${t.profissionalAgendamento} ${ag.profissional}
                            </div>
                            <button class="btn btn-danger btn-sm btn-excluir" data-index="${index}">
                                <i class="bi bi-trash"></i> ${t.cancelarAgendamento}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

        // Adicionar eventos de exclusão
        modalDiv.querySelectorAll('.btn-excluir').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                agendamentos.splice(index, 1);
                localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
                atualizarListaHorariosDisponiveis();
                atualizarModalAgendamentos(modalDiv, modal);
            });
        });
    }

    // Exibir agendamentos
    btnVerAgendamentos.addEventListener('click', function() {
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];

        const modalHTML = `
            <div class="modal fade" id="modalAgendamentos" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${t.tituloMeusAgendamentos}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="agendamentos-lista"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${t.fecharModal}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Cria e mostra o modal
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);

        const modal = new bootstrap.Modal(modalDiv.querySelector('.modal'));
        atualizarModalAgendamentos(modalDiv, modal);
        modal.show();

        // Remove o modal do DOM quando fechado
        modalDiv.querySelector('.modal').addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modalDiv);
        });
    });
});