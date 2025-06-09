document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;
    let selectedTime = null;
    let appointments = JSON.parse(localStorage.getItem('agendamentosAdulto')) || [];

    // DOM elements
    const bookButton = document.getElementById('btnAgendar');
    const viewAppointmentsButton = document.getElementById('btnVerAgendamentos');
    const errorMessage = document.getElementById('mensagemErro');
    const appointmentSummary = document.getElementById('resumo-agendamento');
    const selectedDateElement = document.getElementById('data-selecionada');
    const selectedTimeElement = document.getElementById('horario-selecionado');
    const confirmationModal = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
    const appointmentDetails = document.getElementById('detalhes-agendamento');
    const timesContainer = document.querySelector('.horarios');

    let appointmentsModal = null;
    let appointmentsModalElement = null;

    // Initialize
    generateCalendar(currentMonth, currentYear);
    setupTimeSelection();
    setupNavigationButtons();
    updateAvailableTimes();

    function generateCalendar(month, year) {
        const daysContainer = document.getElementById('dias');
        const monthTitle = document.getElementById('mes');
        if (!daysContainer || !monthTitle) {
            console.error('Required DOM elements not found');
            return;
        }

        daysContainer.innerHTML = '';
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];

        const monthNames = [
            t.janeiro, t.fevereiro, t.marco, t.abril, t.maio, t.junho,
            t.julho, t.agosto, t.setembro, t.outubro, t.novembro, t.dezembro
        ];
        monthTitle.textContent = `${monthNames[month]} ${year}`;

        for (let i = 0; i < firstDay; i++) {
            daysContainer.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= totalDays; day++) {
            const button = document.createElement('button');
            button.textContent = day;
            button.tabIndex = 0;

            const currentDate = new Date(year, month, day);
            if (currentDate < today) {
                button.disabled = true;
                button.classList.add('text-muted');
            } else {
                button.addEventListener('click', () => selectDay(button, year, month, day));
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        selectDay(button, year, month, day);
                    }
                });
            }

            daysContainer.appendChild(button);
        }
    }

    function selectDay(button, year, month, day) {
        document.querySelectorAll('.dias button').forEach(btn => btn.classList.remove('ativo'));
        button.classList.add('ativo');
        selectedDate = new Date(year, month, day);
        console.log('Selected Date:', selectedDate.toISOString());
        selectedTime = null;
        document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
        updateAvailableTimes();
        updateAppointmentSummary();
        checkSelectionComplete();
    }

    function setupTimeSelection() {
        timesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('horario-btn')) {
                document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('ativo'));
                e.target.classList.add('ativo');
                selectedTime = e.target.textContent;
                console.log('Selected Time:', selectedTime);
                updateAppointmentSummary();
                checkSelectionComplete();
            }
        });
    }

    function updateAvailableTimes() {
        const allTimes = ['10:00', '11:30', '14:30', '16:00', '17:30', '19:00'];
        const bookedTimes = selectedDate
            ? appointments
                .filter(ag => new Date(ag.data).toDateString() === selectedDate.toDateString())
                .map(ag => ag.horario)
            : [];

        const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
        timesContainer.innerHTML = availableTimes.map(time => `
            <button class="btn horario-btn">${time}</button>
        `).join('');
    }

    function setupNavigationButtons() {
        document.getElementById('anterior').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });

        document.getElementById('proximo').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }

    function updateAppointmentSummary() {
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];

        if (selectedDate) {
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            const formattedDate = selectedDate.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', options);
            selectedDateElement.textContent = `📅 ${t.dataSelecionada} ${formattedDate}`;
            appointmentSummary.classList.remove('d-none');
        } else {
            appointmentSummary.classList.add('d-none');
        }

        selectedTimeElement.textContent = selectedTime
            ? `⏰ ${t.horarioSelecionado} ${selectedTime}`
            : '';
    }

    function checkSelectionComplete() {
        bookButton.disabled = !(selectedDate && selectedTime);
        errorMessage.classList.add('d-none');
    }

    bookButton.addEventListener('click', async () => {
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];

        if (!selectedDate || !selectedTime) {
            errorMessage.textContent = t.mensagemErro;
            errorMessage.classList.remove('d-none');
            console.error('Missing date or time:', { selectedDate, selectedTime });
            return;
        }

        // Create appointment datetime
        const appointmentDate = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':').map(Number);
        appointmentDate.setHours(hours, minutes, 0, 0);
        const appointmentISO = appointmentDate.toISOString();
        console.log('Appointment ISO Date:', appointmentISO);

        // Save to local storage
        const newAppointment = {
            data: appointmentISO,
            horario: selectedTime,
            profissional: "Vagner"
        };
        appointments.push(newAppointment);
        localStorage.setItem('agendamentosAdulto', JSON.stringify(appointments));

        // Update confirmation modal
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = appointmentDate.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', options);
        appointmentDetails.innerHTML = t.detalhesAgendamento
            .replace("{0}", "Vagner")
            .replace("{1}", formattedDate)
            .replace("{2}", selectedTime);

        // Prepare API request
        const apiData = {
            data: appointmentISO,
            valorConsulta: 100,
            tipoConsulta: "ADULTO",
            idPaciente: 1,
            idProfissional: 1
        };
        console.log('API Request Data:', apiData);

        try {
            const response = await axios.post('http://10.110.12.59:8080/consultas/post', apiData);
            console.log('API Response:', response.data);
            confirmationModal.show();
        } catch (error) {
            console.error('Axios Error:', error.message, error.response?.data);
            errorMessage.textContent = t.erroAgendamento || 'Erro ao agendar. Tente novamente.';
            errorMessage.classList.remove('d-none');
            // Optionally revert local storage change if API fails
            appointments.pop();
            localStorage.setItem('agendamentosAdulto', JSON.stringify(appointments));
            return;
        }

        // Reset UI
        selectedDate = null;
        selectedTime = null;
        document.querySelectorAll('.ativo').forEach(el => el.classList.remove('ativo'));
        bookButton.disabled = true;
        appointmentSummary.classList.add('d-none');
        updateAvailableTimes();
    });

    function updateAppointmentsModal() {
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];
        const list = appointmentsModalElement.querySelector('.agendamentos-lista');

        list.innerHTML = appointments.length === 0
            ? `<p>${t.semAgendamentos}</p>`
            : appointments.map((ag, index) => {
                const date = new Date(ag.data);
                const formattedDate = date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                });
                return `
                    <div class="agendamento-item mb-3 p-3 border rounded">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${formattedDate}</strong><br>
                                ⏰ ${t.horarioAgendamento} ${ag.horario} - ${t.profissionalAgendamento} ${ag.profissional}
                            </div>
                            <button class="btn btn-danger btn-sm btn-excluir" data-index="${index}">
                                <i class="bi bi-trash"></i> ${t.cancelarAgendamento}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

        list.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-index');
                appointments.splice(index, 1);
                localStorage.setItem('agendamentosAdulto', JSON.stringify(appointments));
                updateAvailableTimes();
                updateAppointmentsModal();
            });
        });
    }

    viewAppointmentsButton.addEventListener('click', () => {
        const lang = localStorage.getItem('langAdulto') || 'pt';
        const t = translationsAdulto[lang] || translationsAdulto['pt'];

        if (!appointmentsModal) {
            appointmentsModalElement = document.createElement('div');
            appointmentsModalElement.innerHTML = `
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
            appointmentsModal = new bootstrap.Modal(appointmentsModalElement.querySelector('.modal'));
        }

        updateAppointmentsModal();
        appointmentsModal.show();
    });
});