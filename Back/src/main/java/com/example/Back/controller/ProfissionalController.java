package com.example.Back.controller;

import com.example.Back.DTO.ProfissionalEntradaDTO;
import com.example.Back.DTO.ProfissionalSaidaDTO;
import com.example.Back.Repository.ProfissionalRepository;
import com.example.Back.Service.ProfissionalService;
import com.example.Back.entity.Profissional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/profissional")
public class ProfissionalController {

    @Autowired
    ProfissionalRepository profissionalRepository;

    @Autowired
    private ProfissionalService proService;

    @Autowired
    private MessageSource messageSource;

    @PostMapping("/post")
    public ResponseEntity<Map<String, Object>> createProfissional(@RequestPart("foto") MultipartFile foto, @RequestPart("profissionalEntradaDTO")ProfissionalEntradaDTO profissionalDTO) {
        String fotoPath = saveFoto(foto);
        profissionalDTO.setFoto(fotoPath);
        ResponseEntity<ProfissionalSaidaDTO> responseEntity = proService.salvarProfissional(profissionalDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("message", messageSource.getMessage("create.success", null, Locale.getDefault()));
        response.put("profissional", responseEntity.getBody());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProfissionalSaidaDTO>> getProfissionais() {
        return proService.listarProfissional();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProfissional(@PathVariable Long id, @RequestBody ProfissionalEntradaDTO profissionalDTO) {
        ResponseEntity<ProfissionalSaidaDTO> responseEntity = proService.atualizarProfissional(id, profissionalDTO);
        Map<String, Object> response = new HashMap<>();
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            response.put("message", messageSource.getMessage("update.success", null, Locale.getDefault()));
            response.put("profissional", responseEntity.getBody());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", messageSource.getMessage("update.notfound", null, Locale.getDefault()));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProfissional(@PathVariable Long id) {
        ResponseEntity<Void> responseEntity = proService.deletarProfissional(id);
        Map<String, Object> response = new HashMap<>();
        if (responseEntity.getStatusCode() == HttpStatus.NO_CONTENT) {
            response.put("message", messageSource.getMessage("delete.success", null, Locale.getDefault()));
            return ResponseEntity.ok(response);
        } else {
            response.put("message", messageSource.getMessage("update.notfound", null, Locale.getDefault()));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    private String saveFoto(MultipartFile foto) {
        // Gera um nome único para o arquivo
        String fileName = UUID.randomUUID().toString() + "_" + foto.getOriginalFilename();
        String uploadDir = "src/main/resources/profissionalPictures/";  // Diretório onde as fotos serão armazenadas

        try {
            Files.copy(foto.getInputStream(), Paths.get(uploadDir + fileName));
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Falha ao salvar a foto.");
        }
        return uploadDir + fileName;
    }

    @GetMapping("/foto/{crm}")
    public ResponseEntity<byte[]> getFoto(@PathVariable String crm) {
        try {
            Optional<Profissional> profissional = profissionalRepository.findByCrm(crm);

            if (profissional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            String fotoPath = profissional.get().getFoto();
            Path filePath = Paths.get(fotoPath); // Caminho da foto no servidor

            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            byte[] fotoBytes = Files.readAllBytes(filePath);

            String contentType = Files.probeContentType(filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(fotoBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}