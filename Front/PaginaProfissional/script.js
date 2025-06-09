document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const elements = {
        areaSelect: document.getElementById('areaSelect'),
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
        doctorName: document.getElementById('doctor-name'),
        doctorSpecialty: document.getElementById('doctor-specialty'),
        currentDate: document.getElementById('current-date'),
        agendaBtn: document.getElementById('agenda-btn'),
        errorMessage: document.getElementById('error-message'),
        calendario: document.getElementById('calendario')
    };

    // Verificar elementos essenciais
    const requiredElements = ['areaSelect', 'inicio', 'fim', 'filtrar', 'calendario', 'errorMessage', 'doctorName', 'doctorSpecialty'];
    for (const key of requiredElements) {
        if (!elements[key]) {
            console.error(`Elemento ${key} não encontrado no DOM.`);
            return;
        }
    }

    // Estado inicial
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectedArea = 'infantil';
    let selectedStartDate = null;
    let selectedEndDate = null;
    let tempStartDate = null;
    let tempEndDate = null;
    let calendar = null;

    // Mapeamento de áreas para médicos e especialidades
    const areaMapping = {
        infantil: { name: 'Dra. Gabrielly', specialty: 'Pediatra' },
        adulto: { name: 'Dr. Vagner', specialty: 'Clínico Geral' },
        especial: { name: 'Dr. Mykael', specialty: 'Especialista' }
    };

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

    // Atualiza a sidebar
    function updateSidebar() {
        const { name, specialty } = areaMapping[selectedArea];
        elements.doctorName.textContent = name;
        elements.doctorSpecialty.textContent = specialty;
    }

    // Inicialização
    function init() {
        elements.currentDate.textContent = formatDate(today);
        elements.inicio.value = '';
        elements.fim.value = '';
        elements.areaSelect.value = selectedArea;
        updateSidebar();
        initCalendar();
        renderCalendar();
    }

    // Inicializa o FullCalendar
    function initCalendar() {
        try {
            const calendarEl = elements.calendario;
            if (!calendarEl) throw new Error('Elemento do calendário não encontrado');

            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
                initialDate: today,
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
                        const start = selectedStartDate && selectedEndDate
                            ? new Date(Math.max(fetchInfo.start, selectedStartDate))
                            : fetchInfo.start;
                        const end = selectedStartDate && selectedEndDate
                            ? new Date(Math.min(fetchInfo.end, selectedEndDate))
                            : fetchInfo.end;
                        const events = await fetchEvents(start, end, selectedArea);
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
        } catch (err) {
            console.error('Falha na inicialização do calendário:', err);
            showError('Não foi possível carregar o calendário. Recarregue a página.');
        }
    }

    // Função para buscar eventos
    async function fetchEvents(start, end, area) {
        // Para integração com backend:
        /*
        try {
            const response = await fetch(`/api/consultas?area=${area}&start=${formatDateISO(start)}&end=${formatDateISO(end)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Erro ao buscar consultas');
            const events = await response.json();
            return events.map(event => ({
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                color: event.color || '#a855ff',
            }));
        } catch (err) {
            console.error('Erro ao buscar eventos:', err);
            throw err;
        }
        */

        // Simulação de eventos
        const events = [];
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        const doctorName = areaMapping[area].name;

        for (let i = 0; i < Math.min(days, 14); i++) {
            const eventDate = new Date(start);
            eventDate.setDate(start.getDate() + i);

            const numEvents = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < numEvents; j++) {
                const hour = 8 + Math.floor(Math.random() * 10);
                const startTime = new Date(eventDate);
                startTime.setHours(hour, 0, 0);

                const endTime = new Date(startTime);
                endTime.setHours(startTime.getHours() + 1);

                events.push({
                    title: `Consulta ${j + 1} - ${doctorName} (${area})`,
                    start: startTime,
                    end: endTime,
                    color: '#a855ff'
                });
            }
        }

        return events;
    }

    // Renderiza o mini-calendário
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

            if (!startDate || !endDate) {
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
                calendar.refetchEvents();
                calendar.gotoDate(startDate);
                showError(`Filtro aplicado: ${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)} (Área: ${areaMapping[selectedArea].name})`);
            } else {
                showError('Calendário não inicializado. Tente novamente.');
            }
        } catch (err) {
            console.error('Erro ao filtrar eventos:', err);
            showError('Erro ao aplicar o filtro. Tente novamente.');
        }
    }

    // Event Listeners
    function setupEventListeners() {
        elements.areaSelect?.addEventListener('change', (e) => {
            selectedArea = e.target.value;
            updateSidebar();
            if (calendar) {
                calendar.refetchEvents();
                showError(`Área alterada para ${areaMapping[selectedArea].name}`);
            }
        });

        elements.filtrar?.addEventListener('click', filterEvents);

        elements.mostrar?.addEventListener('click', () => {
            tempStartDate = elements.inicio.value ? parseDateInput(elements.inicio.value) : null;
            tempEndDate = elements.fim.value ? parseDateInput(elements.fim.value) : null;
            renderCalendar();
            elements.modal?.show();
        });

        elements.fechar?.addEventListener('click', () => {
            tempStartDate = selectedStartDate ? new Date(selectedStartDate) : null;
            tempEndDate = selectedEndDate ? new Date(selectedEndDate) : null;
            renderCalendar();
            elements.modal?.hide();
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
            tempStartDate = selectedStartDate ? new Date(selectedStartDate) : null;
            tempEndDate = selectedEndDate ? new Date(selectedEndDate) : null;
            renderCalendar();
            elements.modal?.hide();
        });

        elements.limpar?.addEventListener('click', () => {
            tempStartDate = null;
            tempEndDate = null;
            selectedStartDate = null;
            selectedEndDate = null;
            elements.inicio.value = '';
            elements.fim.value = '';
            elements.areaSelect.value = 'infantil';
            selectedArea = 'infantil';
            updateSidebar();
            elements.periodo.textContent = 'Nenhum período selecionado';
            renderCalendar();
            if (calendar) {
                calendar.refetchEvents();
                calendar.gotoDate(today);
                showError('Filtros limpos. Exibindo agenda padrão.');
            }
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

        elements.agendaBtn?.addEventListener('click', () => {
            elements.agendaBtn.classList.add('active');
        });
    }

    // Inicializa a aplicação
    setupEventListeners();
    init();
});