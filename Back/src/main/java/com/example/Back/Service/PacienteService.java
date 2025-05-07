package com.example.Back.Service;

import com.example.Back.DTO.*;
import com.example.Back.Repository.PacienteRepository;
import com.example.Back.Repository.TelefoneRepository;
import com.example.Back.entity.Consulta;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Telefone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private TelefoneRepository telefoneRepository;

    public ResponseEntity<PacienteSaidaDTO> salvarPaciente(PacienteEntradaDTO pacienteEntradaDTO) {
        Paciente paciente = toEntity(pacienteEntradaDTO);
        pacienteRepository.save(paciente);
        return new ResponseEntity<>(toPacienteDTO(paciente), HttpStatus.CREATED);
    }

    public ResponseEntity<List<PacienteSaidaDTO>> listarPaciente() {
        List<PacienteSaidaDTO> pacientes = pacienteRepository.findAll()
                .stream()
                .map(this::toPacienteDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(pacientes, HttpStatus.OK);
    }

    public ResponseEntity<PacienteSaidaDTO> atualizarPaciente(Long idPaciente, PacienteEntradaDTO pacienteEntradaDTO) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findById(idPaciente);
        if (pacienteOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Paciente paciente = pacienteOpt.get();
        paciente.setNome(pacienteEntradaDTO.getNome());
        paciente.setCpf(pacienteEntradaDTO.getCpf());
        paciente.setEmail(pacienteEntradaDTO.getEmail());
        paciente.setSenha(pacienteEntradaDTO.getSenha());

        pacienteRepository.save(paciente);
        return new ResponseEntity<>(toPacienteDTO(paciente), HttpStatus.OK);
    }

    public ResponseEntity<Void> deletarPaciente(Long idPaciente) {
        if (pacienteRepository.existsById(idPaciente)) {
            pacienteRepository.deleteById(idPaciente);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    private PacienteSaidaDTO toPacienteDTO(Paciente paciente) {
        List<Telefone> telefones = paciente.getTelefones();
        List<Consulta> consultas = paciente.getConsultas();

        List<String> telefonesNum = telefones != null ?
                telefones.stream().map(Telefone::getTelefone).collect(Collectors.toList()) : null;

        List<Long> consultaIds = consultas != null ?
                consultas.stream().map(Consulta::getIdConsulta).collect(Collectors.toList()) : null;

        return new PacienteSaidaDTO(
                paciente.getIdPaciente(),
                paciente.getNome(),
                paciente.getCpf(),
                paciente.getEmail(),
                paciente.getSenha(),
                consultaIds,
                telefonesNum
        );
    }

    private Paciente toEntity(PacienteEntradaDTO dto) {
        return Paciente.builder()
                .nome(dto.getNome())
                .cpf(dto.getCpf())
                .email(dto.getEmail())
                .senha(dto.getSenha())
                .build();
    }

    public boolean authenticateUser(PacienteEntradaDTO pacienteLoginDTO) {
        return pacienteRepository.findByEmail(pacienteLoginDTO.getEmail())
                .map(paciente -> paciente.getSenha().equals(pacienteLoginDTO.getSenha()))
                .orElse(false);
    }
}