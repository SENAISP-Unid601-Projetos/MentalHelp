document.addEventListener('DOMContentLoaded', function() {
    // Variáveis de estado
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    let dataSelecionada = null;
    let horarioSelecionado = null;
    let agendamentos = JSON.parse(localStorage.getItem('agendamentosAdulto')) || [];

    // Elementos DOM
    const languageSelectAdulto = document.getElementById("languageSelectAdulto");
    const btnAgendar = document.getElementById('btnAgendar');
    const btnVerAgendamentos = document.getElementById('btnVerAgendamentos');
    const mensagemErro = document.getElementById('mensagemErro');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');
    const horariosContainer = document.querySelector('.horarios');

    // Variáveis para o modal de agendamentos
    let modalAgendamentos = null;
    let modalAgendamentosElement = null;

    // Inicialização
    const savedLangAdulto = localStorage.getItem("langAdulto") || 'pt';
    languageSelectAdulto.value = savedLangAdulto;
    updateContentAdulto(savedLangAdulto);
    gerarCalendario(mesAtual, anoAtual);
    configurarHorarios();
    configurarBotoesNavegacao();
    atualizarListaHorariosDisponiveis();

    // Atualizar conteúdo com base no idioma
    function updateContentAdulto(lang) {
        const t = translationsAdulto[lang] || translationsAdulto['pt'];

        document.title = t.tituloPagina;
        document.getElementById("tipoAtendimento").textContent = t.tipoAtendimento;
        document.getElementById("profissionalEncontrada").textContent = t.profissionalEncontrada;
        document.getElementById("especialidade").textContent = t.especialidade;
        document.getElementById("anterior").textContent = '‹';
        document.getElementById("proximo").textContent = '›';
        const voltar = document.getElementById("voltar");
        if (voltar) {
            const spanText = voltar.querySelector(".btn-text");
            if (spanText) spanText.textContent = t.voltar || 'Voltar';
        }

        const diasSemana = document.querySelectorAll(".dias-semana span");
        diasSemana[0].textContent = t.domingo;
        diasSemana[1].textContent = t.segunda;
        diasSemana[2].textContent = t.terca;
        diasSemana[3].textContent = t.quarta;
        diasSemana[4].textContent = t.quinta;
        diasSemana[5].textContent = t.sexta;
        diasSemana[6].textContent = t.sabado;

        document.getElementById("qualHorarioMelhor").textContent = t.qualHorarioMelhor;
        document.getElementById("fusoHorario").textContent = t.fusoHorario;

        if (resumoAgendamento) {
            const h4Resumo = resumoAgendamento.querySelector("h4");
            if (h4Resumo) h4Resumo.textContent = t.resumoAgendamento;
        }

        if (btnAgendar) {
            const spanText = btnAgendar.querySelector(".btn-text");
            if (spanText) spanText.textContent = t.confirmarAgendamento;
        }

        if (btnVerAgendamentos) {
            const spanText = btnVerAgendamentos.querySelector(".btn-text");
            if (spanText) spanText.textContent = t.tituloMeusAgendamentos;
        }

        if (mensagemErro) mensagemErro.textContent = t.selecioneDiaHorario;

        const modalTitle = document.querySelector("#modalConfirmacao .modal-title");
        if (modalTitle) modalTitle.textContent = t.agendamentoConfirmado;
        const modalBodyH4 = document.querySelector("#modalConfirmacao .modal-body h4");
        if (modalBodyH4) modalBodyH4.textContent = t.consultaAgendadaSucesso;
        const modalFooterButton = document.querySelector("#modalConfirmacao .modal-footer .btn-primary");
        if (modalFooterButton) modalFooterButton.textContent = t.fecharModal;

        if (detalhesAgendamento && a && c) {
            detalhesAgendamento.innerHTML = t.detalhesAgendamento
                .replace("{0}", "Vagner")
                .replace("{1}", a)
                .replace("{2}", c);
        }
    }

    // Função principal para gerar o calendário
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

    // Selecionar dia no calendário
    function selecionarDia(botao, ano, mes, dia) {
        document.querySelectorAll('.dias button').forEach(btn => {
            btn.classList.remove('ativo');
        });

        botao.classList.add('ativo');
        dataSelecionada = new Date(ano, mes, dia);
        dataSelecionada.setHours(0, 0, 0, 0);
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
            const lang = localStorage.getItem('langAdulto') || 'pt';
            const t = translationsAdulto[lang] || translationsAdulto['pt'];
            mensagemErro.textContent = t.selecioneDiaHorario;
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
        a = dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', options);
        b = dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'long' });
        c = horarioSelecionado;

        detalhesAgendamento.innerHTML = t.detalhesAgendamento
            .replace("{0}", "Vagner")
            .replace("{1}", a)
            .replace("{2}", c);
        modalConfirmacao.show();

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

    // Função para baixar relatório
    function baixarRelatorio(index) {
        const agendamento = agendamentos[index];
        if (!agendamento) return;

        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];
        
        const data = new Date(agendamento.data);
        const dataFormatada = data.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const conteudo = `
            ${t.tituloMeusAgendamentos}
            ==============================
            
            ${t.dataAgendamento} ${dataFormatada}
            ${t.horarioAgendamento} ${agendamento.horario}
            ${t.profissionalAgendamento} ${agendamento.profissional}
            
            ==============================
            Gerado em: ${new Date().toLocaleString()}
        `;

        const blob = new Blob([conteudo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agendamento_${dataFormatada.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Atualizar modal de agendamentos
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
                        <div>
                            <strong>${dataFormatada}</strong><br>
                            ⏰ ${t.horarioAgendamento} ${ag.horario} - ${t.profissionalAgendamento} ${ag.profissional}
                        </div>
                        <div class="d-flex justify-content-end gap-2 mt-2">
                            <button class="btn btn-primary btn-sm btn-baixar" data-id="${index}">
                                <i class="bi bi-download"></i> ${t.baixarRelatorio}
                            </button>
                            <button class="btn btn-danger btn-sm btn-excluir" data-index="${index}">
                                <i class="bi bi-trash"></i> ${t.cancelarAgendamento}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
    
        // Configura eventos para os botões de baixar
        lista.querySelectorAll('.btn-baixar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-id');
                baixarRelatorio(index);
            });
        });
    
        // Configura eventos para os botões de excluir
        lista.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                agendamentos.splice(index, 1);
                localStorage.setItem('agendamentosAdulto', JSON.stringify(agendamentos));
                atualizarListaHorariosDisponiveis();
                atualizarModalAgendamentos();
            });
        });
    }

    // Criar modal de agendamentos
    function criarModalAgendamentos() {
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];
    
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
        document.body.appendChild(modalAgendamentosElement);
        modalAgendamentos = new bootstrap.Modal(modalAgendamentosElement.querySelector('.modal'));
    }

    // Exibir agendamentos
    btnVerAgendamentos.addEventListener('click', function() {
        // Verifica se a modal já existe
        if (!modalAgendamentos) {
            criarModalAgendamentos();
        }
        atualizarModalAgendamentos();
        modalAgendamentos.show();
    });

    // Evento para mudança de idioma
    languageSelectAdulto.addEventListener("change", function() {
        const lang = this.value;
        localStorage.setItem("langAdulto", lang);
        updateContentAdulto(lang);
        gerarCalendario(mesAtual, anoAtual);
        atualizarResumoAgendamento();
    });
});