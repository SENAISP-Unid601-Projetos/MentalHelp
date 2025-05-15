 -- 1) Exibir todas as consultas agendadas para um médico específico.  - JAO
SELECT 
    c.id_consulta,
    c.data,
    c.tipo_consulta,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
JOIN Paciente p ON c.paciente_id = p.id_paciente
JOIN Profissional pr ON c.profissional_id = pr.id_profisional
WHERE pr.nome  = 'NOME DO MEDICO';

-- 2) Exibir todas as consultas agendadas para um paciente específico. - JAO
SELECT 
    c.id_consulta,
    c.data,
    c.tipo_consulta,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
JOIN Paciente p ON c.paciente_id = p.id_paciente
JOIN Profissional pr ON c.profissional_id = pr.id_profisional
WHERE p.nome  = 'NOME DO PACIENTE';

-- 3) Consultas que ocorreram ou ocorrerão em um intervalo de datas específico. - JAO
SELECT 
    c.id_consulta,
    c.data,
    c.tipo_consulta,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
JOIN Paciente p ON c.paciente_id = p.id_paciente
JOIN Profisional pr ON c.profissional_id = pr.id_profisional
WHERE c.data BETWEEN '2025-05-01' AND '2025-05-31';

-- 4) Consultas classificadas por tipo de atendimento infantil. - JAO
SELECT 
    c.id_consulta,
    c.data,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
JOIN Paciente p ON c.paciente_id = p.id_paciente
JOIN Profisional pr ON c.profissional_id = pr.id_profisional
WHERE c.tipo_consulta = 'infantil';

-- 5) Consultas classificadas por tipo de atendimento adulto. - JAO
SELECT 
    c.id_consulta,
    c.data,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
JOIN Paciente p ON c.paciente_id = p.id_paciente
JOIN Profisional pr ON c.profissional_id = pr.id_profisional
WHERE c.tipo_consulta = 'Adulta';

-- 6)  Consultas classificadas por tipo de atendimento especial. - JAO
SELECT 
    c.id_consulta,
    c.data,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
JOIN Paciente p ON c.paciente_id = p.id_paciente
JOIN Profisional pr ON c.profissional_id = pr.id_profisional
WHERE c.tipo_consulta = 'especial';

-- 7)  Exibir consultas agendadas que estão pendentes. - JAO
SELECT 
    c.id_consulta,
    c.data,
    c.tipo_consulta,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
JOIN Paciente p ON c.paciente_id = p.id_paciente
JOIN Profisional pr ON c.profissional_id = pr.id_profisional
WHERE c.data > NOW()
ORDER BY c.data;

-- 8) Verificar todas as consultas passadas ou futuras para um paciente específico. - GALLO
SELECT
    c.id_consulta, 
    c.data, 
    c.tipo_consulta,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
INNER JOIN Paciente p ON c.paciente_id = p.id_paciente
INNER JOIN Profisional pr ON c.profissional_id = pr.id_profisional
WHERE p.nome = 'NOME DO PACIENTE' 
ORDER BY c.data;

-- 9)  Verificar todas as consultas passadas ou futuras para um médico específico. - GALLO
SELECT
    c.id_consulta,
    c.data,
    c.tipo_consulta,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
INNER JOIN Paciente p ON c.paciente_id = p.id_paciente
INNER JOIN Profisional pr ON c.profissional_id = pr.id_profisional
WHERE pr.nome = 'NOME DO MÉDICO'  -- Substitua aqui
ORDER BY c.data;

-- 10) Consultar a consulta com o maior valor cobrado. - GALLO
SELECT
    c.id_consulta,
    c.data,
    c.tipo_consulta,
    c.valor_consulta,
    p.nome AS nome_paciente,
    pr.nome AS nome_profissional
FROM Consulta c
JOIN Paciente p ON c.paciente_id = p.id_paciente
JOIN Profisional pr ON c.profissional_id = pr.id_profisional
WHERE c.valor_consulta = (
    SELECT MAX(valor_consulta) FROM Consulta
);

-- 11) Calcular a média de valor das consultas realizadas por cada médico. - GALLO
SELECT 
    pr.id_profisional,
    pr.nome AS nome_profissional,
    AVG(c.valor_consulta) AS media_valor_consulta,
    COUNT(c.id_consulta) AS total_consultas
FROM Consulta c
JOIN Profisional pr ON c.profissional_id = pr.id_profisional
WHERE pr.nome = 'Nome do Médico' 
GROUP BY pr.id_profisional, pr.nome;