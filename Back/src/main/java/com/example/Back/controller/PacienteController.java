package com.example.Back.controller;

import com.example.Back.entity.Paciente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pacientes")
@CrossOrigin("*")
public class PacienteController {


    @GetMapping
    public ResponseEntity<List<Paciente>> listAll() {
        return ResponseEntity.ok(pacienteService.listAll());
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Paciente> buscarPorId(@PathVariable Long id) {
        Optional<Paciente> paciente = pacienteService.buscarPorId(id);
        return paciente.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Paciente> salvar (@RequestBody Paciente paciente) {
        return new ResponseEntity<>(pacienteService.salvar(paciente), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Long id, @RequestBody Paciente paciente) {
        return ResponseEntity.ok(pacienteService.atualizar(id, paciente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pacienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }

}
