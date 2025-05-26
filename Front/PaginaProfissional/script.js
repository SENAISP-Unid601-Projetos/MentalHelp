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
        date: document.getElementById('current-date')
    };

    // Estado inicial
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedStartDate = new Date();
    let selectedEndDate = new Date();
    let tempStartDate = null;
    let tempEndDate = null;

    // Dados
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    // Exemplo de eventos
    const sampleEvents = [
        { 
            title: 'Consulta - João Silva', 
            start: getTodayAtHour(9), 
            end: getTodayAtHour(10), 
            color: '#3498db' 
        },
        { 
            title: 'Consulta - Maria Oliveira', 
            start: getTodayAtHour(14), 
            end: getTodayAtHour(15), 
            color: '#3498db' 
        }
    ];

    // Funções auxiliares
    function getTodayAtHour(hour) {
        const date = new Date();
        date.setHours(hour, 0, 0, 0);
        return date;
    }

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

    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    // Inicialização
    function init() {
        const today = new Date();
        elements.date.textContent = formatDate(today);
        elements.inicio.valueAsDate = today;
        elements.fim.valueAsDate = today;
        
        initCalendar();
        renderCalendar();
    }

    // Inicializa o calendário principal
    function initCalendar() {
        try {
            const calendarEl = document.getElementById('calendario');
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
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
                events: sampleEvents,
                eventClick: function(info) {
                    alert(`Consulta: ${info.event.title}`);
                },
                height: 'auto'
            });
            calendar.render();
            return calendar;
        } catch (err) {
            console.error('Erro na inicialização do FullCalendar:', err);
            return null;
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
            const today = new Date();
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
    function filterEvents() {
        try {
            const startDate = parseDateInput(elements.inicio.value);
            const endDate = parseDateInput(elements.fim.value);
            
            if (!startDate || !endDate) {
                alert('Preencha ambas as datas!');
                return;
            }
            
            if (startDate > endDate) {
                alert('A data de início não pode ser maior que a data de fim!');
                return;
            }
            
            selectedStartDate = new Date(startDate);
            selectedEndDate = new Date(endDate);
            
            // Aqui você implementaria a lógica real de filtragem
            // Por enquanto apenas mostra um alerta com o período selecionado
            alert(`Filtro aplicado para o período: ${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`);
            
        } catch (err) {
            console.error('Erro ao filtrar eventos:', err);
            alert('Erro ao aplicar o filtro!');
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
                alert('Selecione pelo menos uma data de início!');
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
    }

    // Inicializa a aplicação
    setupEventListeners();
    init();
});