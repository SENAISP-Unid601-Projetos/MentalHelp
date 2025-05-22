package com.example.Back.service;

import com.example.Back.repository.PacienteRepository;
import com.example.Back.repository.ProfissionalRepository;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Profissional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    //sem user details, password encoder, etc.
    public String autenticar(String identificador, String senha){
        Optional<Paciente> paciente = pacienteRepository.findByEmail(identificador);
        if(paciente.isPresent() && paciente.get().getSenha().matches(senha)){
            return paciente.get().getNome();
        }

        Optional<Profissional> profissional = profissionalRepository.findByEmail(identificador);
        if(profissional.isPresent() && profissional.get().getSenha().matches(senha)){
            return profissional.get().getNome();
        }

        return null;
    }
}
