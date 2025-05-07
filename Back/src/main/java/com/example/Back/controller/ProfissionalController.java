package com.example.Back.controller;

import com.example.Back.DTO.ProfissionalEntradaDTO;
import com.example.Back.DTO.ProfissionalLoginDTO;
import com.example.Back.DTO.ProfissionalSaidaDTO;
import com.example.Back.Service.ProfissionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("profissional")
public class ProfissionalController {

    @Autowired
    private ProfissionalService proService;

    @Autowired
    private MessageSource messageSource;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authenticateUser(@RequestBody ProfissionalLoginDTO loginDTO) {
        Map<String, Object> response = new HashMap<>();
        boolean isAuthenticated = proService.authenticateUser(loginDTO);

        if (isAuthenticated) {
            response.put("message", messageSource.getMessage("login.success", null, Locale.getDefault()));
            return ResponseEntity.ok(response);
        } else {
            response.put("message", messageSource.getMessage("login.error", null, Locale.getDefault()));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/post")
    public ResponseEntity<Map<String, Object>> createProfissional(@RequestBody ProfissionalEntradaDTO profissionalDTO) {
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
}
