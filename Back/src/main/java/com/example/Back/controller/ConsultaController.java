package com.example.Back.controller;

import com.example.Back.dto.ConsultaDTO;
import com.example.Back.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/consultas")
public class ConsultaController {

    @Autowired
    ConsultaService consultaService;

    @Autowired
    private MessageSource messageSource;

    @PostMapping("/post")
    public ResponseEntity<Map<String, Object>> createConsulta(@RequestBody ConsultaDTO consultaDTO) {
        ConsultaDTO novaConsulta = consultaService.criarConsulta(consultaDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("message", messageSource.getMessage("create.success", null, Locale.getDefault()));
        response.put("consulta", novaConsulta);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/get")
    public ResponseEntity<List<ConsultaDTO>> getConsulta() {
        return consultaService.listarConsultas();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ConsultaDTO>> getConsultasByPacienteAndData(
            @RequestParam(required = false) Long idPaciente,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime data) {
        if (idPaciente != null && data != null) {
            return consultaService.buscarConsultasPorPacienteEData(idPaciente, data);
        } else if (idPaciente != null) {
            return consultaService.buscarConsultasPorPaciente(idPaciente);
        } else if (data != null) {
            return consultaService.buscarConsultasPorData(data);
        } else {
            return consultaService.listarConsultas();
        }
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