/*package com.example.Back.controller;

import com.example.Back.Repository.PacienteRepository;
import com.example.Back.Service.PacienteService;
import com.example.Back.entity.Paciente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/paciente")
public class PacienteController {


    @Autowired
    PacienteService pacienteServ;


    @GetMapping
    public ResponseEntity<List<Paciente>> listAll() {
        return ResponseEntity.ok(pacienteServ.listAll());
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Paciente> buscarPorId(@PathVariable Long id) {
        Optional<Paciente> paciente = pacienteServ.buscarPorId(id);
        return paciente.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginPaciente (@RequestBody Paciente loginReq) {
        String email = loginReq.getEmail();
        String senha = loginReq.getSenha();
        if (email == null || senha == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email e senha são obrigatórios!");
        }
        Optional<Paciente> pacienteOpt = pacienteServ.findByEmail(email);
        if (pacienteOpt.isPresent() && pacienteOpt.get().getSenha().equals(senha)) {
            return ResponseEntity.ok("{\"message\": \"Login bem-sucedido! Bem-vindo, " + email + "\"}");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos!");
    }

    @PostMapping("/post")
    public ResponseEntity<Paciente> salvar (@RequestBody Paciente paciente) {
        return ResponseEntity.ok(pacienteServ.create(paciente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Long id, @RequestBody Paciente paciente) {
        return ResponseEntity.ok(pacienteServ.atualizar(id, paciente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pacienteServ.deletar(id);
        return ResponseEntity.noContent().build();
    }

}
*/