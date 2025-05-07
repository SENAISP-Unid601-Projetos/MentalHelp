package com.example.Back.controller;

import com.example.Back.DTO.ConsultaDTO;
import com.example.Back.Service.ConsultaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService consultaService;

    /** Criar nova consulta */
    @PostMapping
    public ResponseEntity<ConsultaDTO> createConsulta(@RequestBody ConsultaDTO dto) {
        return consultaService.criarConsulta(dto);
    }

    /** Listar todas as consultas */
    @GetMapping
    public ResponseEntity<List<ConsultaDTO>> listAll() {
        return consultaService.listarConsultas();
    }

    /** Buscar consulta por ID */
    @GetMapping("/{id}")
    public ResponseEntity<ConsultaDTO> getById(@PathVariable Long id) {
        return consultaService.buscarConsultaPorId(id);
    }

    /** Atualizar consulta existente */
    @PutMapping("/{id}")
    public ResponseEntity<ConsultaDTO> updateConsulta(
            @PathVariable Long id,
            @RequestBody ConsultaDTO dto) {
        return consultaService.atualizarConsulta(id, dto);
    }

    /** Deletar consulta por ID */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsulta(@PathVariable Long id) {
        return consultaService.deletarConsulta(id);
    }

    /** Filtrar consultas por ID de paciente */
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<ConsultaDTO>> getByPaciente(@PathVariable Long idPaciente) {
        return consultaService.buscarConsultasPorPaciente(idPaciente);
    }

    /** Filtrar consultas por ID de profissional */
    @GetMapping("/profissional/{idProfissional}")
    public ResponseEntity<List<ConsultaDTO>> getByProfissional(@PathVariable Long idProfissional) {
        return consultaService.buscarConsultasPorProfissional(idProfissional);
    }

    /** Filtrar consultas por data (ISO-8601) */
    @GetMapping("/data")
    public ResponseEntity<List<ConsultaDTO>> getByData(
            @RequestParam("data")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime data) {
        return consultaService.buscarConsultasPorData(data);
    }
}
