package com.example.Back.controller;

import com.example.Back.Repository.ArquivoEnviadoRepository;
import com.example.Back.Service.ArquivoEnviadoService;
import com.example.Back.entity.ArquivoEnviado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/arquivos")
public class ArquivoController {

    private static final String BASE_DIR = "arquivos";

    @Autowired
    private ArquivoEnviadoService arquivoService;

    @Autowired
    private ArquivoEnviadoRepository arquivoEnviadoRepository;

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarArquivoParaPaciente(
            @RequestParam("profissionalId") Long profissionalId,
            @RequestParam("pacienteId") Long pacienteId,
            @RequestParam("arquivo") MultipartFile arquivo) {

        try {
            // Aqui você pode salvar o arquivo no banco de dados ou no sistema de arquivos.
            if (arquivo.isEmpty() || !arquivo.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().body("Arquivo inválido. Envie um PDF.");
            }

            // Suponha que você tenha um serviço que salva esse arquivo
            arquivoService.salvarArquivo(profissionalId, pacienteId, arquivo);

            return ResponseEntity.ok("Arquivo enviado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar o arquivo: " + e.getMessage());
        }
    }

    @GetMapping("/arquivos/profissional/{idProfissional}")
    public ResponseEntity<List<Map<String, Object>>> listarArquivosPorProfissional(@PathVariable Long idProfissional) {
        List<ArquivoEnviado> arquivos = arquivoEnviadoRepository
                .findByProfissional_IdProfissional(idProfissional);

        if (arquivos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<Map<String, Object>> resultado = arquivos.stream().map(arquivo -> {
            Map<String, Object> info = new HashMap<>();
            info.put("idArquivo", arquivo.getId());
            info.put("idProfissional", arquivo.getProfissional().getIdProfissional());

            return info;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(resultado);
    }
}

