package com.example.Back.controller;

import com.example.Back.DTO.ProfissionalDTO;
import com.example.Back.DTO.ProfissionalLoginDTO;
import com.example.Back.Repository.ProfissionalRepository;
import com.example.Back.Service.ProfissionalService;
import com.example.Back.entity.Profissional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("profissional")
public class ProfissionalController {

    @Autowired
    ProfissionalRepository Prof;

    ProfissionalService ProService;
    ProfissionalDTO ProDto;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authenticateUser(@RequestBody ProfissionalLoginDTO loginDTO, Locale locale) {
        boolean isAuthenticated = ProfissionalService.authenticateUser(loginDTO);

        Map<String, Object> response = new HashMap<>();

        if (isAuthenticated) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/post")
    public ResponseEntity<String> createProfissional(@RequestBody ProfissionalDTO p) {
        String savedProfissionalDTO = ProService.salvarProfissional(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProfissionalDTO);
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProfissionalDTO>> getProfissional() {
        List<ProfissionalDTO> profissionais = ProService.listarProfissional();
        return new ResponseEntity<>(profissionais, HttpStatus.OK);
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<String> deleteProfissional(@RequestParam Long idProfissional) {
        Prof.deleteById(idProfissional);
        return ResponseEntity.ok("DELETADO");
    }


}
