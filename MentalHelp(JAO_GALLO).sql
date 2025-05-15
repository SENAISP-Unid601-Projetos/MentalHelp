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

-- media de idade geral dos pacientes
SELECT AVG(TIMESTAMPDIFF(YEAR, p.data_nascimento, CURDATE())) AS media_idade_geral
FROM paciente p;

-- media de idade por tipo de consulta
SELECT AVG(TIMESTAMPDIFF(YEAR, p.data_nascimento, CURDATE())) AS media_idade_especial
FROM paciente p
JOIN consulta c ON c.paciente_id = p.id_paciente
WHERE c.tipo_consulta = 'Especial';

SELECT AVG(TIMESTAMPDIFF(YEAR, p.data_nascimento, CURDATE())) AS media_idade_infantil
FROM paciente p
JOIN consulta c ON c.paciente_id = p.id_paciente
WHERE c.tipo_consulta = 'Infantil';

SELECT AVG(TIMESTAMPDIFF(YEAR, p.data_nascimento, CURDATE())) AS media_idade_adulto
FROM paciente p
JOIN consulta c ON c.paciente_id = p.id_paciente
WHERE c.tipo_consulta = 'Adulto';

-- número de consultas por médico no último mês
SELECT pr.nome AS medico,
       COUNT(c.id_consulta) AS total_consultas
FROM consulta c
JOIN profissional pr ON c.profissional_id = pr.id_profissional
WHERE c.data >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
GROUP BY pr.id_profissional, pr.nome
ORDER BY total_consultas DESC;

-- médico que realizou MENOS consultas em UM DIA
SELECT pr.nome AS medico,
       COUNT(c.id_consulta) AS total_consultas
FROM consulta c
JOIN profissional pr ON c.profissional_id = pr.id_profissional
WHERE c.data >= CURDATE() - INTERVAL 1 DAY
GROUP BY pr.id_profissional, pr.nome
ORDER BY total_consultas ASC
LIMIT 1;

-- número de consultas por tipo de atendimento
SELECT tipo_consulta,
       COUNT(*) AS total_consultas
FROM consulta
GROUP BY tipo_consulta;

--  número de consultas por especialidade do profissional
SELECT pr.especialidade,
       COUNT(c.id_consulta) AS total_consultas
FROM consulta c
JOIN profissional pr ON c.profissional_id = pr.id_profissional
GROUP BY pr.especialidade
ORDER BY total_consultas DESC;

-- consulta com o maior valor
SELECT * FROM consulta
ORDER BY valor_consulta DESC
LIMIT 1;

-- consulta com o menor valor
SELECT * FROM consulta
ORDER BY valor_consulta ASC
LIMIT 1;
