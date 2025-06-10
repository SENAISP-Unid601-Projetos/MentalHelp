import { getTranslations, updatePageContent, setupMyAppointmentsModal } from './translateGeral.js';

document.addEventListener('DOMContentLoaded', function() {
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    let dataSelecionada = null;
    let horarioSelecionado = null;
    let agendamentos = JSON.parse(localStorage.getItem('agendamentosAdulto')) || [];

    const languageSelectAdulto = document.getElementById("languageSelectAdulto");
    const btnAgendar = document.getElementById('btnAgendar');
    const mensagemErro = document.getElementById('mensagemErro');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');
    const diasContainer = document.getElementById('dias');
    const tituloMes = document.getElementById('mes');
    const btnMesAnterior = document.getElementById('anterior');
    const btnProximoMes = document.getElementById('proximo');
    const botoesHorario = document.querySelectorAll('.horario-btn');
    const horariosContainer = document.querySelector('.horarios');

    const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    function inicializar() {
        const savedLang = localStorage.getItem("langAdulto") || 'pt';
        if (languageSelectAdulto) {
            languageSelectAdulto.value = savedLang;
            languageSelectAdulto.addEventListener("change", function() {
                const lang = this.value;
                localStorage.setItem("langAdulto", lang);
                updatePageContent(lang, getFormattedSelectionForTranslation());
                gerarCalendario(mesAtual, anoAtual);
                atualizarResumoAgendamento();
            });
        }
        
        updatePageContent(savedLang, getFormattedSelectionForTranslation());
        gerarCalendario(mesAtual, anoAtual);
        configurarHorarios();
        configurarBotoesNavegacao();
        atualizarListaHorariosDisponiveis();
        verificarSelecaoCompleta();
        setupMyAppointmentsModal(agendamentos);

        document.addEventListener('agendamentosAtualizados', () => {
            agendamentos = JSON.parse(localStorage.getItem('agendamentosAdulto')) || [];
            atualizarListaHorariosDisponiveis();
        });
    }

    function gerarCalendario(mes, ano) {
        diasContainer.innerHTML = '';
        const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
        const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate();
        const hoje = new Date();
        const dataDeHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = getTranslations(lang);
        const translatedMonthNames = [
            t.janeiro, t.fevereiro, t.marco, t.abril, t.maio, t.junho,
            t.julho, t.agosto, t.setembro, t.outubro, t.novembro, t.dezembro
        ];
        tituloMes.textContent = `${translatedMonthNames[mes]} ${ano}`;

        for (let i = 0; i < primeiroDiaDoMes; i++) {
            diasContainer.appendChild(document.createElement('div'));
        }

        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const botao = document.createElement('button');
            botao.textContent = dia;
            botao.tabIndex = 0;

            const dataAtual = new Date(ano, mes, dia);

            if (dataAtual < dataDeHoje) {
                botao.disabled = true;
                botao.classList.add('text-muted');
            }

            if (dataSelecionada && dataAtual.toDateString() === dataSelecionada.toDateString()) {
                botao.classList.add('ativo');
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

    function configurarHorarios() {
        horariosContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('horario-btn')) {
                selecionarHorario(e.target);
            }
        });
    }

    function selecionarHorario(botao) {
        document.querySelectorAll('.horario-btn').forEach(btn => {
            btn.classList.remove('ativo');
        });

        botao.classList.add('ativo');
        horarioSelecionado = botao.textContent;
        atualizarResumoAgendamento();
        verificarSelecaoCompleta();
    }

    function atualizarListaHorariosDisponiveis() {
        const todosHorarios = ['10:00', '11:30', '14:30', '16:00', '17:30', '19:00'];
        let horariosAgendados = [];

        agendamentos = JSON.parse(localStorage.getItem('agendamentosAdulto')) || [];

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

    function configurarBotoesNavegacao() {
        btnMesAnterior.addEventListener('click', () => {
            mesAtual--;
            if (mesAtual < 0) {
                mesAtual = 11;
                anoAtual--;
            }
            gerarCalendario(mesAtual, anoAtual);
            resetarSelecoesAposMudancaDeMes();
        });

        btnProximoMes.addEventListener('click', () => {
            mesAtual++;
            if (mesAtual > 11) {
                mesAtual = 0;
                anoAtual++;
            }
            gerarCalendario(mesAtual, anoAtual);
            resetarSelecoesAposMudancaDeMes();
        });
    }

    function resetarSelecoesAposMudancaDeMes() {
        dataSelecionada = null;
        horarioSelecionado = null;
        document.querySelectorAll('.dias button.ativo').forEach(btn => btn.classList.remove('ativo'));
        document.querySelectorAll('.horario-btn.ativo').forEach(btn => btn.classList.remove('ativo'));
        atualizarResumoAgendamento();
        atualizarListaHorariosDisponiveis();
        verificarSelecaoCompleta();
    }

    function getFormattedSelectionForTranslation() {
        const lang = localStorage.getItem('langAdulto') || 'pt';
        let formattedDate = null;
        if (dataSelecionada) {
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            formattedDate = {
                date: dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', options),
                fullDate: dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            };
        }
        return {
            dataSelecionadaFormatada: formattedDate,
            horarioSelecionadoString: horarioSelecionado
        };
    }

    function atualizarResumoAgendamento() {
        const { dataSelecionadaFormatada, horarioSelecionadoString } = getFormattedSelectionForTranslation();
        updatePageContent(localStorage.getItem('langAdulto') || 'pt', { dataSelecionadaFormatada, horarioSelecionadoString });
    }

    function verificarSelecaoCompleta() {
        if (dataSelecionada && horarioSelecionado) {
            btnAgendar.disabled = false;
            mensagemErro.classList.add('d-none');
        } else {
            btnAgendar.disabled = true;
        }
    }

    btnAgendar.addEventListener('click', async function() {
        if (!dataSelecionada || !horarioSelecionado) {
            const t = getTranslations(localStorage.getItem('langAdulto') || 'pt');
            mensagemErro.textContent = t.selecioneDiaHorario;
            mensagemErro.classList.remove('d-none');
            return;
        }

        const [horas, minutos] = horarioSelecionado.split(':').map(Number);

        const dataEHoraCombinadas = new Date(
            dataSelecionada.getFullYear(),
            dataSelecionada.getMonth(),
            dataSelecionada.getDate(),
            horas,
            minutos
        );

        const t = getTranslations(localStorage.getItem('langAdulto') || 'pt');
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dataFormatada = dataEHoraCombinadas.toLocaleDateString(localStorage.getItem('langAdulto') === 'pt' ? 'pt-BR' : localStorage.getItem('langAdulto') === 'en' ? 'en-US' : 'es-ES', options);

        detalhesAgendamento.innerHTML = t.detalhesAgendamento
            .replace("{0}", "Vagner")
            .replace("{1}", dataFormatada)
            .replace("{2}", horarioSelecionado);

        const dadosConsulta = {
            data: dataEHoraCombinadas.toISOString(),
            valorConsulta: 100,
            tipoConsulta: "ADULTO",
            idPaciente: 1,
            idProfissional: 1
        };

        try {
            const response = await axios.post('http://192.168.56.1:8080/consultas/post', dadosConsulta);

            if (response.status === 200 || response.status === 201) {
                const novoAgendamento = {
                    data: dataEHoraCombinadas.toISOString(),
                    horario: horarioSelecionado,
                    profissional: "Vagner"
                };
                agendamentos.push(novoAgendamento);
                localStorage.setItem('agendamentosAdulto', JSON.stringify(agendamentos));

                modalConfirmacao.show();

                dataSelecionada = null;
                horarioSelecionado = null;
                document.querySelectorAll('.ativo').forEach(el => el.classList.remove('ativo'));
                btnAgendar.disabled = true;
                resumoAgendamento.classList.add('d-none');
                gerarCalendario(mesAtual, anoAtual);
                atualizarListaHorariosDisponiveis();
                verificarSelecaoCompleta();
            } else {
                mensagemErro.classList.remove('d-none');
                mensagemErro.textContent = `${t.erroAgendamento}: ${response.data.message || 'Ocorreu um erro desconhecido.'}`;
            }

        } catch (error) {
            mensagemErro.classList.remove('d-none');
            if (error.response) {
                mensagemErro.textContent = `${t.erroServidor} ${error.response.data.message || 'Falha no agendamento.'}`;
            } else if (error.request) {
                mensagemErro.textContent = `${t.semResposta} Verifique sua conexão ou tente mais tarde.`;
            } else {
                mensagemErro.textContent = `${t.erroConfig} Erro inesperado ao preparar o agendamento.`;
            }
        }
    });

    inicializar();
});