document.addEventListener('DOMContentLoaded', function () {
    const axiosInstance = axios.create({
        baseURL: 'http://10.110.12.49:9500/',
        timeout: 5000
    });

    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    let dataSelecionada = null;
    let horarioSelecionado = null;

    const btnAgendar = document.getElementById('btnAgendar');
    const btnVerAgendamentos = document.getElementById('btnVerAgendamentos');
    const mensagemErro = document.getElementById('mensagemErro');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');
    const horariosContainer = document.querySelector('.horarios');

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

        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];
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
            const dataAtual = new Date(ano, mes, dia);
            if (dataAtual < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) {
                botao.disabled = true;
                botao.classList.add('text-muted');
            }

            botao.addEventListener('click', () => selecionarDia(botao, ano, mes, dia));
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

    async function atualizarListaHorariosDisponiveis() {
        const todosHorarios = ['10:00', '11:30', '14:30', '16:00', '17:30', '19:00'];
        let horariosAgendados = [];

        if (dataSelecionada) {
            try {
                const resposta = await axiosInstance.get('/agendamentos', {
                    params: {
                        data: dataSelecionada.toISOString().split('T')[0]
                    }
                });
                horariosAgendados = resposta.data.map(ag => ag.horario);
            } catch (erro) {
                console.error("Erro ao carregar horários agendados:", erro);
            }
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

    function verificarSelecaoCompleta() {
        btnAgendar.disabled = !(dataSelecionada && horarioSelecionado);
        if (btnAgendar.disabled) {
            mensagemErro.classList.remove('d-none');
        } else {
            mensagemErro.classList.add('d-none');
        }
    }

    btnAgendar.addEventListener('click', async function () {
        if (!dataSelecionada || !horarioSelecionado) return;

        try {
            const novoAgendamento = {
                data: dataSelecionada.toISOString(),
                horario: horarioSelecionado,
                profissional: 'Gabrielly'
            };

            await axiosInstance.post('/agendamentos', novoAgendamento);

            const lang = localStorage.getItem('langInfantil') || 'pt';
            const t = translationsInfantil[lang] || translationsInfantil['pt'];
            const dataFormatada = new Date(dataSelecionada).toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            detalhesAgendamento.innerHTML = t.detalhesAgendamento
                .replace("{0}", "Gabrielly")
                .replace("{1}", dataFormatada)
                .replace("{2}", horarioSelecionado);

            modalConfirmacao.show();

            dataSelecionada = null;
            horarioSelecionado = null;
            document.querySelectorAll('.ativo').forEach(el => el.classList.remove('ativo'));
            btnAgendar.disabled = true;
            resumoAgendamento.classList.add('d-none');
            atualizarListaHorariosDisponiveis();
        } catch (erro) {
            console.error("Erro ao agendar:", erro);
            alert("Erro ao tentar agendar. Tente novamente mais tarde.");
        }
    });

    btnVerAgendamentos.addEventListener('click', async function () {
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];

        let agendamentos = [];
        try {
            const res = await axiosInstance.get('/agendamentos');
            agendamentos = res.data;
        } catch (erro) {
            console.error("Erro ao buscar agendamentos:", erro);
        }

        const modalHTML = `
            <div class="modal fade" id="modalAgendamentos" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${t.tituloMeusAgendamentos}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="agendamentos-lista">
                                ${agendamentos.length === 0 ? `<p>${t.semAgendamentos}</p>` :
            agendamentos.map((ag, i) => {
                const dataFormatada = new Date(ag.data).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                });
                return `
                                        <div class="agendamento-item mb-3 p-3 border rounded">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>${dataFormatada}</strong><br>
                                                    ⏰ ${t.horarioAgendamento} ${ag.horario} - ${t.profissionalAgendamento} ${ag.profissional}
                                                </div>
                                            </div>
                                        </div>
                                    `;
            }).join('')}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${t.fecharModal}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);

        const modal = new bootstrap.Modal(modalDiv.querySelector('.modal'));
        modal.show();
        modalDiv.querySelector('.modal').addEventListener('hidden.bs.modal', function () {
            document.body.removeChild(modalDiv);
        });
    });
});
