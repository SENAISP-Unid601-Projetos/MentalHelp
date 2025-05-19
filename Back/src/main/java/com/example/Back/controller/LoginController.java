package com.example.Back.controller;

import com.example.Back.DTO.LoginRequest;
import com.example.Back.Service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class LoginController {
    @Autowired
    private LoginService loginService;

    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest){
        String nome = loginService.autenticar(loginRequest.getCrmOuCpf(), loginRequest.getSenha());

        if (nome != null) {
            return ResponseEntity.ok(nome);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas.");
        }
    }
}
