package com.example.Back.Service;

import com.example.Back.Repository.PacienteRepository;
import com.example.Back.Repository.ProfissionalRepository;
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
    public boolean Autenticar(String identificador, String senha){
        Optional<Paciente> paciente = pacienteRepository.findByCpf(identificador);
        if(paciente.isPresent() && paciente.get().getSenha().matches(senha)){
            return true;
        }

        Optional<Profissional> profissional = profissionalRepository.findByEmail(identificador);
        if(profissional.isPresent() && profissional.get().getSenha().matches(senha)){
            return true;
        }

        Optional<Paciente> pacientePeloEmail = pacienteRepository.findByEmail(identificador);
        if(paciente.isPresent() && paciente.get().getSenha().matches(senha)){
            return true;
        }

        return false;
    }
}
