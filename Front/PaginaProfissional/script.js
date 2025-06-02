document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const elements = {
        inicio: document.getElementById('dataInicio'),
        fim: document.getElementById('dataFim'),
        filtrar: document.getElementById('filtrar'),
        mostrar: document.getElementById('mostrar-calendario'),
        modal: document.getElementById('modal-calendario') ? new bootstrap.Modal(document.getElementById('modal-calendario')) : null,
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
        errorMessage: document.getElementById('error-message'),
        mainCalendarContainer: document.querySelector('.main-calendar-container'),
        calendario: document.getElementById('calendario')
    };

    // Verificar se elementos essenciais estão presentes
    const requiredElements = ['inicio', 'fim', 'filtrar', 'calendario', 'errorMessage'];
    for (const key of requiredElements) {
        if (!elements[key]) {
            console.error(`Elemento ${key} não encontrado no DOM. Verifique o HTML.`);
            return;
        }
    }

    // Estado inicial
    let currentMonth = new Date(2025, 5, 2).getMonth(); // Junho 2025
    let currentYear = new Date(2025, 5, 2).getFullYear();
    let selectedStartDate = new Date(2025, 5, 2); // 02/06/2025
    let selectedEndDate = new Date(2025, 5, 2);
    let tempStartDate = null;
    let tempEndDate = null;
    let calendar = null;

    // Dados
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // Funções auxiliares
    function formatDate(date) {
        if (!date || isNaN(date.getTime())) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function parseDateInput(dateString) {
        if (!dateString) return null;
        const parts = dateString.split('-');
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return isNaN(date.getTime()) ? null : date;
    }

    function formatDateISO(date) {
        if (!date || isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function isSameDay(date1, date2) {
        return date1 && date2 && date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    function showError(message) {
        if (elements.errorMessage) {
            elements.errorMessage.textContent = message;
            elements.errorMessage.classList.remove('d-none');
            setTimeout(() => elements.errorMessage.classList.add('d-none'), 5000);
        } else {
            console.error('Elemento errorMessage não encontrado:', message);
        }
    }

    // Inicialização
    function init() {
        const today = new Date(2025, 5, 2, 16, 16); // 02/06/2025, 16:16 -03
        elements.date.textContent = formatDate(today);
        if (elements.inicio && elements.fim) {
            elements.inicio.value = formatDateISO(today);
            elements.fim.value = formatDateISO(today);
        }
        initCalendar();
        renderCalendar();
    }

    // Inicializa o FullCalendar
    let isLoadingDynamically = false;

async function initCalendar() {
    try {
        
        if (typeof calendar === 'undefined') {
            console.log('FullCalendar disponível:', typeof calendar);
            throw new Error('Biblioteca FullCalendar não foi carregada corretamente');
        }

        // Verifica se o elemento existe
        const calendarEl = document.getElementById('calendario');
        if (!calendarEl) {
            throw new Error('Elemento do calendário não encontrado no DOM');
        }

        // Cria a instância do calendário
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            initialDate: new Date('2025-06-02T20:03:00-03:00'), // 05:03 PM -03
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
            slotMinTime: '08:00:00',
            slotMaxTime: '20:00:00',
            events: async (fetchInfo, successCallback, failureCallback) => {
                try {
                    const events = await fetchEvents(fetchInfo.startStr, fetchInfo.endStr);
                    console.log('Eventos carregados:', events);
                    successCallback(events);
                } catch (err) {
                    console.error('Erro ao buscar eventos:', err);
                    failureCallback(err);
                    showError('Erro ao carregar consultas');
                }
            },
            eventClick: (info) => {
                const start = info.event.start.toLocaleString('pt-BR');
                const end = info.event.end ? info.event.end.toLocaleString('pt-BR') : 'Sem horário de término';
                showError(`Consulta: ${info.event.title}\nInício: ${start}\nFim: ${end}`);
            },
            height: 'auto',
            allDaySlot: false,
            nowIndicator: true,
            dayMaxEvents: true
        });
        
        calendar.render();
        console.log('Calendário inicializado com sucesso');
        calendar.refetchEvents();
    } catch (err) {
        console.error('Falha na inicialização do calendário:', err);
        showError('Não foi possível carregar o calendário. Recarregue a página.');
        if (err.message.includes('FullCalendar')) {
            loadFullCalendarDynamically();
        }
    }
}

function loadFullCalendarDynamically() {
    if (isLoadingDynamically) return;
    isLoadingDynamically = true;
    console.log('Tentando carregar FullCalendar dinamicamente...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/main.min.js';
    script.onload = () => {
        console.log('FullCalendar carregado com sucesso, carregando locales...');
        const localeScript = document.createElement('script');
        localeScript.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/locales-all.min.js';
        localeScript.onload = () => {
            console.log('Locales carregados, reiniciando calendário...');
            initCalendar();
            isLoadingDynamically = false;
        };
        localeScript.onerror = () => console.error('Falha ao carregar locales-all.min.js');
        document.head.appendChild(localeScript);
    };
    script.onerror = () => {
        console.error('Falha ao carregar FullCalendar dinamicamente');
        showError('Erro crítico: Biblioteca do calendário não disponível');
        isLoadingDynamically = false;
    };
    document.head.appendChild(script);
}

// Renderiza o mini-calendário no modal
function renderCalendar() {
    try {
        if (!elements.grid || !elements.month) throw new Error('Elementos do mini-calendário não encontrados');
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const startingDayOfWeek = firstDayOfMonth.getDay();

        elements.month.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        while (elements.grid.children.length > 7) elements.grid.removeChild(elements.grid.lastChild);

        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day-cell other-month';
            elements.grid.appendChild(emptyDay);
        }

        const today = new Date('2025-06-02T20:03:00-03:00'); // 05:03 PM -03
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const currentDate = new Date(currentYear, currentMonth, day);
            const dayElement = document.createElement('div');
            dayElement.className = 'day-cell';
            dayElement.textContent = day;
            dayElement.dataset.date = currentDate.toISOString();

            if (isSameDay(currentDate, today)) dayElement.classList.add('today');
            if (tempStartDate && tempEndDate && currentDate >= tempStartDate && currentDate <= tempEndDate) {
                dayElement.classList.add('selected');
            } else if (tempStartDate && !tempEndDate && isSameDay(currentDate, tempStartDate)) {
                dayElement.classList.add('selected');
            }

            dayElement.addEventListener('click', () => handleDayClick(currentDate));
            elements.grid.appendChild(dayElement);
        }

        updateSelectedPeriodInfo();
    } catch (err) {
        console.error('Erro ao renderizar mini-calendário:', err);
        showError('Erro ao renderizar o calendário.');
    }
}

function handleDayClick(date) {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
        tempStartDate = new Date(date);
        tempEndDate = null;
    } else if (date > tempStartDate) {
        tempEndDate = new Date(date);
    } else {
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
            if (!elements.inicio || !elements.fim) throw new Error('Campos de data não encontrados');
            const startDate = parseDateInput(elements.inicio.value);
            const endDate = parseDateInput(elements.fim.value);

            if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                showError('Preencha ambas as datas corretamente!');
                return;
            }

            if (startDate > endDate) {
                showError('A data de início não pode ser maior que a data de fim!');
                return;
            }

            selectedStartDate = new Date(startDate);
            selectedEndDate = new Date(endDate);

            if (calendar) {
                calendar.setOption('events', async (fetchInfo, successCallback, failureCallback) => {
                    try {
                        const events = await fetchFilteredEvents(formatDateISO(startDate), formatDateISO(endDate));
                        console.log('Eventos filtrados:', events);
                        if (events.length === 0) showError('Nenhuma consulta encontrada para o período filtrado.');
                        successCallback(events);
                    } catch (err) {
                        console.error('Erro ao buscar eventos filtrados:', err);
                        failureCallback(err);
                        showError('Erro ao carregar consultas filtradas.');
                    }
                });
                calendar.gotoDate(formatDateISO(startDate));
                calendar.render();
                showError(`Filtro aplicado: ${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`);
            } else {
                showError('Calendário não inicializado. Tente novamente.');
            }
        } catch (err) {
            console.error('Erro ao filtrar eventos:', err);
            showError('Erro ao aplicar o filtro!');
        }
    }

    // Funções do Side Panel
    function toggleRelatoriosPanel() {
        if (elements.relatoriosPanel && elements.mainCalendarContainer) {
            elements.relatoriosPanel.classList.toggle('active');
            elements.relatoriosBtn.classList.toggle('active');
            elements.agendaBtn.classList.remove('active');
            elements.mainCalendarContainer.style.display = elements.relatoriosPanel.classList.contains('active') ? 'none' : 'block';
        }
    }

    // Event Listeners
    function setupEventListeners() {
        elements.filtrar?.addEventListener('click', filterEvents);
        elements.mostrar?.addEventListener('click', () => {
            if (elements.inicio && elements.fim) {
                tempStartDate = elements.inicio.value ? new Date(elements.inicio.value) : null;
                tempEndDate = elements.fim.value ? new Date(elements.fim.value) : null;
                renderCalendar();
                elements.modal?.show();
            }
        });
        elements.fechar?.addEventListener('click', () => {
            elements.modal?.hide();
            tempStartDate = selectedStartDate ? new Date(selectedStartDate) : null;
            tempEndDate = selectedEndDate ? new Date(selectedEndDate) : null;
            renderCalendar();
        });
        elements.aplicar?.addEventListener('click', () => {
            if (!tempStartDate) {
                showError('Selecione pelo menos uma data de início!');
                return;
            }
            selectedStartDate = new Date(tempStartDate);
            selectedEndDate = tempEndDate ? new Date(tempEndDate) : new Date(tempStartDate);
            if (elements.inicio && elements.fim) {
                elements.inicio.value = formatDateISO(selectedStartDate);
                elements.fim.value = formatDateISO(selectedEndDate);
            }
            elements.modal?.hide();
            filterEvents();
        });
        elements.cancelar?.addEventListener('click', () => {
            tempStartDate = null;
            tempEndDate = null;
            elements.modal?.hide();
            renderCalendar();
        });
        elements.limpar?.addEventListener('click', () => {
            tempStartDate = null;
            tempEndDate = null;
            renderCalendar();
        });
        elements.prev?.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar();
        });
        elements.next?.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar();
        });
        elements.relatoriosBtn?.addEventListener('click', toggleRelatoriosPanel);
        elements.fecharRelatorios?.addEventListener('click', toggleRelatoriosPanel);
        elements.agendaBtn?.addEventListener('click', () => {
            if (elements.relatoriosPanel && elements.mainCalendarContainer) {
                elements.relatoriosPanel.classList.remove('active');
                elements.relatoriosBtn.classList.remove('active');
                elements.agendaBtn.classList.add('active');
                elements.mainCalendarContainer.style.display = 'block';
            }
        });
        elements.relatorioConsultas?.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const report = await fetchMonthlyConsultationsReport();
                showError(JSON.stringify(report, null, 2));
            } catch (err) {
                console.error('Erro ao buscar relatório de consultas:', err);
                showError('Erro ao carregar relatório de consultas.');
            }
        });
        elements.relatorioPacientes?.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const report = await fetchPatientsReport();
                showError(JSON.stringify(report, null, 2));
            } catch (err) {
                console.error('Erro ao buscar relatório de pacientes:', err);
                showError('Erro ao carregar relatório de pacientes.');
            }
        });
        elements.relatorioProcedimentos?.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const report = await fetchProceduresReport();
                showError(JSON.stringify(report, null, 2));
            } catch (err) {
                console.error('Erro ao buscar relatório de procedimentos:', err);
                showError('Erro ao carregar relatório de procedimentos.');
            }
        });
    }

    // Funções de integração (substitua por chamadas reais à API)
    async function fetchEvents(start, end) {
        try {
            const response = await fetch(`/api/consultas/get?start=${start}&end=${end}`);
            if (!response.ok) throw new Error('Falha na requisição');
            const data = await response.json();
            return data.map(event => ({
                title: event.tipoConsulta || 'Consulta',
                start: event.data,
                end: event.dataFim ? new Date(event.dataFim).toISOString() : new Date(new Date(event.data).getTime() + 60 * 60 * 1000).toISOString(),
                color: '#a855ff'
            }));
        } catch (err) {
            console.error('Erro ao buscar eventos:', err);
            return [];
        }
    }

    async function fetchFilteredEvents(start, end) {
        try {
            const response = await fetch(`/api/consultas/filter?start=${start}&end=${end}`);
            if (!response.ok) throw new Error('Falha na requisição');
            const data = await response.json();
            return data.map(event => ({
                title: event.tipoConsulta || 'Consulta',
                start: event.data,
                end: event.dataFim ? new Date(event.dataFim).toISOString() : new Date(new Date(event.data).getTime() + 60 * 60 * 1000).toISOString(),
                color: '#a855ff'
            }));
        } catch (err) {
            console.error('Erro ao buscar eventos filtrados:', err);
            return [];
        }
    }

    async function fetchMonthlyConsultationsReport() {
        try {
            const response = await fetch('/api/reports/consultations');
            if (!response.ok) throw new Error('Falha na requisição');
            return await response.json();
        } catch (err) {
            console.error('Erro ao buscar relatório de consultas:', err);
            return {};
        }
    }

    async function fetchPatientsReport() {
        try {
            const response = await fetch('/api/reports/patients');
            if (!response.ok) throw new Error('Falha na requisição');
            return await response.json();
        } catch (err) {
            console.error('Erro ao buscar relatório de pacientes:', err);
            return {};
        }
    }

    async function fetchProceduresReport() {
        try {
            const response = await fetch('/api/reports/procedures');
            if (!response.ok) throw new Error('Falha na requisição');
            return await response.json();
        } catch (err) {
            console.error('Erro ao buscar relatório de procedimentos:', err);
            return {};
        }
    }

    // Inicializa a aplicação
    setupEventListeners();
    init();
});