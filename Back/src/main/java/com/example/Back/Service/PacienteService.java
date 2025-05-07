package com.example.Back.Service;
import com.example.Back.DTO.PacienteEntradaDTO;
import com.example.Back.DTO.PacienteSaidaDTO;
import com.example.Back.Repository.PacienteRepository;
import com.example.Back.Repository.TelefoneRepository;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Telefone;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final TelefoneRepository telefoneRepository;

    @Transactional
    public PacienteSaidaDTO salvarPaciente(PacienteSaidaDTO dto) {
        Paciente paciente = new Paciente();
        paciente.setNome(dto.getNome());
        paciente.setCpf(dto.getCpf());
        paciente.setEmail(dto.getEmail());
        paciente.setSenha(dto.getSenha());

        List<Telefone> telefones = new ArrayList<>();
        if (dto.getId_telefones() != null) {
            for (Long telId : dto.getId_telefones()) {
                Optional<Telefone> optTelefone = telefoneRepository.findById(telId.toString());
                if (optTelefone.isPresent()) {
                    Telefone telefone = optTelefone.get();
                    telefone.setPaciente(paciente);
                    telefones.add(telefone);
                }
            }
        }

        paciente.setTelefones(telefones);
        paciente = pacienteRepository.save(paciente);

        return toDTO(paciente);
    }

    public PacienteSaidaDTO autenticar(PacienteEntradaDTO loginDTO) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findByEmailAndSenha(loginDTO.getEmail(), loginDTO.getSenha());
        return pacienteOpt.map(this::toDTO).orElse(null);
    }

    public List<PacienteSaidaDTO> listarTodos() {
        List<Paciente> pacientes = pacienteRepository.findAll();
        List<PacienteSaidaDTO> dtos = new ArrayList<>();
        for (Paciente paciente : pacientes) {
            dtos.add(toDTO(paciente));
        }
        return dtos;
    }

    private PacienteSaidaDTO toDTO(Paciente paciente) {
        List<Long> idsTelefones = new ArrayList<>();
        if (paciente.getTelefones() != null) {
            for (Telefone t : paciente.getTelefones()) {
                idsTelefones.add(Long.parseLong(t.getTelefone()));
            }
        }

        return new PacienteSaidaDTO(
                paciente.getIdPaciente(),
                paciente.getNome(),
                paciente.getCpf(),
                paciente.getEmail(),
                paciente.getSenha(),
                null, // consulta IDs se necessário
                idsTelefones
        );
    }
}
