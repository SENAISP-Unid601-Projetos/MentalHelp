package com.example.Back.controller;

import com.example.Back.Service.AtestadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AtestadoController {

    @Autowired
    private AtestadoService atestadoService;

    @GetMapping("/gerarAtestado/{idConsulta}")
    public ResponseEntity<byte[]> gerarAtestado(@PathVariable Long idConsulta) {
        try {
            // Gerar o PDF do atestado
            byte[] pdfBytes = atestadoService.gerarAtestadoPDF(idConsulta);

            // Configurar o cabeçalho para download do arquivo
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=atestado_" + idConsulta + ".pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            // Se houver erro ao gerar o atestado, retornar erro 500
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
