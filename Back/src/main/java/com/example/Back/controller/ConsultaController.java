package com.example.Back.controller;

import com.example.Back.DTO.ConsultaDTO;
import com.example.Back.Service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/consultas")
public class ConsultaController {

    @Autowired
    ConsultaService consultaService;

    @PostMapping
    public ResponseEntity<String> createConsulta(@RequestBody ConsultaDTO c){
        consultaService.criarConsulta(c);
    }

    @GetMapping

    @PutMapping

    @DeleteMapping
}
