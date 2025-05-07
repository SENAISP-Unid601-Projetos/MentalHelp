package com.example.Back.controller;

import com.example.Back.DTO.ProfissionalDTO;
import com.example.Back.DTO.ProfissionalLoginDTO;
import com.example.Back.Service.ProfissionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profissional")
public class ProfissionalController {

    @Autowired
    private ProfissionalService proService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authenticateUser(@RequestBody ProfissionalLoginDTO loginDTO) {
        Map<String, Object> response = new HashMap<>();
        boolean isAuthenticated = proService.authenticateUser(loginDTO);

        if (isAuthenticated) {
            response.put("message", "Authentication successful");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/post")
    public ResponseEntity<Map<String, String>> createProfissional(@RequestBody ProfissionalDTO profissionalDTO) {
        String result = String.valueOf(proService.salvarProfissional(profissionalDTO));
        Map<String, String> response = new HashMap<>();
        response.put("message", result);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProfissionalDTO>> getProfissionais() {
        List<ProfissionalDTO> profissionais = proService.listarProfissional().getBody();
        return ResponseEntity.ok(profissionais);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProfissional(@PathVariable Long id) {
        boolean deleted = proService.deletarProfissional(id).hasBody();
        Map<String, String> response = new HashMap<>();
        if (deleted) {
            response.put("message", "Profissional deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Profissional not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}