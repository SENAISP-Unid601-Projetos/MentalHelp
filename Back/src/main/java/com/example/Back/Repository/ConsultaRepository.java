package com.example.Back.Repository;

import com.example.Back.entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    Optional<Consulta> findByIdConsulta(Long idConsulta);

    Optional<Object> findByData(LocalDate data);

    Optional<Object> findByIdProfissional(Long idProfissional);

    Optional<Object> findByIdPaciente(Long idPaciente);
}
