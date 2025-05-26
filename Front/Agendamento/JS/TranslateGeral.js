// Adulto.js

let a = null; // Armazena data formatada
let b = null; // Armazena dia da semana
let c = null; // Armazena horário

const translationsAdulto = {
    pt: {
        tituloPagina: "Agendamento",
        tipoAtendimento: "Atendimento selecionado: Adulto",
        profissionalEncontrada: "Profissional encontrada: Vagner",
        especialidade: "Especialista em: Desenvolvimento Pessoal",
        mesAnterior: "Mês anterior",
        proximoMes: "Próximo mês",
        domingo: "DOM",
        segunda: "SEG",
        terca: "TER",
        quarta: "QUA",
        quinta: "QUI",
        sexta: "SEX",
        sabado: "SAB",
        qualHorarioMelhor: "Qual o horário é melhor?",
        fusoHorario: "UTC -3 (Horário de Brasília)",
        resumoAgendamento: "Resumo do Agendamento:",
        dataSelecionada: "Data Selecionada:",
        horarioSelecionado: "Horário Selecionado:",
        confirmarAgendamento: "Confirmar Agendamento",
        selecioneDiaHorario: "Por favor, selecione um dia e um horário para agendar",
        agendamentoConfirmado: "Agendamento Confirmado!",
        consultaAgendadaSucesso: "Consulta agendada com sucesso!",
        detalhesAgendamento: "Sua consulta com {0} está marcada para: {1} às {2}",
        fecharModal: "Fechar",
        // Traduções para os meses
        janeiro: "Janeiro",
        fevereiro: "Fevereiro",
        marco: "Março",
        abril: "Abril",
        maio: "Maio",
        junho: "Junho",
        julho: "Julho",
        agosto: "Agosto",
        setembro: "Setembro",
        outubro: "Outubro",
        novembro: "Novembro",
        dezembro: "Dezembro",
        // Traduções para a página Meus Agendamentos
        tituloMeusAgendamentos: "Meus Agendamentos",
        semAgendamentos: "Nenhum agendamento encontrado.",
        dataAgendamento: "Data:",
        horarioAgendamento: "Horário:",
        profissionalAgendamento: "Profissional:",
        cancelarAgendamento: "Excluir"
    },
    en: {
        tituloPagina: "Scheduling",
        tipoAtendimento: "Selected Service: Adult",
        profissionalEncontrada: "Professional found: Vagner",
        especialidade: "Specialist in: Personal Development",
        mesAnterior: "Previous month",
        proximoMes: "Next month",
        domingo: "SUN",
        segunda: "MON",
        terca: "TUE",
        quarta: "WED",
        quinta: "THU",
        sexta: "FRI",
        sabado: "SAT",
        qualHorarioMelhor: "What time works best?",
        fusoHorario: "UTC -3 (Brasilia Time)",
        resumoAgendamento: "Appointment Summary:",
        dataSelecionada: "Selected Date:",
        horarioSelecionado: "Selected Time:",
        confirmarAgendamento: "Confirm Appointment",
        selecioneDiaHorario: "Please select a day and time to schedule",
        agendamentoConfirmado: "Appointment Confirmed!",
        consultaAgendadaSucesso: "Appointment scheduled successfully!",
        detalhesAgendamento: "Your appointment with {0} is scheduled for: {1} at {2}",
        fecharModal: "Close",
        // Traduções para os meses
        janeiro: "January",
        fevereiro: "February",
        marco: "March",
        abril: "April",
        maio: "May",
        junho: "June",
        julho: "July",
        agosto: "August",
        setembro: "September",
        outubro: "October",
        novembro: "November",
        dezembro: "December",
        // Traduções para a página Meus Agendamentos
        tituloMeusAgendamentos: "My Appointments",
        semAgendamentos: "No appointments found.",
        dataAgendamento: "Date:",
        horarioAgendamento: "Time:",
        profissionalAgendamento: "Professional:",
        cancelarAgendamento: "Delete"
    },
    es: {
        tituloPagina: "Programación",
        tipoAtendimento: "Servicio seleccionado: Adulto",
        profissionalEncontrada: "Profesional encontrado: Vagner",
        especialidade: "Especialista en: Desarrollo Personal",
        mesAnterior: "Mes anterior",
        proximoMes: "Próximo mes",
        domingo: "DOM",
        segunda: "LUN",
        terca: "MAR",
        quarta: "MIÉ",
        quinta: "JUE",
        sexta: "VIE",
        sabado: "SÁB",
        qualHorarioMelhor: "¿Qué horario es mejor?",
        fusoHorario: "UTC -3 (Hora de Brasilia)",
        resumoAgendamento: "Resumen de la Cita:",
        dataSelecionada: "Fecha Seleccionada:",
        horarioSelecionado: "Hora Seleccionada:",
        confirmarAgendamento: "Confirmar Cita",
        selecioneDiaHorario: "Por favor, seleccione un día y una hora para programar",
        agendamentoConfirmado: "¡Cita Confirmada!",
        consultaAgendadaSucesso: "¡Cita programada con éxito!",
        detalhesAgendamento: "Su cita con {0} está programada para: {1} a las {2}",
        fecharModal: "Cerrar",
        // Traduções para os meses
        janeiro: "Enero",
        fevereiro: "Febrero",
        marco: "Marzo",
        abril: "Abril",
        maio: "Mayo",
        junho: "Junio",
        julho: "Julio",
        agosto: "Agosto",
        setembro: "Septiembre",
        outubro: "Octubre",
        novembro: "Noviembre",
        dezembro: "Diciembre",
        // Traduções para a página Meus Agendamentos
        tituloMeusAgendamentos: "Mis Citas",
        semAgendamentos: "No se encontraron citas.",
        dataAgendamento: "Fecha:",
        horarioAgendamento: "Hora:",
        profissionalAgendamento: "Profesional:",
        cancelarAgendamento: "Eliminar"
    }
};

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
        document.getElementById("anterior").textContent = '‹'; // Mantém o ícone
        document.getElementById("proximo").textContent = '›'; // Mantém o ícone

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
            horarioSelecionadaElement.textContent = '';
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

    // Função auxiliar para atualizar o conteúdo do modal de agendamentos
    function atualizarModalAgendamentos(modalDiv, modal) {
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];

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

        modalDiv.querySelectorAll('.btn-excluir').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                agendamentos.splice(index, 1);
                localStorage.setItem('agendamentosAdulto', JSON.stringify(agendamentos));
                atualizarListaHorariosDisponiveis();
                atualizarModalAgendamentos(modalDiv, modal);
            });
        });
    }

    // Exibir agendamentos
    btnVerAgendamentos.addEventListener('click', function() {
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

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);

        const modal = new bootstrap.Modal(modalDiv.querySelector('.modal'));
        atualizarModalAgendamentos(modalDiv, modal);
        modal.show();

        modalDiv.querySelector('.modal').addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modalDiv);
        });
    });

    languageSelectAdulto.addEventListener("change", function() {
        const lang = this.value;
        localStorage.setItem("langAdulto", lang);
        updateContentAdulto(lang);
        gerarCalendario(mesAtual, anoAtual);
        atualizarResumoAgendamento();
    });
});