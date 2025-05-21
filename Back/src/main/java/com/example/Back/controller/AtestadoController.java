package com.example.Back.controller;

import com.example.Back.DTO.AtestadoSaidaDTO;
import com.example.Back.Service.AtestadoService;
import com.example.Back.entity.Atestado;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/atestado")
public class AtestadoController {

    private final AtestadoService atestadoService;

    public AtestadoController(AtestadoService atestadoService) {
        this.atestadoService = atestadoService;
    }

    @PostMapping("/criar/{idConsulta}")
    public ResponseEntity<Atestado> criarAtestado(@PathVariable Long idConsulta) {
        try {
            Atestado novo = atestadoService.criarAtestado(idConsulta);
            return ResponseEntity.ok(novo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/{idConsulta}")
    public ResponseEntity<byte[]> gerarAtestado(@PathVariable Long idConsulta) {
        try {
            byte[] pdfBytes = atestadoService.gerarAtestadoPDF(idConsulta);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=atestado.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace(); // Para logar o erro no console
            return ResponseEntity.status(500).body(null);
        }
    }

}
