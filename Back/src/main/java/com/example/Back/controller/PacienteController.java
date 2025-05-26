package com.example.Back.controller;

import com.example.Back.dto.PacienteEntradaDTO;
import com.example.Back.dto.PacienteSaidaDTO;
import com.example.Back.repository.PacienteRepository;
import com.example.Back.service.PacienteService;
import com.example.Back.config.FotoStorageProperties;
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
import java.nio.file.StandardCopyOption;
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

    @Autowired
    private FotoStorageProperties fotoStorageProperties;

    @PostMapping("/post")
    public ResponseEntity<Map<String, Object>> createPaciente(@RequestPart("foto") MultipartFile foto, @RequestPart("pacienteEntradaDTO") PacienteEntradaDTO pacienteDTO) {
        String fotoPath = saveFoto(foto);
        pacienteDTO.setFoto(fotoPath);
        ResponseEntity<?> responseEntity = pacienteService.salvarPaciente(pacienteDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("message", messageSource.getMessage("create.success", null, Locale.getDefault()));
        response.put("profissional", responseEntity.getBody());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public String saveFoto(MultipartFile foto) {
        String fileName = UUID.randomUUID().toString() + "_" + foto.getOriginalFilename();
        List<String> diretorios = fotoStorageProperties.getDiretoriosPaciente();

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
    @GetMapping("/get/id/{id}")
    public ResponseEntity<?> buscarPacientePorId(@PathVariable Long id) {
        Optional<PacienteSaidaDTO> pacienteDTO = pacienteService.buscarPorId(id);

        if (pacienteDTO.isPresent()) {
            return ResponseEntity.ok(pacienteDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Paciente não encontrado com o ID fornecido.");
        }
    }
    @GetMapping("/get/cpf/{cpf}")
    public ResponseEntity<?> buscarPacientePorCpf(@PathVariable String cpf) {
        Optional<PacienteSaidaDTO> pacienteDTO = pacienteService.buscarPorCpf(cpf);

        if (pacienteDTO.isPresent()) {
            return ResponseEntity.ok(pacienteDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Paciente não encontrado com o CPF fornecido.");
        }
    }
    @GetMapping("/get/nome/{nome}")
    public ResponseEntity<?> buscarPacientePorNome(@PathVariable String nome) {
        List<PacienteSaidaDTO> pacientes = pacienteService.buscarPorNome(nome);

        if (pacientes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Nenhum paciente encontrado com o nome fornecido.");
        } else {
            return ResponseEntity.ok(pacientes);
        }
    }



    @PutMapping("/update/{id}")
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