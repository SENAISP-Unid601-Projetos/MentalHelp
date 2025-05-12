package com.example.Back.Repository;


import com.example.Back.entity.ArquivoEnviado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArquivoEnviadoRepository extends JpaRepository<ArquivoEnviado, Long> {
    List<ArquivoEnviado> findByProfissional_IdProfissional(Long idProfissional);
}


