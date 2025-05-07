package com.example.Back.Service;

import com.example.Back.Repository.PacienteRepository;
import com.example.Back.Repository.TelefoneRepository;
import com.example.Back.entity.Paciente;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final TelefoneRepository telefoneRepository;

    public List<Paciente> listAll() {
        return pacienteRepository.findAll();
    }

    public Optional<Paciente> buscarPorId(Long id) {
        return pacienteRepository.findById(id);
    }

    public Paciente salvar(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    public Paciente atualizar(Long id, Paciente paciente) {
        Optional<Paciente> existente = pacienteRepository.findById(id);
        if (existente.isPresent()) {
            paciente.setIdPaciente(id);
            return pacienteRepository.save(paciente);
        } else {
            throw new RuntimeException("Paciente não encontrado com ID: " + id);
        }
    }

    public void deletar(Long id) {
        pacienteRepository.deleteById(id);
    }

    // Os outros métodos baseados em DTOs podem continuar aqui
}
