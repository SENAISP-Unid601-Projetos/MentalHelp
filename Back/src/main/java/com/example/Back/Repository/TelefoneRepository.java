package com.example.Back.Repository;

import com.example.Back.entity.Telefone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelefoneRepository extends JpaRepository<Telefone, String> {
    List<Telefone> findByIdPaciente(Long idPaciente);
}