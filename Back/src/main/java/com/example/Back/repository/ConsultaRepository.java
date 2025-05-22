package com.example.Back.repository;

import com.example.Back.entity.Consulta;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    Optional<Consulta> findByIdConsulta(Long idConsulta);

    List<Consulta> findByData(LocalDateTime data);

    List<Consulta> findByProfissional(Profissional profissional);

    List<Consulta> findByPaciente(Paciente paciente);

    List<Consulta> findByPacienteAndData(Paciente paciente, LocalDateTime data);

    @Query("SELECT COUNT(c) > 0 FROM Consulta c WHERE c.profissional.idProfissional = :profissionalId AND c.data = :data")
    boolean existsByProfissionalIdAndData(Long profissionalId, LocalDateTime data);
}