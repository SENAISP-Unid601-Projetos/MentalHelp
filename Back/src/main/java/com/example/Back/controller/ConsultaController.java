package com.example.Back.controller;

import com.example.Back.DTO.ConsultaDTO;
i
import com.example.Back.Service.ConsultaService;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService consultaService;

    @Autowired
    private MessageSource messageSource;

    @PostMapping("/post")
    public ResponseEntity<Map<String, Object>> createConsulta(@RequestBody ConsultaDTO consultaDTO) {
        ResponseEntity<ConsultaDTO> responseEntity = consultaService.criarConsulta(consultaDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("message", messageSource.getMessage("create.success", null, Locale.getDefault()));
        response.put("consulta", responseEntity.getBody());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get")
    public ResponseEntity<List<ConsultaDTO>> getConsulta() {
        return consultaService.listarConsultas();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateConsulta(@PathVariable Long id, @RequestBody ConsultaDTO consultaDTO) {
        ResponseEntity<ConsultaDTO> responseEntity = consultaService.atualizarConsulta(id, consultaDTO);
        Map<String, Object> response = new HashMap<>();
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            response.put("message", messageSource.getMessage("update.success", null, Locale.getDefault()));
            response.put("consulta", responseEntity.getBody());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", messageSource.getMessage("update.notfound", null, Locale.getDefault()));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteConsulta(@PathVariable Long id) {
        ResponseEntity<Void> responseEntity = consultaService.deletarConsulta(id);
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