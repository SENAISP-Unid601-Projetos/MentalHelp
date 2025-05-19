package com.example.Back.Repository;

import com.example.Back.entity.Consulta;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> d131e5487d32f2308290e34338957056baf2d5ac
import java.util.Optional;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    Optional<Consulta> findByIdConsulta(Long idConsulta);

    Optional<Object> findByData(LocalDateTime data);

    Optional<Object> findByProfissional(Profissional Profissional);

    Optional<Object> findByPaciente(Paciente paciente);
<<<<<<< HEAD
=======

    List<Consulta> findByPacienteAndData(Paciente paciente, LocalDateTime data);
>>>>>>> d131e5487d32f2308290e34338957056baf2d5ac
}