package com.example.Back.controller;

import com.example.Back.DTO.PacienteEntradaDTO;
import com.example.Back.DTO.PacienteLoginDTO;
import com.example.Back.DTO.PacienteSaidaDTO;
import com.example.Back.Service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/paciente")
public class PacienteController {

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
    public ResponseEntity<Map<String, Object>> createPaciente(@RequestBody PacienteEntradaDTO pacienteDTO) {
        ResponseEntity<PacienteSaidaDTO> responseEntity = pacienteService.salvarPaciente(pacienteDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("message", messageSource.getMessage("create.success", null, Locale.getDefault()));
        response.put("paciente", responseEntity.getBody());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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