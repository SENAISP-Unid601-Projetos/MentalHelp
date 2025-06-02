document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const elements = {
        inicio: document.getElementById('dataInicio'),
        fim: document.getElementById('dataFim'),
        filtrar: document.getElementById('filtrar'),
        mostrar: document.getElementById('mostrar-calendario'),
        modal: new bootstrap.Modal(document.getElementById('modal-calendario')),
        fechar: document.getElementById('fechar-modal'),
        aplicar: document.getElementById('aplicar-periodo'),
        cancelar: document.getElementById('cancelar-periodo'),
        limpar: document.getElementById('limpar-periodo'),
        month: document.getElementById('current-month'),
        grid: document.getElementById('calendar-grid'),
        prev: document.getElementById('prev-month'),
        next: document.getElementById('next-month'),
        periodo: document.getElementById('periodo-selecionado'),
        date: document.getElementById('current-date'),
        relatoriosBtn: document.getElementById('relatorios-btn'),
        agendaBtn: document.getElementById('agenda-btn'),
        relatoriosPanel: document.getElementById('relatorios-panel'),
        fecharRelatorios: document.getElementById('fechar-relatorios'),
        relatorioConsultas: document.getElementById('relatorio-consultas'),
        relatorioPacientes: document.getElementById('relatorio-pacientes'),
        relatorioProcedimentos: document.getElementById('relatorio-procedimentos'),
        errorMessage: document.getElementById('error-message')
    };

    // Estado inicial
    let currentMonth = new Date(2025, 5, 2).getMonth(); // 02/06/2025
    let currentYear = new Date(2025, 5, 2).getFullYear();
    let selectedStartDate = new Date(2025, 5, 2); // Início padrão
    let selectedEndDate = new Date(2025, 5, 2); // Fim padrão
    let tempStartDate = null;
    let tempEndDate = null;
    let calendar = null;

    // Dados
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // Funções auxiliares
    function formatDate(date) {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function parseDateInput(dateString) {
        if (!dateString) return null;
        const parts = dateString.split('-');
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    function formatDateISO(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    function showError(message) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.classList.remove('d-none');
        setTimeout(() => {
            elements.errorMessage.classList.add('d-none');
        }, 5000);
    }

    // Inicialização
    function init() {
        const today = new Date(2025, 5, 2, 15, 42); // 02/06/2025, 15:42 -03
        elements.date.textContent = formatDate(today);
        elements.inicio.valueAsDate = today;
        elements.fim.valueAsDate = today;
        
        initCalendar();
        renderCalendar();
    }

    // Inicializa o calendário principal
    async function initCalendar() {
        try {
            const calendarEl = document.getElementById('calendario');
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
                initialDate: '2025-06-02', // Força o calendário a iniciar em 02/06/2025
                locale: 'pt-br',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                buttonText: {
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia'
                },
                slotMinTime: '00:00:00', // Ajustado para exibir o dia inteiro
                slotMaxTime: '24:00:00', // Ajustado para exibir o dia inteiro
                events: async function(fetchInfo, successCallback, failureCallback) {
                    try {
                        const events = await fetchEvents(fetchInfo.startStr, fetchInfo.endStr);
                        console.log('Eventos enviados ao FullCalendar (inicial):', events);
                        if (events.length === 0) {
                            showError('Nenhuma consulta encontrada para o período inicial.');
                        }
                        successCallback(events);
                    } catch (err) {
                        failureCallback(err);
                        showError('Erro ao carregar consultas do servidor.');
                    }
                },
                eventClick: function(info) {
                    showError(`Consulta: ${info.event.title}\nInício: ${info.event.start.toISOString()}\nFim: ${info.event.end ? info.event.end.toISOString() : 'Não definido'}`);
                },
                height: 'auto',
                allDaySlot: false // Garante que o calendário exiba apenas horários
            });
            calendar.render();
        } catch (err) {
            console.error('Erro na inicialização do FullCalendar:', err);
            showError('Erro ao inicializar o calendário.');
        }
    }

    // Renderiza o mini-calendário no modal
    function renderCalendar() {
        try {
            const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
            const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
            const startingDayOfWeek = firstDayOfMonth.getDay();
            
            elements.month.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            // Limpa o grid, mantendo os cabeçalhos
            while (elements.grid.children.length > 7) {
                elements.grid.removeChild(elements.grid.lastChild);
            }
            
            // Dias vazios do mês anterior
            for (let i = 0; i < startingDayOfWeek; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'day-cell other-month';
                elements.grid.appendChild(emptyDay);
            }
            
            // Dias do mês atual
            const today = new Date(2025, 5, 2, 15, 42); // 02/06/2025
            for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
                const currentDate = new Date(currentYear, currentMonth, day);
                const dayElement = document.createElement('div');
                dayElement.className = 'day-cell';
                dayElement.textContent = day;
                dayElement.dataset.date = currentDate.toISOString();
                
                // Destacar dia atual
                if (isSameDay(currentDate, today)) {
                    dayElement.classList.add('today');
                }
                
                // Destacar dias selecionados
                if (tempStartDate && tempEndDate && 
                    currentDate >= tempStartDate && currentDate <= tempEndDate) {
                    dayElement.classList.add('selected');
                } else if (tempStartDate && !tempEndDate && 
                          isSameDay(currentDate, tempStartDate)) {
                    dayElement.classList.add('selected');
                }
                
                dayElement.addEventListener('click', () => handleDayClick(currentDate));
                elements.grid.appendChild(dayElement);
            }
            
            updateSelectedPeriodInfo();
        } catch (err) {
            console.error('Erro na renderização do calendário:', err);
        }
    }

    function handleDayClick(date) {
        if (!tempStartDate || (tempStartDate && tempEndDate)) {
            // Novo intervalo
            tempStartDate = new Date(date);
            tempEndDate = null;
        } else if (date > tempStartDate) {
            // Completa o intervalo
            tempEndDate = new Date(date);
        } else {
            // Data anterior à data de início
            tempEndDate = new Date(tempStartDate);
            tempStartDate = new Date(date);
        }
        renderCalendar();
    }

    function updateSelectedPeriodInfo() {
        if (tempStartDate && tempEndDate) {
            elements.periodo.textContent = `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`;
        } else if (tempStartDate) {
            elements.periodo.textContent = `${formatDate(tempStartDate)} (selecione a data final)`;
        } else {
            elements.periodo.textContent = 'Nenhum período selecionado';
        }
    }

    // Filtra eventos
    async function filterEvents() {
        try {
            const startDate = parseDateInput(elements.inicio.value);
            const endDate = parseDateInput(elements.fim.value);
            
            if (!startDate || !endDate) {
                showError('Preencha ambas as datas!');
                return;
            }
            
            if (startDate > endDate) {
                showError('A data de início não pode ser maior que a data de fim!');
                return;
            }
            
            selectedStartDate = new Date(startDate);
            selectedEndDate = new Date(endDate);
            
            // Atualiza o calendário com eventos filtrados
            calendar.setOption('events', async function(fetchInfo, successCallback, failureCallback) {
                try {
                    const events = await fetchFilteredEvents(formatDateISO(startDate), formatDateISO(endDate));
                    console.log('Eventos filtrados enviados ao FullCalendar:', events);
                    if (events.length === 0) {
                        showError('Nenhuma consulta encontrada para o período filtrado.');
                    }
                    successCallback(events);
                } catch (err) {
                    failureCallback(err);
                    showError('Erro ao carregar consultas filtradas do servidor.');
                }
            });
            calendar.gotoDate(formatDateISO(startDate)); // Navega para a data inicial do filtro
            calendar.render();
            
            showError(`Filtro aplicado para o período: ${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`);
        } catch (err) {
            console.error('Erro ao filtrar eventos:', err);
            showError('Erro ao aplicar o filtro!');
        }
    }

    // Funções do Side Panel
    function toggleRelatoriosPanel() {
        elements.relatoriosPanel.classList.toggle('active');
        elements.relatoriosBtn.classList.toggle('active');
        elements.agendaBtn.classList.remove('active');
        if (elements.relatoriosPanel.classList.contains('active')) {
            document.querySelector('.main-calendar-container').style.display = 'none';
        } else {
            document.querySelector('.main-calendar-container').style.display = 'block';
        }
    }

    // Event Listeners
    function setupEventListeners() {
        elements.filtrar.addEventListener('click', filterEvents);
        
        elements.mostrar.addEventListener('click', () => {
            tempStartDate = elements.inicio.value ? new Date(elements.inicio.value) : null;
            tempEndDate = elements.fim.value ? new Date(elements.fim.value) : null;
            renderCalendar();
            elements.modal.show();
        });
        
        elements.fechar.addEventListener('click', () => {
            elements.modal.hide();
            tempStartDate = selectedStartDate ? new Date(selectedStartDate) : null;
            tempEndDate = selectedEndDate ? new Date(selectedEndDate) : null;
            renderCalendar();
        });
        
        elements.aplicar.addEventListener('click', () => {
            if (!tempStartDate) {
                showError('Selecione pelo menos uma data de início!');
                return;
            }
            
            selectedStartDate = new Date(tempStartDate);
            selectedEndDate = tempEndDate ? new Date(tempEndDate) : new Date(tempStartDate);
            
            elements.inicio.valueAsDate = selectedStartDate;
            elements.fim.valueAsDate = selectedEndDate;
            
            elements.modal.hide();
            filterEvents();
        });
        
        elements.cancelar.addEventListener('click', () => {
            elements.modal.hide();
            tempStartDate = selectedStartDate ? new Date(selectedStartDate) : null;
            tempEndDate = selectedEndDate ? new Date(selectedEndDate) : null;
            renderCalendar();
        });
        
        elements.limpar.addEventListener('click', () => {
            tempStartDate = null;
            tempEndDate = null;
            renderCalendar();
        });
        
        elements.prev.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        elements.next.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
        
        elements.relatoriosBtn.addEventListener('click', toggleRelatoriosPanel);
        elements.fecharRelatorios.addEventListener('click', toggleRelatoriosPanel);
        elements.agendaBtn.addEventListener('click', () => {
            elements.relatoriosPanel.classList.remove('active');
            elements.relatoriosBtn.classList.remove('active');
            elements.agendaBtn.classList.add('active');
            document.querySelector('.main-calendar-container').style.display = 'block';
        });

        elements.relatorioConsultas.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const report = await fetchMonthlyConsultationsReport();
                showError(JSON.stringify(report, null, 2));
            } catch (err) {
                console.error('Erro ao buscar relatório de consultas:', err);
                showError('Erro ao carregar o relatório de consultas.');
            }
        });

        elements.relatorioPacientes.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const report = await fetchPatientsReport();
                showError(JSON.stringify(report, null, 2));
            } catch (err) {
                console.error('Erro ao buscar relatório de pacientes:', err);
                showError('Erro ao carregar o relatório de pacientes.');
            }
        });

        elements.relatorioProcedimentos.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const report = await fetchProceduresReport();
                showError(JSON.stringify(report, null, 2));
            } catch (err) {
                console.error('Erro ao buscar relatório de procedimentos:', err);
                showError('Erro ao carregar o relatório de procedimentos.');
            }
        });
    }

    // Inicializa a aplicação
    setupEventListeners();
    init();
});