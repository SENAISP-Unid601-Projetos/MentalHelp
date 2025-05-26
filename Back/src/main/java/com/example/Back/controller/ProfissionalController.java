package com.example.Back.controller;

import com.example.Back.dto.PacienteSaidaDTO;
import com.example.Back.dto.ProfissionalEntradaDTO;
import com.example.Back.dto.ProfissionalSaidaDTO;
import com.example.Back.repository.ProfissionalRepository;
import com.example.Back.service.ProfissionalService;
import com.example.Back.config.FotoStorageProperties;
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
import java.nio.file.StandardCopyOption;
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

    @Autowired
    private FotoStorageProperties fotoStorageProperties;

    @PostMapping("/post")
    public ResponseEntity<Map<String, Object>> createProfissional(@RequestPart("foto") MultipartFile foto, @RequestPart("profissionalEntradaDTO") ProfissionalEntradaDTO profissionalDTO) {
        String fotoPath = saveFoto(foto);
        profissionalDTO.setFoto(fotoPath);
        ResponseEntity<?> responseEntity = proService.salvarProfissional(profissionalDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("message", messageSource.getMessage("create.success", null, Locale.getDefault()));
        response.put("profissional", responseEntity.getBody());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProfissionalSaidaDTO>> getProfissionais() {
        return proService.listarProfissional();
    }

    // GET por ID
    @GetMapping("/get/id/{id}")
    public ResponseEntity<?> getProfissionalById(@PathVariable Long id) {
        Optional<ProfissionalSaidaDTO> profissionalDTO = proService.buscarProfissionalPorId(id);

        if (profissionalDTO.isPresent()) {
            return ResponseEntity.ok(profissionalDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Profissional não encontrado com o ID fornecido.");
        }
    }

    // GET por CRM
    @GetMapping("/get/crm/{crm}")
    public ResponseEntity<?> getProfissionalByCrm(@PathVariable String crm) {
        Optional<ProfissionalSaidaDTO> profissionalDTO = proService.buscarProfissionalPorCrm(crm);

        if (profissionalDTO.isPresent()) {
            return ResponseEntity.ok(profissionalDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Profissional não encontrado com o CRM fornecido.");
        }
    }

    // GET por Especialidade
    @GetMapping("/get/especialidade/{especialidade}")
    public ResponseEntity<?> getProfissionaisByEspecialidade(@PathVariable String especialidade) {
        List<ProfissionalSaidaDTO> profissionais = proService.buscarProfissionaisPorEspecialidade(especialidade);

        if (profissionais.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Nenhum profissional encontrado com a especialidade fornecida.");
        } else {
            return ResponseEntity.ok(profissionais);
        }
    }

    @PutMapping("/update/{id}")
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

    public String saveFoto(MultipartFile foto) {
        String fileName = UUID.randomUUID().toString() + "_" + foto.getOriginalFilename();
        List<String> diretorios = fotoStorageProperties.getDiretoriosProfissional();

        for (String dir : diretorios) {
            try {
                Path uploadPath = Paths.get(dir.trim());

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Path filePath = uploadPath.resolve(fileName);
                Files.copy(foto.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                return filePath.toString();
            } catch (IOException e) {
                System.err.println("Erro ao salvar em " + dir + ": " + e.getMessage());
            }
        }

        throw new RuntimeException("Falha ao salvar a foto nos diretórios configurados.");
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