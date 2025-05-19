package com.example.Back.Repository;

import com.example.Back.entity.Consulta;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    Optional<Consulta> findByIdConsulta(Long idConsulta);

    Optional<Object> findByData(LocalDateTime data);

    Optional<Object> findByProfissional(Profissional Profissional);

    Optional<Object> findByPaciente(Paciente paciente);

    List<Consulta> findByPacienteAndData(Paciente paciente, LocalDateTime data);
}