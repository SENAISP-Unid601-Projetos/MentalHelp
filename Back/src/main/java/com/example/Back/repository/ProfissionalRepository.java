package com.example.Back.repository;

import com.example.Back.entity.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfissionalRepository  extends JpaRepository<Profissional, Long> {

   Optional <Profissional> findByIdProfissional(Long idProfissional);
   Optional<Profissional> findByEmail(String email);

   Optional<Profissional> findByCrm(String crm);

   boolean existsByCrm(String crm);

   List<Profissional> findByEspecialidade(String especialidade);
}
