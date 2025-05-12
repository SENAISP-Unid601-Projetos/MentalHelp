package com.example.Back.Service;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class ArquivoEnviadoService {

    private static final String UPLOAD_DIR = "uploads"; // pasta no projeto

    public void salvarArquivo(Long profissionalId, Long pacienteId, MultipartFile arquivo) throws Exception {
        if (arquivo.isEmpty()) {
            throw new Exception("Arquivo está vazio.");
        }

        // Cria a pasta se não existir
        Files.createDirectories(Paths.get(UPLOAD_DIR));

        // Define o nome do arquivo: ex. profissional1_paciente2_nome.pdf
        String nomeArquivo = "prof" + profissionalId + "_pac" + pacienteId + "_" + arquivo.getOriginalFilename();
        File destino = new File(UPLOAD_DIR + File.separator + nomeArquivo);

        // Salva o arquivo
        try (FileOutputStream fos = new FileOutputStream(destino)) {
            fos.write(arquivo.getBytes());
        }
    }
}
