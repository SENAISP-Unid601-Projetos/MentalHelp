document.addEventListener('DOMContentLoaded', function() {
    // Variáveis de estado
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    let dataSelecionada = null;
    let horarioSelecionado = null;
    let agendamentos = [];
    let modalAgendamentosInstance = null; // Para armazenar a instância do modal de agendamentos

    // --- Traduções (Movidas de translateEspecial.js) ---
    const translationsEspecial = {
        pt: {
            voltar: "Voltar",
            tituloPagina: "Agendamento",
            tipoAtendimento: "Atendimento selecionado: Especial",
            agendeReuniao: "Agende reunião com Mykael",
            especialidade: "Especialista em: Atendimento Especial",
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
            meusAgendamentos: "Meus Agendamentos",
            mensagemErro: "Por favor, selecione um dia e um horário para agendar",
            agendamentoConfirmado: "Agendamento Confirmado!",
            consultaAgendadaSucesso: "Consulta agendada com sucesso!",
            detalhesAgendamento: "Sua consulta com <strong>{0}</strong> está marcada para: <strong>{1}</strong>, 27 de maio de 2025 às <strong>{2}</strong>",
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
            horarioAgendamento: "Horário:",
            profissionalAgendamento: "Profissional:",
            cancelarAgendamento: "Excluir"
        },
        en: {
            voltar: "Back",
            tituloPagina: "Scheduling",
            tipoAtendimento: "Selected Service: Special",
            agendeReuniao: "Schedule meeting with Mykael",
            especialidade: "Specialist in: Special Care",
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
            meusAgendamentos: "My Appointments",
            mensagemErro: "Please select a day and time to schedule",
            agendamentoConfirmado: "Appointment Confirmed!",
            consultaAgendadaSucesso: "Appointment scheduled successfully!",
            detalhesAgendamento: "Your appointment with <strong>{0}</strong> is scheduled for: <strong>{1}</strong>, May 27, 2025 at <strong>{2}</strong>",
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
            horarioAgendamento: "Time:",
            profissionalAgendamento: "Professional:",
            cancelarAgendamento: "Delete"
        },
        es: {
            voltar: "Volver",
            tituloPagina: "Programación",
            tipoAtendimento: "Servicio seleccionado: Especial",
            agendeReuniao: "Agendar una reunión con Mykael",
            especialidade: "Especialista en: Atención Especial",
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
            meusAgendamentos: "Mis Citas",
            mensagemErro: "Por favor, seleccione un día y una hora para programar",
            agendamentoConfirmado: "¡Cita Confirmada!",
            consultaAgendadaSucesso: "¡Cita programada con éxito!",
            detalhesAgendamento: "Su cita con <strong>{0}</strong> está programada para: <strong>{1}</strong>, 27 de mayo de 2025 a las <strong>{2}</strong>",
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
            horarioAgendamento: "Hora:",
            profissionalAgendamento: "Profesional:",
            cancelarAgendamento: "Eliminar"
        }
    };
    // --- Fim das Traduções ---

    // Tratamento de erro para localStorage
    try {
        agendamentos = JSON.parse(localStorage.getItem('agendamentosEspecial')) || [];
    } catch (e) {
        console.error('Erro ao carregar agendamentos:', e);
    }

    // Elementos DOM
    const btnAgendar = document.getElementById('btnAgendar');
    const btnVerAgendamentos = document.getElementById('btnVerAgendamentos');
    const mensagemErro = document.getElementById('mensagemErro');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const modalConfirmacaoElement = document.getElementById('modalConfirmacao');
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');
    const horariosContainer = document.querySelector('.horarios');
    const languageSelectEspecial = document.getElementById("languageSelectEspecial");

    // Validação de elementos DOM
    if (!btnAgendar || !btnVerAgendamentos || !mensagemErro || !resumoAgendamento ||
        !dataSelecionadaElement || !horarioSelecionadoElement || !modalConfirmacaoElement ||
        !detalhesAgendamento || !horariosContainer || !languageSelectEspecial) {
        console.error('Um ou mais elementos DOM não foram encontrados.');
        return;
    }

    const modalConfirmacao = new bootstrap.Modal(modalConfirmacaoElement);

    // Inicialização
    let currentLang = localStorage.getItem("langEspecial") || 'pt';
    languageSelectEspecial.value = currentLang;
    updateContentEspecial(currentLang); // Chamada inicial para traduzir a página
    gerarCalendario(mesAtual, anoAtual);
    configurarHorarios();
    configurarBotoesNavegacao();
    atualizarListaHorariosDisponiveis();

    // Event listener para mudança de idioma
    languageSelectEspecial.addEventListener("change", function() {
        currentLang = this.value;
        localStorage.setItem("langEspecial", currentLang);
        updateContentEspecial(currentLang);
        gerarCalendario(mesAtual, anoAtual); // Recarrega o calendário para traduzir o nome do mês
        atualizarResumoAgendamento(); // Atualiza o resumo de agendamento com o novo idioma
        if (modalAgendamentosInstance && modalAgendamentosInstance._isShown) {
            // Se o modal de agendamentos estiver aberto, atualize-o
            // Primeiro, removemos e recriamos o modal para garantir a tradução de todos os elementos internos
            const existingModalDiv = document.getElementById('modalAgendamentosContainer');
            if (existingModalDiv) {
                document.body.removeChild(existingModalDiv);
                modalAgendamentosInstance = null; // Reinicia a instância
            }
            // Chama a função para criar e mostrar o modal novamente, que já virá traduzido
            showAgendamentosModal();
        }
    });

    function updateContentEspecial(lang) {
        const t = translationsEspecial[lang] || translationsEspecial['pt'] || {};

        // Atualizar título da página e elementos principais
        document.title = t.tituloPagina || 'Agendamento';
        const tipoAtendimento = document.querySelector(".tipo-atendimento");
        if (tipoAtendimento) tipoAtendimento.textContent = t.tipoAtendimento || 'Atendimento selecionado: Especial';
        const reuniao = document.querySelector(".reunião");
        if (reuniao) reuniao.textContent = t.agendeReuniao || 'Agende reunião com Mykael';
        const especialidade = document.querySelector(".especialidade");
        if (especialidade) especialidade.textContent = t.especialidade || 'Especialista em: Atendimento Especial';
        const anterior = document.getElementById("anterior");
        if (anterior) anterior.setAttribute('aria-label', t.mesAnterior || 'Mês anterior');
        const proximo = document.getElementById("proximo");
        if (proximo) proximo.setAttribute('aria-label', t.proximoMes || 'Próximo mês');
        const voltar = document.getElementById("voltar");
        if (voltar) {
            const spanText = voltar.querySelector(".btn-text");
            if (spanText) spanText.textContent = t.voltar || 'Voltar';
        }

        // Atualizar dias da semana
        const diasSemana = document.querySelectorAll(".dias-semana span");
        if (diasSemana.length === 7) {
            diasSemana[0].textContent = t.domingo || 'DOM';
            diasSemana[1].textContent = t.segunda || 'SEG';
            diasSemana[2].textContent = t.terca || 'TER';
            diasSemana[3].textContent = t.quarta || 'QUA';
            diasSemana[4].textContent = t.quinta || 'QUI';
            diasSemana[5].textContent = t.sexta || 'SEX';
            diasSemana[6].textContent = t.sabado || 'SAB';
        }

        // Atualizar elementos do painel direito
        const qualHorarioMelhor = document.getElementById("qualHorarioMelhor");
        if (qualHorarioMelhor) qualHorarioMelhor.textContent = t.qualHorarioMelhor || 'Qual o horário é melhor?';
        const fusoHorario = document.getElementById("fusoHorario");
        if (fusoHorario) fusoHorario.textContent = t.fusoHorario || 'UTC -3 (Horário de Brasília)';

        // Atualizar resumo do agendamento
        const resumoAgendamentoTexto = document.getElementById("resumoAgendamentoTexto");
        if (resumoAgendamentoTexto) resumoAgendamentoTexto.textContent = t.resumoAgendamento || 'Resumo do Agendamento:';

        // Atualizar botões
        const confirmarAgendamentoTexto = document.getElementById("confirmarAgendamentoTexto");
        if (confirmarAgendamentoTexto) confirmarAgendamentoTexto.textContent = t.confirmarAgendamento || 'Confirmar Agendamento';

        const btnVerAgendamentosText = btnVerAgendamentos.querySelector(".btn-text");
        if (btnVerAgendamentosText) btnVerAgendamentosText.textContent = t.meusAgendamentos || 'Meus Agendamentos';

        // Atualizar mensagem de erro
        if (mensagemErro) mensagemErro.textContent = t.mensagemErro || 'Por favor, selecione um dia e um horário para agendar';

        // Atualizar modal de confirmação
        const agendamentoConfirmadoTexto = document.getElementById("agendamentoConfirmadoTexto");
        if (agendamentoConfirmadoTexto) agendamentoConfirmadoTexto.textContent = t.agendamentoConfirmado || 'Agendamento Confirmado!';
        const consultaAgendadaSucessoTexto = document.getElementById("consultaAgendadaSucessoTexto");
        if (consultaAgendadaSucessoTexto) consultaAgendadaSucessoTexto.textContent = t.consultaAgendadaSucesso || 'Consulta agendada com sucesso!';
        const fecharModalBotao = document.getElementById("fecharModalBotao");
        if (fecharModalBotao) fecharModalBotao.textContent = t.fecharModal || 'Fechar';
    }

    // Função principal para gerar o calendário
    function gerarCalendario(mes, ano) {
        const diasContainer = document.getElementById('dias');
        const tituloMes = document.getElementById('mes');
        if (!diasContainer || !tituloMes) return;

        diasContainer.innerHTML = '';

        const primeiroDia = new Date(ano, mes, 1).getDay();
        const totalDias = new Date(ano, mes + 1, 0).getDate();
        const hoje = new Date();

        // Usar traduções para o nome do mês
        const lang = localStorage.getItem('langEspecial') || 'pt';
        const t = translationsEspecial[lang] || translationsEspecial['pt'] || {};
        const monthNames = [
            t.janeiro || 'Janeiro', t.fevereiro || 'Fevereiro', t.marco || 'Março',
            t.abril || 'Abril', t.maio || 'Maio', t.junho || 'Junho',
            t.julho || 'Julho', t.agosto || 'Agosto', t.setembro || 'Setembro',
            t.outubro || 'Outubro', t.novembro || 'Novembro', t.dezembro || 'Dezembro'
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
            botao.setAttribute('aria-label', `${t.dataSelecionada || 'Selecionar dia'} ${dia} ${monthNames[mes]} ${ano}`);

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
        const btnAnterior = document.getElementById('anterior');
        const btnProximo = document.getElementById('proximo');
        if (!btnAnterior || !btnProximo) return;

        btnAnterior.addEventListener('click', () => {
            mesAtual--;
            if (mesAtual < 0) {
                mesAtual = 11;
                anoAtual--;
            }
            gerarCalendario(mesAtual, anoAtual);
        });

        btnProximo.addEventListener('click', () => {
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
        const lang = localStorage.getItem('langEspecial') || 'pt';
        const t = translationsEspecial[lang] || translationsEspecial['pt'] || {};

        if (dataSelecionada) {
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            const dataFormatada = dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', options);
            dataSelecionadaElement.textContent = `📅 ${t.dataSelecionada || 'Data Selecionada:'} ${dataFormatada}`;
            resumoAgendamento.classList.remove('d-none');
        } else {
            resumoAgendamento.classList.add('d-none');
        }

        if (horarioSelecionado) {
            horarioSelecionadoElement.textContent = `⏰ ${t.horarioSelecionado || 'Horário Selecionado:'} ${horarioSelecionado}`;
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
            const lang = localStorage.getItem('langEspecial') || 'pt';
            const t = translationsEspecial[lang] || translationsEspecial['pt'] || {};
            mensagemErro.textContent = t.mensagemErro || 'Por favor, selecione um dia e um horário para agendar';
            mensagemErro.classList.remove('d-none');
            return;
        }

        // Adicionar aos agendamentos
        const novoAgendamento = {
            data: new Date(dataSelecionada),
            horario: horarioSelecionado,
            profissional: "Mykael"
        };
        agendamentos.push(novoAgendamento);
        localStorage.setItem('agendamentosEspecial', JSON.stringify(agendamentos));

        const lang = localStorage.getItem('langEspecial') || 'pt';
        const t = translationsEspecial[lang] || translationsEspecial['pt'] || {};
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dataFormatadaCompleta = dataSelecionada.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', options);
        // O 'a', 'b', 'c' parecem ser variáveis globais em outro script.
        // Se eles forem para o modal de confirmação, é melhor passá-los diretamente.
        // Se 'detalhesAgendamento' está no HTML, atualize-o diretamente.
        
        detalhesAgendamento.innerHTML = t.detalhesAgendamento
            .replace("{0}", "Mykael")
            .replace("{1}", dataFormatadaCompleta)
            .replace("{2}", horarioSelecionado);
        modalConfirmacao.show();

        // Resetar seleções
        dataSelecionada = null;
        horarioSelecionado = null;
        document.querySelectorAll('.ativo').forEach(el => el.classList.remove('ativo'));
        btnAgendar.disabled = true;
        resumoAgendamento.classList.add('d-none');
        atualizarListaHorariosDisponiveis();
    });

    // Função auxiliar para atualizar o conteúdo do modal de agendamentos
    function atualizarModalAgendamentos(modalElement) {
        const lang = localStorage.getItem('langEspecial') || 'pt';
        const t = translationsEspecial[lang] || translationsEspecial['pt'] || {};

        const agendamentosLista = modalElement.querySelector('.agendamentos-lista');
        if (!agendamentosLista) return;

        agendamentosLista.innerHTML = agendamentos.length === 0
            ? `<p>${t.semAgendamentos || 'Nenhum agendamento encontrado.'}</p>`
            : agendamentos.map((ag, index) => {
                const dataObj = new Date(ag.data);
                const dataFormatada = dataObj.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', {
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
                                ⏰ ${t.horarioAgendamento || 'Horário:'} ${ag.horario} - ${t.profissionalAgendamento || 'Profissional:'} ${ag.profissional}
                            </div>
                            <button class="btn btn-danger btn-sm btn-excluir" data-index="${index}">
                                <i class="bi bi-trash"></i> ${t.cancelarAgendamento || 'Excluir'}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

        // Adicionar eventos de exclusão
        modalElement.querySelectorAll('.btn-excluir').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                agendamentos.splice(index, 1);
                localStorage.setItem('agendamentosEspecial', JSON.stringify(agendamentos));
                atualizarListaHorariosDisponiveis();
                atualizarModalAgendamentos(modalElement); // Atualiza o conteúdo do modal aberto
            });
        });
    }

    // Função para mostrar o modal de agendamentos (reutilizável)
    function showAgendamentosModal() {
        const lang = localStorage.getItem('langEspecial') || 'pt';
        const t = translationsEspecial[lang] || translationsEspecial['pt'] || {};

        // Remove o modal existente se houver
        const existingModalDiv = document.getElementById('modalAgendamentosContainer');
        if (existingModalDiv) {
            existingModalDiv.remove();
        }

        const modalDiv = document.createElement('div');
        modalDiv.id = 'modalAgendamentosContainer'; // Adiciona um ID para fácil referência
        modalDiv.innerHTML = `
            <div class="modal fade" id="modalAgendamentos" tabindex="-1" aria-labelledby="modalAgendamentosLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalAgendamentosLabel">${t.tituloMeusAgendamentos || 'Meus Agendamentos'}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${t.fecharModal || 'Fechar'}"></button>
                        </div>
                        <div class="modal-body">
                            <div class="agendamentos-lista"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${t.fecharModal || 'Fechar'}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalDiv);

        const modalElement = modalDiv.querySelector('.modal');
        modalAgendamentosInstance = new bootstrap.Modal(modalElement);
        
        atualizarModalAgendamentos(modalElement); // Preenche e traduz o conteúdo da lista de agendamentos
        modalAgendamentosInstance.show();

        // Remove o modal do DOM quando fechado
        modalElement.addEventListener('hidden.bs.modal', function() {
            modalDiv.remove(); // Remove o container do modal
            modalAgendamentosInstance = null; // Limpa a instância
        });
    }

    // Exibir agendamentos - o evento agora chama a função showAgendamentosModal
    btnVerAgendamentos.addEventListener('click', showAgendamentosModal);
});