package com.example.Back.Repository;

import com.example.Back.entity.Atestado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AtestadoRepository extends JpaRepository<Atestado, Long> {
    Optional<Atestado> findByConsulta_IdConsulta(Long idConsulta); // <- Isso aqui é essencial

}
