package com.example.Back.controller;

import com.example.Back.service.AtestadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/atestado")
public class AtestadoController {

    @Autowired
    private AtestadoService atestadoService;

    @GetMapping("/{idConsulta}")
    public ResponseEntity<byte[]> gerarAtestado(@PathVariable Long idConsulta) {
        try {
            byte[] pdfBytes = atestadoService.gerarAtestadoPDF(idConsulta);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=atestado.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
