package com.example.Back.Repository;
import com.example.Back.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.nio.channels.FileChannel;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository <Paciente, Long> {

    Optional<Paciente> findByEmail(String email);

    Optional<Paciente> findByNome(String nome);
}