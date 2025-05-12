package com.example.Back.controller;

import com.example.Back.DTO.PacienteEntradaDTO;
import com.example.Back.DTO.PacienteLoginDTO;
import com.example.Back.DTO.PacienteSaidaDTO;
import com.example.Back.Repository.PacienteRepository;
import com.example.Back.Repository.ProfissionalRepository;
import com.example.Back.Service.PacienteService;
import com.example.Back.entity.Paciente;
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
@RequestMapping("/paciente")
public class PacienteController {

    @Autowired
    PacienteRepository pacienteRepository;

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private MessageSource messageSource;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authenticateUser(@RequestBody PacienteLoginDTO loginDTO) {
        Map<String, Object> response = new HashMap<>();
        boolean isAuthenticated = pacienteService.authenticateUser(loginDTO);

        if (isAuthenticated) {
            response.put("message", messageSource.getMessage("login.success", null, Locale.getDefault()));
            return ResponseEntity.ok(response);
        } else {
            response.put("message", messageSource.getMessage("login.error", null, Locale.getDefault()));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/post")
    public ResponseEntity<Map<String, Object>> createPaciente(@RequestPart("foto") MultipartFile foto, @RequestPart("pacienteEntradaDTO") PacienteEntradaDTO pacienteDTO) {
        String fotoPath = saveFoto(foto);
        pacienteDTO.setFoto(fotoPath);
        ResponseEntity<PacienteSaidaDTO> responseEntity = pacienteService.salvarPaciente(pacienteDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("message", messageSource.getMessage("create.success", null, Locale.getDefault()));
        response.put("profissional", responseEntity.getBody());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    private String saveFoto(MultipartFile foto) {
        // Gera um nome único para o arquivo
        String fileName = UUID.randomUUID().toString() + "_" + foto.getOriginalFilename();
        String uploadDir = "src/main/resources/pacientePictures/";  // Diretório onde as fotos serão armazenadas

        try {
            Files.copy(foto.getInputStream(), Paths.get(uploadDir + fileName));
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Falha ao salvar a foto.");
        }
        return uploadDir + fileName;
    }

    @GetMapping("/foto/{cpf}")
    public ResponseEntity<byte[]> getFoto(@PathVariable String cpf) {
        try {
            Optional<Paciente> paciente = pacienteRepository.findByCpf(cpf);

            if (paciente.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            String fotoPath = paciente.get().getFoto();
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

    @GetMapping("/get")
    public ResponseEntity<List<PacienteSaidaDTO>> getPacientes() {
        return pacienteService.listarPaciente();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePaciente(@PathVariable Long id, @RequestBody PacienteEntradaDTO pacienteDTO) {
        ResponseEntity<PacienteSaidaDTO> responseEntity = pacienteService.atualizarPaciente(id, pacienteDTO);
        Map<String, Object> response = new HashMap<>();
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            response.put("message", messageSource.getMessage("update.success", null, Locale.getDefault()));
            response.put("paciente", responseEntity.getBody());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", messageSource.getMessage("update.notfound", null, Locale.getDefault()));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePaciente(@PathVariable Long id) {
        ResponseEntity<Void> responseEntity = pacienteService.deletarPaciente(id);
        Map<String, Object> response = new HashMap<>();
        if (responseEntity.getStatusCode() == HttpStatus.NO_CONTENT) {
            response.put("message", messageSource.getMessage("delete.success", null, Locale.getDefault()));
            return ResponseEntity.ok(response);
        } else {
            response.put("message", messageSource.getMessage("update.notfound", null, Locale.getDefault()));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}