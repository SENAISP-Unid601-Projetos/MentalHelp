package com.example.Back.controller;

import com.example.Back.Repository.ArquivoEnviadoRepository;
import com.example.Back.Repository.ProfissionalRepository;
import com.example.Back.entity.ArquivoEnviado;
import com.example.Back.entity.Profissional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/arquivos")
public class ArquivoController {

    @Autowired
    private ArquivoEnviadoRepository arquivoEnviadoRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @PostMapping(value = "/enviar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> enviarArquivo(
            @RequestParam("arquivo") MultipartFile arquivo,
            @RequestParam("idProfissional") Long idProfissional) {

        try {
            Profissional profissional = profissionalRepository.findById(idProfissional)
                    .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

            ArquivoEnviado novoArquivo = new ArquivoEnviado();
            novoArquivo.setNomeArquivo(arquivo.getOriginalFilename());
            novoArquivo.setDataEnvio(LocalDateTime.now());
            novoArquivo.setProfissional(profissional);
            novoArquivo.setConteudo(arquivo.getBytes()); // salva conteúdo binário do PDF

            arquivoEnviadoRepository.save(novoArquivo);

            return ResponseEntity.ok("Arquivo enviado com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao enviar o arquivo.");
        }
    }

    @GetMapping("/por-profissional/{idProfissional}")
    public ResponseEntity<List<Map<String, Object>>> listarArquivosPorProfissional(@PathVariable Long idProfissional) {
        List<ArquivoEnviado> arquivos = arquivoEnviadoRepository.findByProfissionalIdProfissional(idProfissional);

        List<Map<String, Object>> resultado = arquivos.stream().map(arquivo -> {
            Map<String, Object> info = new HashMap<>();
            info.put("idArquivo", arquivo.getId());
            info.put("nomeArquivo", arquivo.getNomeArquivo());
            info.put("idProfissional", arquivo.getProfissional().getIdProfissional());
            info.put("dataEnvio", arquivo.getDataEnvio());
            return info;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(resultado);
    }
}



