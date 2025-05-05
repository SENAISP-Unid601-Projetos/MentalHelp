package com.example.Back.Repository;
import com.example.Back.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository <Paciente, Long> {
    Optional<Paciente> findPacienteById(Long idPaciente);

    Optional<Paciente> findByEmailAndSenha(String email, String senha);
}
