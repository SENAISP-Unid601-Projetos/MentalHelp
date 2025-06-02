document.addEventListener('DOMContentLoaded', function () {
    const axiosInstance = axios.create({
        baseURL: 'http://10.110.12.49:9500', // Base URL correta
        timeout: 10000 // Timeout de 10 segundos
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
                const resposta = await axiosInstance.get('/consultas/get', {
                    params: { data: dataSelecionada.toISOString().split('T')[0] }
                });
                console.log('Resposta do GET /consultas/get:', resposta.data);
                horariosAgendados = resposta.data.map(ag => ag.horario || ag.hora); // Ajuste conforme o campo retornado
            } catch (erro) {
                console.error('Erro ao carregar horários agendados:', erro.response ? erro.response.data : erro.message);
                if (erro.response && erro.response.status === 404) {
                    console.error('Endpoint /consultas/get não encontrado ou mal configurado.');
                    mensagemErro.textContent = 'Erro: Endpoint de consultas não encontrado.';
                } else {
                    mensagemErro.textContent = 'Erro ao carregar horários. Tente novamente.';
                }
                mensagemErro.classList.remove('d-none');
                // Mock temporário
                horariosAgendados = ['10:00', '14:30'];
            }
        }

        const horariosDisponiveis = todosHorarios.filter(h => !horariosAgendados.includes(h));
        horariosContainer.innerHTML = '';
        if (horariosDisponiveis.length === 0) {
            horariosContainer.innerHTML = '<p class="text-danger">Nenhum horário disponível para esta data.</p>';
        } else {
            horariosDisponiveis.forEach(horario => {
                const botao = document.createElement('button');
                botao.className = 'btn horario-btn';
                botao.textContent = horario;
                horariosContainer.appendChild(botao);
            });
        }
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
            mensagemErro.textContent = 'Por favor, selecione um dia e um horário para agendar.';
            mensagemErro.classList.remove('d-none');
        } else {
            mensagemErro.classList.add('d-none');
        }
    }

    btnAgendar.addEventListener('click', async function () {
        if (!dataSelecionada || !horarioSelecionado) {
            mensagemErro.textContent = 'Por favor, selecione um dia e um horário.';
            mensagemErro.classList.remove('d-none');
            return;
        }
    
        // 👉 Aplicar o horário à data
        const [hora, minuto] = horarioSelecionado.split(':');
        dataSelecionada.setHours(parseInt(hora), parseInt(minuto), 0, 0);
    
        const novoAgendamento = {
            data: dataSelecionada.toISOString(), // ex: 2025-06-02T15:30:00.000Z
            valorConsulta: 100, // Não pode ser 0
            tipoConsulta: 'INFANTIL',
            idPaciente: 1, // ❗ Substitua pelo ID real do paciente logado
            idProfissional: 1 // Gabrielly
        };
    
        try {
            const resposta = await axiosInstance.post('/consultas/post', novoAgendamento);
            console.log('Resposta do POST /consultas/post:', resposta.data);
    
            const lang = localStorage.getItem('langInfantil') || 'pt';
            const t = translationsInfantil[lang] || translationsInfantil['pt'];
    
            const dataFormatada = new Date(dataSelecionada).toLocaleDateString(
                lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES',
                { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
            );
    
            detalhesAgendamento.innerHTML = t.detalhesAgendamento
                .replace("{0}", "Gabrielly")
                .replace("{1}", dataFormatada)
                .replace("{2}", horarioSelecionado);
    
            modalConfirmacao.show();
    
        } catch (erro) {
            console.error('Erro ao agendar:', erro.response ? erro.response.data : erro.message);
            mensagemErro.textContent = 'Erro ao confirmar o agendamento. Tente novamente.';
            mensagemErro.classList.remove('d-none');
        }
    });
    

    btnVerAgendamentos.addEventListener('click', async function () {
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];

        let agendamentos = [];
        try {
            const res = await axiosInstance.get('/consultas/get'); // Ou /consultas/filter, dependendo da necessidade
            console.log('Resposta do GET /consultas/get:', res.data);
            agendamentos = res.data;
        } catch (erro) {
            console.error('Erro ao buscar agendamentos:', erro.response ? erro.response.data : erro.message);
            if (erro.response && erro.response.status === 404) {
                mensagemErro.textContent = 'Erro: Endpoint /consultas/get não encontrado.';
                mensagemErro.classList.remove('d-none');
            }
            // Mock temporário
            agendamentos = [
                { data: '2025-06-02', horario: '10:00', profissional: 'Gabrielly' },
                { data: '2025-06-03', horario: '14:30', profissional: 'Gabrielly' }
            ];
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