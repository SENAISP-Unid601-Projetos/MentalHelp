document.addEventListener('DOMContentLoaded', function () {
    // Configuração do Axios
    const axiosInstance = axios.create({
        baseURL: 'http://10.110.12.49:9500/',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    // Variáveis globais
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    let dataSelecionada = null;
    let horarioSelecionado = null;

    // Elementos da DOM
    const btnAgendar = document.getElementById('btnAgendar');
    const btnVerAgendamentos = document.getElementById('btnVerAgendamentos');
    const mensagemErro = document.getElementById('mensagemErro');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');
    const horariosContainer = document.getElementById('horarios-container');
    const diasContainer = document.getElementById('dias');

    // Inicialização
    gerarCalendario(mesAtual, anoAtual);
    configurarBotoesNavegacao();
    atualizarListaHorariosDisponiveis();

    // Função principal para gerar o calendário
    function gerarCalendario(mes, ano) {
        diasContainer.innerHTML = '';
        const tituloMes = document.getElementById('mes');

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

        // Dias vazios para começar no dia correto da semana
        for (let i = 0; i < primeiroDia; i++) {
            diasContainer.appendChild(document.createElement('div'));
        }

        // Gerar dias do mês
        for (let dia = 1; dia <= totalDias; dia++) {
            const botao = document.createElement('button');
            botao.textContent = dia;
            const dataAtual = new Date(ano, mes, dia);

            // Desabilitar dias passados
            if (dataAtual < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) {
                botao.disabled = true;
                botao.classList.add('text-muted');
            }

            botao.addEventListener('click', () => selecionarDia(botao, ano, mes, dia));
            diasContainer.appendChild(botao);
        }
    }

    // Selecionar dia no calendário
    function selecionarDia(botao, ano, mes, dia) {
        document.querySelectorAll('.dias button').forEach(btn => btn.classList.remove('ativo'));
        botao.classList.add('ativo');
        dataSelecionada = new Date(ano, mes, dia);
        horarioSelecionado = null;
        
        // Limpar seleção de horários
        document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
        
        atualizarListaHorariosDisponiveis();
        atualizarResumoAgendamento();
        verificarSelecaoCompleta();
    }

    // Configurar navegação entre meses
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

    // Atualizar horários disponíveis
    async function atualizarListaHorariosDisponiveis() {
        const todosHorarios = ['10:00', '11:30', '14:30', '16:00', '17:30', '19:00'];
        let horariosAgendados = [];

        if (dataSelecionada) {
            try {
                const resposta = await axiosInstance.get('/consultas/get', {
                    params: { 
                        data: dataSelecionada.toISOString().split('T')[0],
                        profissional: 'Gabrielly'
                    }
                });
                horariosAgendados = resposta.data.map(ag => ag.horario);
            } catch (erro) {
                console.error('Erro ao carregar horários:', erro);
                // Fallback caso a API não responda
                horariosAgendados = [];
            }
        }

        // Filtrar horários disponíveis
        const horariosDisponiveis = todosHorarios.filter(h => !horariosAgendados.includes(h));
        horariosContainer.innerHTML = '';

        if (horariosDisponiveis.length === 0) {
            const lang = localStorage.getItem('langInfantil') || 'pt';
            const t = translationsInfantil[lang] || translationsInfantil['pt'];
            horariosContainer.innerHTML = `<p class="text-danger">${t.nenhumHorarioDisponivel}</p>`;
        } else {
            horariosDisponiveis.forEach(horario => {
                const botao = document.createElement('button');
                botao.className = 'btn horario-btn';
                botao.textContent = horario;
                botao.addEventListener('click', () => selecionarHorario(botao));
                horariosContainer.appendChild(botao);
            });
        }
    }

    // Selecionar horário
    function selecionarHorario(botao) {
        document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
        botao.classList.add('ativo');
        horarioSelecionado = botao.textContent;
        atualizarResumoAgendamento();
        verificarSelecaoCompleta();
    }

    // Atualizar resumo do agendamento
    function atualizarResumoAgendamento() {
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];

        if (dataSelecionada) {
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            const dataFormatada = dataSelecionada.toLocaleDateString(
                lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', 
                options
            );
            dataSelecionadaElement.textContent = `📅 ${t.dataSelecionada} ${dataFormatada}`;
            resumoAgendamento.classList.remove('d-none');
        }

        if (horarioSelecionado) {
            horarioSelecionadoElement.textContent = `⏰ ${t.horarioSelecionado} ${horarioSelecionado}`;
        }
    }

    // Verificar se data e horário foram selecionados
    function verificarSelecaoCompleta() {
        btnAgendar.disabled = !(dataSelecionada && horarioSelecionado);
        mensagemErro.classList.add('d-none');
    }

    // Evento de agendamento
    btnAgendar.addEventListener('click', async function () {
        if (!dataSelecionada || !horarioSelecionado) return;

        try {
            const novoAgendamento = {
                data: dataSelecionada.toISOString().split('T')[0],
                horario: horarioSelecionado,
                profissional: 'Gabrielly',
                tipo: 'Infantil'
            };

            console.log('Enviando agendamento:', novoAgendamento);

            // Tentativa principal
            let resposta;
            try {
                resposta = await axiosInstance.post('/consultas', novoAgendamento);
            } catch (erro) {
                // Fallback para endpoint alternativo
                if (erro.response?.status === 404 || erro.response?.status === 405) {
                    console.log('Tentando endpoint alternativo...');
                    resposta = await axiosInstance.post('/consultas/post', novoAgendamento);
                } else {
                    throw erro;
                }
            }

            console.log('Agendamento realizado:', resposta.data);
            mostrarModalConfirmacao();
            resetarSelecoes();

        } catch (erro) {
            console.error('Erro no agendamento:', erro);
            mostrarErro(erro);
        }
    });

    // Mostrar modal de confirmação
    function mostrarModalConfirmacao() {
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];
        
        const dataFormatada = dataSelecionada.toLocaleDateString(
            lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES',
            { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
        );

        detalhesAgendamento.innerHTML = `
            ${t.consultaCom} Gabrielly<br>
            ${t.data}: ${dataFormatada}<br>
            ${t.horario}: ${horarioSelecionado}
        `;

        modalConfirmacao.show();
    }

    // Resetar seleções após agendamento
    function resetarSelecoes() {
        dataSelecionada = null;
        horarioSelecionado = null;
        document.querySelectorAll('.ativo').forEach(el => el.classList.remove('ativo'));
        btnAgendar.disabled = true;
        resumoAgendamento.classList.add('d-none');
        atualizarListaHorariosDisponiveis();
    }

    // Mostrar mensagens de erro
    function mostrarErro(erro) {
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];
        
        let mensagem = t.erroAgendamento;
        
        if (erro.response) {
            switch(erro.response.status) {
                case 400: mensagem = t.erro400; break;
                case 401: mensagem = t.erro401; break;
                case 403: mensagem = t.erro403; break;
                case 404: mensagem = t.erro404; break;
                case 405: mensagem = t.erro405; break;
                case 500: mensagem = t.erro500; break;
            }
        }

        mensagemErro.textContent = mensagem;
        mensagemErro.classList.remove('d-none');
        setTimeout(() => mensagemErro.classList.add('d-none'), 5000);
    }

    // Visualizar agendamentos
    btnVerAgendamentos.addEventListener('click', async function () {
        try {
            const resposta = await axiosInstance.get('/consultas/get', {
                params: { profissional: 'Gabrielly' }
            });
            
            mostrarAgendamentosModal(resposta.data);
        } catch (erro) {
            console.error('Erro ao buscar agendamentos:', erro);
            mostrarErro(erro);
        }
    });

    // Mostrar modal com agendamentos
    function mostrarAgendamentosModal(agendamentos) {
        const lang = localStorage.getItem('langInfantil') || 'pt';
        const t = translationsInfantil[lang] || translationsInfantil['pt'];

        const modalHTML = `
            <div class="modal fade" id="modalAgendamentos" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${t.meusAgendamentos}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${agendamentos.length === 0 
                                ? `<p class="text-center">${t.semAgendamentos}</p>`
                                : `<div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>${t.data}</th>
                                                <th>${t.horario}</th>
                                                <th>${t.profissional}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${agendamentos.map(ag => `
                                                <tr>
                                                    <td>${new Date(ag.data).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US')}</td>
                                                    <td>${ag.horario}</td>
                                                    <td>${ag.profissional}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>`}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${t.fechar}</button>
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
    }
});