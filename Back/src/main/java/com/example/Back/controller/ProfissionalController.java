package com.example.Back.controller;

import com.example.Back.Repository.ProfissionalRepository;
import com.example.Back.entity.Profissional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("profissional")
public class ProfissionalController {

    @Autowired
    ProfissionalRepository Prof;

    @PostMapping("/login")
    public ResponseEntity<String> loginProfissional(@RequestBody Profissional loginReq) {
        String email = loginReq.getEmail();
        String senha = loginReq.getSenha();
    }

    @PostMapping("/post")
    public ResponseEntity<String> createProfissional(@RequestBody Profissional p) {
        Prof.save(p);
        return ResponseEntity.ok("CRIADO");

    }

    @GetMapping("/get")
    public ResponseEntity<List<Profissional>> getProffisional() {
        List<Profissional> ProfList = Prof.findAll();
        return new ResponseEntity(ProfList, HttpStatus.OK);

    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<String> deleteProfissional(@RequestParam Long idProfissional) {
        Prof.deleteById(idProfissional);
        return ResponseEntity.ok("DELETADO");
    }


}
