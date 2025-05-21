document.addEventListener('DOMContentLoaded', function() {
    // Quando clicar em uma consulta
    document.querySelectorAll('.consulta-item').forEach(item => {
        item.addEventListener('click', function() {
            const consultaId = this.getAttribute('data-consulta-id');
            
            // Aqui você faria uma requisição para buscar os detalhes da consulta
            // Estou usando dados mockados para exemplo
            const detalhesConsulta = getDetalhesConsultaMock(consultaId);
            
            // Preencher o modal com os detalhes
            document.getElementById('detalhe-nome').textContent = detalhesConsulta.nome;
            document.getElementById('detalhe-idade').textContent = detalhesConsulta.idade + ' anos';
            document.getElementById('detalhe-genero').textContent = detalhesConsulta.genero;
            document.getElementById('detalhe-data-horario').textContent = detalhesConsulta.data + ' - ' + detalhesConsulta.horario;
            document.getElementById('detalhe-tipo').textContent = detalhesConsulta.tipo;
            document.getElementById('detalhe-telefone').textContent = detalhesConsulta.telefone;
            document.getElementById('detalhe-motivo').textContent = detalhesConsulta.motivo;
            document.getElementById('detalhe-observacoes').textContent = detalhesConsulta.observacoes;
            
            // Mostrar o modal
            const modal = new bootstrap.Modal(document.getElementById('modalDetalhesConsulta'));
            modal.show();
        });
    });
    
    // Função mockada para simular dados da consulta
    function getDetalhesConsultaMock(consultaId) {
        const consultas = {
            '1': {
                nome: 'Maria Silva',
                idade: 32,
                genero: 'Feminino',
                data: '22/05/2023',
                horario: '10:00',
                tipo: 'Consulta de Retorno',
                telefone: '(11) 9876-5432',
                motivo: 'Acompanhamento pós-cirúrgico e renovação de receitas',
                observacoes: 'Paciente relatou melhora nos sintomas, mas ainda sente desconforto ocasional.'
            },
            '2': {
                nome: 'João Oliveira',
                idade: 45,
                genero: 'Masculino',
                data: '22/05/2023',
                horario: '14:30',
                tipo: 'Primeira Consulta',
                telefone: '(11) 91234-5678',
                motivo: 'Avaliação inicial para possível diagnóstico de TDAH',
                observacoes: 'Trazer relatórios escolares e exames anteriores.'
            },
            '3': {
                nome: 'Ana Santos',
                idade: 28,
                genero: 'Feminino',
                data: '22/05/2023',
                horario: '16:00',
                tipo: 'Acompanhamento',
                telefone: '(11) 99876-5432',
                motivo: 'Controle de medicação e avaliação de progresso',
                observacoes: 'Paciente está respondendo bem ao tratamento atual.'
            }
        };
        
        return consultas[consultaId] || {};
    }
});