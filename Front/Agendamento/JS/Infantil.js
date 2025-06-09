document.addEventListener('DOMContentLoaded', function() {
    // --- Traduções ---
    const translationsInfantil = {
        pt: {
            voltar: "Voltar", tituloPagina: "Agendamento Infantil", tipoAtendimento: "Atendimento selecionado: Infantil", profissionalEncontrada: "Profissional encontrada: Gabrielly", especialidade: "Especialista em: Atendimento Infantil", mesAnterior: "Mês anterior", proximoMes: "Próximo mês", domingo: "DOM", segunda: "SEG", terca: "TER", quarta: "QUA", quinta: "QUI", sexta: "SEX", sabado: "SAB", qualHorarioMelhor: "Qual o horário é melhor?", fusoHorario: "UTC -3 (Horário de Brasília)", resumoAgendamento: "Resumo do Agendamento:", dataSelecionada: "Data Selecionada:", horarioSelecionado: "Horário Selecionado:", confirmarAgendamento: "Confirmar Agendamento", meusAgendamentos: "Meus Agendamentos", mensagemErro: "Por favor, selecione um dia e um horário para agendar", agendamentoConfirmado: "Agendamento Confirmado!", consultaAgendadaSucesso: "Consulta agendada com sucesso!", detalhesAgendamento: "Sua consulta com <strong>{0}</strong> está marcada para: <strong>{1}</strong> às <strong>{2}</strong>", fecharModal: "Fechar", janeiro: "Janeiro", fevereiro: "Fevereiro", marco: "Março", abril: "Abril", maio: "Maio", junho: "Junho", julho: "Julho", agosto: "Agosto", setembro: "Setembro", outubro: "Outubro", novembro: "Novembro", dezembro: "Dezembro", tituloMeusAgendamentos: "Meus Agendamentos", semAgendamentos: "Nenhum agendamento encontrado.", semHorariosDisponiveis: "Não há horários disponíveis para este dia.", horarioAgendamento: "Horário:", profissionalAgendamento: "Profissional:", cancelarAgendamento: "Excluir", erroCarregarAgendamentos: "Não foi possível carregar os agendamentos.",
        },
        en: {
            voltar: "Back", tituloPagina: "Child Care Scheduling", tipoAtendimento: "Selected Service: Child Care", profissionalEncontrada: "Professional found: Gabrielly", especialidade: "Specialist in: Child Care", mesAnterior: "Previous month", proximoMes: "Next month", domingo: "SUN", segunda: "MON", terca: "TUE", quarta: "WED", quinta: "THU", sexta: "FRI", sabado: "SAT", qualHorarioMelhor: "What time works best?", fusoHorario: "UTC -3 (Brasilia Time)", resumoAgendamento: "Appointment Summary:", dataSelecionada: "Selected Date:", horarioSelecionado: "Selected Time:", confirmarAgendamento: "Confirm Appointment", meusAgendamentos: "My Appointments", mensagemErro: "Please select a day and time to schedule", agendamentoConfirmado: "Appointment Confirmed!", consultaAgendadaSucesso: "Appointment scheduled successfully!", detalhesAgendamento: "Your appointment with <strong>{0}</strong> is scheduled for: <strong>{1}</strong> at <strong>{2}</strong>", fecharModal: "Close", janeiro: "January", fevereiro: "February", marco: "March", abril: "April", maio: "May", junho: "June", julho: "July", agosto: "August", setembro: "September", outubro: "October", novembro: "November", dezembro: "December", tituloMeusAgendamentos: "My Appointments", semAgendamentos: "No appointments found.", semHorariosDisponiveis: "No available times for this day.", horarioAgendamento: "Time:", profissionalAgendamento: "Professional:", cancelarAgendamento: "Delete", erroCarregarAgendamentos: "Could not load appointments.",
        },
        es: {
            voltar: "Volver", tituloPagina: "Programación Infantil", tipoAtendimento: "Servicio seleccionado: Infantil", profissionalEncontrada: "Profesional encontrada: Gabrielly", especialidade: "Especialista en: Atención Infantil", mesAnterior: "Mes anterior", proximoMes: "Próximo mes", domingo: "DOM", segunda: "LUN", terca: "MAR", quarta: "MIÉ", quinta: "JUE", sexta: "VIE", sabado: "SÁB", qualHorarioMelhor: "¿Qué horario es mejor?", fusoHorario: "UTC -3 (Hora de Brasilia)", resumoAgendamento: "Resumen de la Cita:", dataSelecionada: "Fecha Seleccionada:", horarioSelecionado: "Hora Seleccionada:", confirmarAgendamento: "Confirmar Cita", meusAgendamentos: "Mis Citas", mensagemErro: "Por favor, seleccione un día y una hora para programar", agendamentoConfirmado: "¡Cita Confirmada!", consultaAgendadaSucesso: "¡Cita programada con éxito!", detalhesAgendamento: "Su cita con <strong>{0}</strong> está programada para: <strong>{1}</strong> a las <strong>{2}</strong>", fecharModal: "Cerrar", janeiro: "Enero", fevereiro: "Febrero", marco: "Marzo", abril: "Abril", maio: "Mayo", junho: "Junio", julho: "Julio", agosto: "Agosto", setembro: "Septiembre", outubro: "Octubre", novembro: "Noviembre", dezembro: "Diciembre", tituloMeusAgendamentos: "Mis Citas", semAgendamentos: "No se encontraron citas.", semHorariosDisponiveis: "No hay horarios disponibles para este día.", horarioAgendamento: "Hora:", profissionalAgendamento: "Profesional:", cancelarAgendamento: "Eliminar", erroCarregarAgendamentos: "No se pudieron cargar las citas.",
        }
    };
    
    // --- Variáveis de Estado ---
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    let dataSelecionada = null;
    let horarioSelecionado = null;
    let agendamentos = [];

    // --- Elementos DOM ---
    const btnAgendar = document.getElementById('btnAgendar');
    const btnVerAgendamentos = document.getElementById('btnVerAgendamentos');
    const mensagemErro = document.getElementById('mensagemErro');
    const resumoAgendamento = document.getElementById('resumo-agendamento');
    const dataSelecionadaElement = document.getElementById('data-selecionada');
    const horarioSelecionadoElement = document.getElementById('horario-selecionado');
    const modalConfirmacaoElement = document.getElementById('modalConfirmacao');
    const detalhesAgendamento = document.getElementById('detalhes-agendamento');
    const horariosContainer = document.getElementById('horarios-container'); 
    const languageSelectInfantil = document.getElementById("languageSelectInfantil");
    const modalConfirmacao = new bootstrap.Modal(modalConfirmacaoElement);
    
    // --- Funções Principais de API ---
    async function carregarDadosIniciais() {
        try {
            console.log("Buscando agendamentos do servidor...");
            const response = await axios.get('http://10.110.12.59:5500/consultas');
            agendamentos = response.data;
            console.log("Agendamentos carregados:", agendamentos);
            atualizarListaHorariosDisponiveis(); 
        } catch (error) {
            console.error("Erro ao carregar dados iniciais:", error);
            alert("Não foi possível conectar ao servidor para carregar os agendamentos.");
            agendamentos = [];
        }
    }
    
    btnAgendar.addEventListener('click', async function() {
        if (!dataSelecionada || !horarioSelecionado) {
            mensagemErro.classList.remove('d-none');
            return;
        }
        mensagemErro.classList.add('d-none');

        const payload = {
            data: dataSelecionada.toISOString(),
            horario: horarioSelecionado,
            profissional: "Gabrielly",
            tipoAtendimento: "Infantil"
        };

        try {
            console.log("Enviando novo agendamento:", payload);
            const response = await axios.post('http://10.110.12.59:5500/consultas', payload);
            const novoAgendamento = response.data;
            
            await carregarDadosIniciais(); // Recarrega todos os agendamentos para garantir consistência
            
            console.log("Agendamento criado com sucesso:", novoAgendamento);

            const lang = currentLang;
            const t = translationsInfantil[lang] || translationsInfantil['pt'] || {};
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const dataFormatada = new Date(novoAgendamento.data).toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang, options);
            
            detalhesAgendamento.innerHTML = t.detalhesAgendamento.replace("{0}", novoAgendamento.profissional).replace("{1}", dataFormatada).replace("{2}", novoAgendamento.horario);
            modalConfirmacao.show();

            // Reseta o formulário
            dataSelecionada = null;
            horarioSelecionado = null;
            document.querySelectorAll('.ativo').forEach(el => el.classList.remove('ativo'));
            btnAgendar.disabled = true;
            resumoAgendamento.classList.add('d-none');
            atualizarListaHorariosDisponiveis();

        } catch (error) {
            console.error('Erro ao enviar agendamento:', error);
            mensagemErro.textContent = 'Erro ao conectar com o servidor. O agendamento não foi realizado.';
            if (error.response) mensagemErro.textContent += ` (Erro: ${error.response.status})`;
            mensagemErro.classList.remove('d-none');
        }
    });

    async function showAgendamentosModal() {
        const lang = currentLang;
        const t = translationsInfantil[lang] || translationsInfantil['pt'] || {};

        const modalId = 'modalMeusAgendamentos';
        document.getElementById(modalId)?.remove();
        
        const modalDiv = document.createElement('div');
        modalDiv.id = modalId;
        modalDiv.innerHTML = `<div class="modal fade" tabindex="-1"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">${t.tituloMeusAgendamentos}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><div class="agendamentos-lista-container">Carregando...</div></div></div></div></div>`;
        document.body.appendChild(modalDiv);
        const modalElement = modalDiv.querySelector('.modal');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
        const listaContainer = modalDiv.querySelector('.agendamentos-lista-container');

        try {
            const response = await axios.get('http://10.110.12.59:5500/consultas');
            const agendamentosServidor = response.data;
            
            if (agendamentosServidor.length === 0) {
                listaContainer.innerHTML = `<p>${t.semAgendamentos}</p>`;
                return;
            }

            listaContainer.innerHTML = agendamentosServidor.map(ag => {
                const dataObj = new Date(ag.data);
                const dataFormatada = dataObj.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                return `<div class="agendamento-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded"><div><strong>${dataFormatada}</strong><br><small>⏰ ${ag.horario} - ${t.profissionalAgendamento} ${ag.profissional}</small></div><button class="btn btn-danger btn-sm btn-excluir" data-id="${ag.id}"><i class="bi bi-trash"></i> ${t.cancelarAgendamento}</button></div>`;
            }).join('');
            
            listaContainer.querySelectorAll('.btn-excluir').forEach(button => {
                button.addEventListener('click', async function() {
                    const idParaExcluir = this.getAttribute('data-id');
                    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
                        try {
                            await axios.delete(`http://10.110.12.59:5500/consultas/${idParaExcluir}`);
                            alert("Agendamento excluído com sucesso!");
                            modalInstance.hide();
                            await carregarDadosIniciais();
                            showAgendamentosModal();
                        } catch (error) {
                            console.error("Erro ao excluir agendamento:", error);
                            alert("Não foi possível excluir o agendamento.");
                        }
                    }
                });
            });
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
            listaContainer.innerHTML = `<p class="text-danger">${t.erroCarregarAgendamentos}</p>`;
        }
    }
    btnVerAgendamentos.addEventListener('click', showAgendamentosModal);

    // --- Funções de UI (Calendário, Horários, Traduções) ---
    let currentLang = 'pt';
    
    function updateContentInfantil(lang) {
        currentLang = lang;
        const t = translationsInfantil[lang] || translationsInfantil['pt'] || {};
        document.title = t.tituloPagina;
        const elements = { '#tipoAtendimento': t.tipoAtendimento, '#profissionalEncontrada': t.profissionalEncontrada, '#especialidade': t.especialidade, '#anterior': { attr: 'aria-label', value: t.mesAnterior }, '#proximo': { attr: 'aria-label', value: t.proximoMes }, '#voltar .btn-text': t.voltar, '#domingo': t.domingo, '#segunda': t.segunda, '#terca': t.terca, '#quarta': t.quarta, '#quinta': t.quinta, '#sexta': t.sexta, '#sabado': t.sabado, '#qualHorarioMelhor': t.qualHorarioMelhor, '#fusoHorario': t.fusoHorario, '#resumoAgendamento': t.resumoAgendamento, '#confirmarAgendamento': t.confirmarAgendamento, '#meusAgendamentos': t.meusAgendamentos, '#mensagemErro': t.mensagemErro, '#agendamentoConfirmado': t.agendamentoConfirmado, '#consultaAgendadaSucesso': t.consultaAgendadaSucesso, '#fecharModal': t.fecharModal };
        for (const selector in elements) {
            const el = document.querySelector(selector);
            if (el) {
                if (typeof elements[selector] === 'object') el.setAttribute(elements[selector].attr, elements[selector].value);
                else el.textContent = elements[selector];
            }
        }
        gerarCalendario(mesAtual, anoAtual);
    }

    languageSelectInfantil.addEventListener("change", function() { updateContentInfantil(this.value); });

    function gerarCalendario(mes, ano) {
        const diasContainer = document.getElementById('dias');
        const tituloMes = document.getElementById('mes');
        diasContainer.innerHTML = '';
        const primeiroDia = new Date(ano, mes, 1).getDay();
        const totalDias = new Date(ano, mes + 1, 0).getDate();
        const hoje = new Date();
        const t = translationsInfantil[currentLang] || translationsInfantil['pt'];
        const monthNames = [t.janeiro, t.fevereiro, t.marco, t.abril, t.maio, t.junho, t.julho, t.agosto, t.setembro, t.outubro, t.novembro, t.dezembro];
        tituloMes.textContent = `${monthNames[mes]} ${ano}`;
        for (let i = 0; i < primeiroDia; i++) diasContainer.appendChild(document.createElement('div'));
        for (let dia = 1; dia <= totalDias; dia++) {
            const botao = document.createElement('button');
            botao.textContent = dia;
            const dataAtual = new Date(ano, mes, dia);
            if (dataAtual < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) botao.disabled = true;
            botao.addEventListener('click', () => selecionarDia(botao, ano, mes, dia));
            diasContainer.appendChild(botao);
        }
    }

    function selecionarDia(botao, ano, mes, dia) {
        document.querySelectorAll('.dias button.ativo').forEach(btn => btn.classList.remove('ativo'));
        botao.classList.add('ativo');
        dataSelecionada = new Date(ano, mes, dia);
        horarioSelecionado = null;
        atualizarListaHorariosDisponiveis();
        atualizarResumoAgendamento();
        verificarSelecaoCompleta();
    }
    
    function configurarHorarios() {
        horariosContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('horario-btn') && !e.target.disabled) {
                document.querySelectorAll('.horario-btn.ativo').forEach(btn => btn.classList.remove('ativo'));
                e.target.classList.add('ativo');
                horarioSelecionado = e.target.textContent;
                atualizarResumoAgendamento();
                verificarSelecaoCompleta();
            }
        });
    }

    // =======================================================================================
    // FUNÇÃO CORRIGIDA
    // =======================================================================================
    function atualizarListaHorariosDisponiveis() {
        const todosHorarios = ['10:00', '11:30', '14:30', '16:00', '17:30', '19:00'];
        horariosContainer.innerHTML = '';

        let horariosAgendados = [];

        // Se uma data estiver selecionada, filtre os horários agendados para essa data
        if (dataSelecionada) {
            // Compara as datas ignorando a parte do tempo e fuso horário
            const diaSelecionadoStr = dataSelecionada.toLocaleDateString('pt-BR');
            horariosAgendados = agendamentos
                .filter(ag => {
                    const diaAgendamentoStr = new Date(ag.data).toLocaleDateString('pt-BR');
                    return diaAgendamentoStr === diaSelecionadoStr;
                })
                .map(ag => ag.horario);
        }
        
        // Renderiza TODOS os botões de horário
        todosHorarios.forEach(horario => {
            const botao = document.createElement('button');
            botao.className = 'btn horario-btn';
            botao.textContent = horario;

            // Desabilita o botão se não houver data selecionada OU se o horário já estiver agendado
            if (!dataSelecionada || horariosAgendados.includes(horario)) {
                botao.disabled = true;
            }
            
            horariosContainer.appendChild(botao);
        });
    }

    function configurarBotoesNavegacao() {
        document.getElementById('anterior').addEventListener('click', () => {
            if (--mesAtual < 0) { mesAtual = 11; anoAtual--; }
            gerarCalendario(mesAtual, anoAtual);
        });
        document.getElementById('proximo').addEventListener('click', () => {
            if (++mesAtual > 11) { mesAtual = 0; anoAtual++; }
            gerarCalendario(mesAtual, anoAtual);
        });
    }

    function atualizarResumoAgendamento() {
        const t = translationsInfantil[currentLang] || translationsInfantil['pt'];
        if (dataSelecionada) {
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            const dataFormatada = dataSelecionada.toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : currentLang, options);
            dataSelecionadaElement.textContent = `📅 ${t.dataSelecionada} ${dataFormatada}`;
            resumoAgendamento.classList.remove('d-none');
        } else {
            resumoAgendamento.classList.add('d-none');
        }
        horarioSelecionadoElement.textContent = horarioSelecionado ? `⏰ ${t.horarioSelecionado} ${horarioSelecionado}` : '';
    }

    function verificarSelecaoCompleta() {
        btnAgendar.disabled = !(dataSelecionada && horarioSelecionado);
        if (dataSelecionada && horarioSelecionado) mensagemErro.classList.add('d-none');
    }

    async function inicializar() {
        updateContentInfantil(languageSelectInfantil.value);
        await carregarDadosIniciais();
        gerarCalendario(mesAtual, anoAtual);
        configurarHorarios();
        atualizarListaHorariosDisponiveis(); // Mostra os horários desabilitados no início
        configurarBotoesNavegacao();
    }

    inicializar();
});