package com.example.Back.repository;


import com.example.Back.entity.ArquivoEnviado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArquivoEnviadoRepository extends JpaRepository<ArquivoEnviado, Long> {
    List<ArquivoEnviado> findByProfissionalIdProfissional(Long idProfissional);
    List<ArquivoEnviado> findByPacienteIdPaciente(Long idPaciente);

}



