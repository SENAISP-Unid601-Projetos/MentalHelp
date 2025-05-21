package com.example.Back.Repository;

import com.example.Back.entity.Consulta;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    Optional<Consulta> findByIdConsulta(Long idConsulta);
    Optional<Consulta> findByData(LocalDateTime data); // Retorna uma consulta específica para uma data

    Optional<Consulta> findByProfissional(Profissional profissional); // Retorna uma consulta de um profissional específico

    Optional<Consulta> findByPaciente(Paciente paciente); // Retorna uma consulta para um paciente específico

    List<Consulta> findByProfissionalAndData(Profissional profissional, LocalDateTime data); // Retorna a lista de consultas para um profissional e data
}