document.addEventListener('DOMContentLoaded', function () {
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();

    let dataSelecionada = null;
    let horarioSelecionado = null;
    let agendamentos = JSON.parse(localStorage.getItem('agendamentosAdulto')) || [];

    const btnAgendar = document.getElementById('btnAgendar');
    const btnVerAgendamentos = document.getElementById('btnVerAgendamentos');
    const mensagemErro = document.getElementById('mensagemErro');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');
    const horariosContainer = document.querySelector('.horarios');

    let modalAgendamentos = null;
    let modalAgendamentosElement = null;

    gerarCalendario(mesAtual, anoAtual);
    configurarHorarios();
    configurarBotoesNavegacao();
    atualizarListaHorariosDisponiveis();

    function gerarCalendario(mes, ano) {
        const diasContainer = document.getElementById('dias');
        const tituloMes = document.getElementById('mes');
        diasContainer.innerHTML = '';

        const primeiroDia = new Date(ano, mes, 1).getDay();
        const totalDias = new Date(ano, mes + 1, 0).getDate();
        const hoje = new Date();

        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];
        const monthNames = [
            t.janeiro, t.fevereiro, t.marco, t.abril, t.maio, t.junho,
            t.julho, t.agosto, t.setembro, t.outubro, t.novembro, t.dezembro
        ];
        tituloMes.textContent = `${monthNames[mes]} ${ano}`;

        for (let i = 0; i < primeiroDia; i++) {
            diasContainer.appendChild(document.createElement('div'));
        }

        for (let dia = 1; dia <= totalDias; dia++) {
            const botao = document.createElement('button');
            botao.textContent = dia;
            botao.tabIndex = 0;

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

    function selecionarDia(botao, ano, mes, dia) {
        document.querySelectorAll('.dias button').forEach(btn => btn.classList.remove('ativo'));
        botao.classList.add('ativo');
        dataSelecionada = new Date(ano, mes, dia);
        dataSelecionada.setHours(0, 0, 0, 0);
        horarioSelecionado = null;
        document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
        atualizarListaHorariosDisponiveis();
        atualizarResumoAgendamento();
        verificarSelecaoCompleta();
    }

    function configurarHorarios() {
        horariosContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('horario-btn')) {
                selecionarHorario(e.target);
            }
        });
    }

    function selecionarHorario(botao) {
        document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
        botao.classList.add('ativo');
        horarioSelecionado = botao.textContent;
        atualizarResumoAgendamento();
        verificarSelecaoCompleta();
    }

    function atualizarListaHorariosDisponiveis() {
        const todosHorarios = ['10:00', '11:30', '14:30', '16:00', '17:30', '19:00'];
        let horariosAgendados = [];

        if (dataSelecionada) {
            horariosAgendados = agendamentos
                .filter(ag => {
                    const agendamentoData = new Date(ag.data);
                    return agendamentoData.toDateString() === dataSelecionada.toDateString();
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
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];

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

    function verificarSelecaoCompleta() {
        if (dataSelecionada && horarioSelecionado) {
            btnAgendar.disabled = false;
            mensagemErro.classList.add('d-none');
        } else {
            btnAgendar.disabled = true;
        }
    }

    btnAgendar.addEventListener('click', function () {
        if (!dataSelecionada || !horarioSelecionado) {
            const lang = localStorage.getItem('langAdulto') || 'pt';
            const t = translationsAdulto[lang] || translationsAdulto['pt'];
            mensagemErro.textContent = t.mensagemErro;
            mensagemErro.classList.remove('d-none');
            return;
        }

        const novoAgendamento = {
            data: new Date(dataSelecionada),
            horario: horarioSelecionado,
            profissional: "Vagner"
        };
        agendamentos.push(novoAgendamento);
        localStorage.setItem('agendamentosAdulto', JSON.stringify(agendamentos));

        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dataTexto = dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', options);

        detalhesAgendamento.innerHTML = t.detalhesAgendamento
            .replace("{0}", "Vagner")
            .replace("{1}", dataTexto)
            .replace("{2}", horarioSelecionado);

        modalConfirmacao.show();

        dataSelecionada = null;
        horarioSelecionado = null;
        document.querySelectorAll('.ativo').forEach(el => el.classList.remove('ativo'));
        btnAgendar.disabled = true;
        resumoAgendamento.classList.add('d-none');
        atualizarListaHorariosDisponiveis();
    });

    function atualizarModalAgendamentos() {
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];
        const lista = modalAgendamentosElement.querySelector('.agendamentos-lista');

        lista.innerHTML = agendamentos.length === 0
            ? `<p>${t.semAgendamentos}</p>`
            : agendamentos.map((ag, index) => {
                const dataFormatada = new Date(ag.data).toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
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

        lista.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                agendamentos.splice(index, 1);
                localStorage.setItem('agendamentosAdulto', JSON.stringify(agendamentos));
                atualizarListaHorariosDisponiveis();
                atualizarModalAgendamentos();
            });
        });
    }

    btnVerAgendamentos.addEventListener('click', function () {
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];

        if (!modalAgendamentos) {
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

            modalAgendamentosElement = document.createElement('div');
            modalAgendamentosElement.innerHTML = modalHTML;
            modalAgendamentos = new bootstrap.Modal(modalAgendamentosElement.querySelector('.modal'));

            modalAgendamentosElement.querySelector('.modal').addEventListener('hidden.bs.modal', () => {
                modalAgendamentos.hide();
            });
        }

        atualizarModalAgendamentos();
        modalAgendamentos.show();
    });
});
