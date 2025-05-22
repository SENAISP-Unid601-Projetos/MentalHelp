package com.example.Back.service;


import com.example.Back.repository.ArquivoEnviadoRepository;
import com.example.Back.repository.PacienteRepository;
import com.example.Back.repository.ProfissionalRepository;
import com.example.Back.entity.ArquivoEnviado;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Profissional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;

import java.time.LocalDateTime;

@Service
public class ArquivoEnviadoService {

    @Autowired
    private ArquivoEnviadoRepository arquivoEnviadoRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public void salvarArquivo(MultipartFile file, Long idProfissional, Long idPaciente) throws IOException {
        ArquivoEnviado novo = new ArquivoEnviado();
        novo.setNomeArquivo(file.getOriginalFilename());
        novo.setDataEnvio(LocalDateTime.now());
        novo.setConteudo(file.getBytes()); // Armazena binário

        // Busca e associa as entidades relacionadas
        Profissional profissional = profissionalRepository.findById(idProfissional)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        Paciente paciente = pacienteRepository.findById(idPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        novo.setProfissional(profissional);
        novo.setPaciente(paciente);

        arquivoEnviadoRepository.save(novo);
    }
}
