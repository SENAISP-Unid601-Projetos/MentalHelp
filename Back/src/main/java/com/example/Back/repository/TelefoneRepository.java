package com.example.Back.repository;

import com.example.Back.entity.Paciente;
import com.example.Back.entity.Telefone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelefoneRepository extends JpaRepository<Telefone, String> {
    List<Telefone> findByPaciente(Paciente paciente);
}