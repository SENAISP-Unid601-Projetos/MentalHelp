package com.example.Back.Repository;

import com.example.Back.entity.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfissionalRepository  extends JpaRepository<Profissional, Long> {

   Optional <Profissional> findByIdProfissional(Long idProfissional);
   Optional<Profissional> findByEmail(String email);
   Optional<Profissional> findByName(String nome);
}
