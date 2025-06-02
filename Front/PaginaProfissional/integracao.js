const API_BASE_URL = 'http://localhost:8080/api'; // Base URL ajustada para o ambiente local

// Configuração global do Axios
axios.defaults.headers.common['Authorization'] = 'Bearer your-token-here'; // Substitua pelo token de autenticação real, ou remova se não necessário

// Função para buscar todas as consultas
async function fetchEvents(startDate, endDate) {
    try {
        // Ajusta os parâmetros para cobrir o dia inteiro no fuso -03:00
        const start = startDate.split('T')[0] + 'T00:00:00-03:00';
        const end = endDate.split('T')[0] + 'T23:59:59-03:00';
        console.log('Parâmetros enviados para /consultas/get:', { start, end });

        const response = await axios.get(`${API_BASE_URL}/consultas/get`, {
            params: {
                start: start,
                end: end
            }
        });
        
        // Log detalhado dos dados retornados
        console.log('Resposta completa de /consultas/get:', response);
        console.log('Dados recebidos de /consultas/get:', response.data);
        
        // Verifica se há dados retornados
        if (!response.data || response.data.length === 0) {
            console.warn('Nenhum dado retornado pelo endpoint /consultas/get para o período solicitado.');
            return [];
        }

        // Mapeia os dados do back-end para o formato esperado pelo FullCalendar
        const events = response.data.map((event, index) => {
            const startDateTime = new Date(event.data);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Adiciona 1 hora como duração padrão
            const mappedEvent = {
                title: event.tipoConsulta || `Consulta ${index + 1}`,
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
                color: '#a855ff' // Cor padrão do tema roxo
            };
            console.log(`Evento ${index + 1} mapeado:`, mappedEvent);
            return mappedEvent;
        }).filter(event => event.start);
        
        return events;
    } catch (err) {
        console.error('Erro ao buscar consultas:', err);
        if (err.response) {
            console.error('Detalhes do erro:', err.response.status, err.response.data);
        }
        throw err;
    }
}

// Função para buscar consultas filtradas
async function fetchFilteredEvents(startDate, endDate) {
    try {
        // Ajusta os parâmetros para cobrir o dia inteiro no fuso -03:00
        const start = startDate + 'T00:00:00-03:00';
        const end = endDate + 'T23:59:59-03:00';
        console.log('Parâmetros enviados para /consultas/filter:', { start, end });

        const response = await axios.get(`${API_BASE_URL}/consultas/filter`, {
            params: {
                start: start,
                end: end
            }
        });
        
        // Log detalhado dos dados retornados
        console.log('Resposta completa de /consultas/filter:', response);
        console.log('Dados recebidos de /consultas/filter:', response.data);
        
        // Verifica se há dados retornados
        if (!response.data || response.data.length === 0) {
            console.warn('Nenhum dado retornado pelo endpoint /consultas/filter para o período solicitado.');
            return [];
        }

        // Mapeia os dados do back-end para o formato esperado pelo FullCalendar
        const events = response.data.map((event, index) => {
            const startDateTime = new Date(event.data);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Adiciona 1 hora como duração padrão
            const mappedEvent = {
                title: event.tipoConsulta || `Consulta ${index + 1}`,
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
                color: '#a855ff'
            };
            console.log(`Evento filtrado ${index + 1} mapeado:`, mappedEvent);
            return mappedEvent;
        }).filter(event => event.start);
        
        return events;
    } catch (err) {
        console.error('Erro ao buscar consultas filtradas:', err);
        if (err.response) {
            console.error('Detalhes do erro:', err.response.status, err.response.data);
        }
        throw err;
    }
}

// Função para buscar relatório de consultas mensais
async function fetchMonthlyConsultationsReport() {
    try {
        const response = await axios.get(`${API_BASE_URL}/reports/consultations`);
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar relatório de consultas:', err);
        throw err;
    }
}

// Função para buscar relatório de pacientes
async function fetchPatientsReport() {
    try {
        const response = await axios.get(`${API_BASE_URL}/reports/patients`);
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar relatório de pacientes:', err);
        throw err;
    }
}

// Função para buscar relatório de procedimentos
async function fetchProceduresReport() {
    try {
        const response = await axios.get(`${API_BASE_URL}/reports/procedures`);
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar relatório de procedimentos:', err);
        throw err;
    }
}