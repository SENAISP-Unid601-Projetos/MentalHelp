package com.example.Back.controller;

import com.example.Back.DTO.PacienteSaidaDTO;
import com.example.Back.Repository.PacienteRepository;
import com.example.Back.Service.PacienteService;
import com.example.Back.entity.Paciente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/pacientes")
@CrossOrigin("*")
public class PacienteController {

    @Autowired
    PacienteService pacienteService;
    PacienteRepository pacienteRepository;
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

    @PostMapping
    public ResponseEntity<PacienteSaidaDTO> createUser(@RequestParam("foto") MultipartFile foto,
                                                  @RequestPart("usuarioDTO") PacienteSaidaDTO pacienteSaidaDTO) {
        String fotoPac = saveFoto(foto);
        PacienteSaidaDTO.setFoto(fotoPac);
        PacienteSaidaDTO savedPacienteDTO = pacienteService.salvarPaciente(pacienteSaidaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPacienteDTO);
    }

    @GetMapping("/foto/{nome}")
    public ResponseEntity<byte[]> getFoto(@PathVariable String nome) {
        try {
            Optional<Paciente> paciente = pacienteRepository.findByName(nome);

            if (paciente.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            String fotoPath = paciente.get().getFotoPac();
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











    @GetMapping
    public ResponseEntity<List<Paciente>> listAll() {
        return ResponseEntity.ok(pacienteService.listAll());
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Paciente> buscarPorId(@PathVariable Long id) {
        Optional<Paciente> paciente = pacienteService.buscarPorId(id);
        return paciente.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Paciente> salvar (@RequestBody Paciente paciente) {
        return new ResponseEntity<>(pacienteService.salvar(paciente), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Long id, @RequestBody Paciente paciente) {
        return ResponseEntity.ok(pacienteService.atualizar(id, paciente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pacienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }

}
