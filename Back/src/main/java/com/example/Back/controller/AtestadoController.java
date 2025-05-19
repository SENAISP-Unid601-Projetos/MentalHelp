package com.example.Back.controller;

import com.example.Back.DTO.AtestadoEntradaDTO;
import com.example.Back.DTO.AtestadoSaidaDTO;
import com.example.Back.Service.AtestadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/atestados")
@RequiredArgsConstructor
public class AtestadoController {

    private final AtestadoService atestadoService;

    @PostMapping
    public ResponseEntity<AtestadoSaidaDTO> criarAtestado(@RequestBody AtestadoEntradaDTO dto) {
        return ResponseEntity.ok(atestadoService.salvarAtestado(dto));
    }

    @GetMapping
    public ResponseEntity<List<AtestadoSaidaDTO>> listarAtestados() {
        return ResponseEntity.ok(atestadoService.listarAtestados());
    }
}
