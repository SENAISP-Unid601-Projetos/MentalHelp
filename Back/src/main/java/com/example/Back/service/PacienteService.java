package com.example.Back.service;
import com.example.Back.dto.*;
import com.example.Back.repository.PacienteRepository;
import com.example.Back.repository.TelefoneRepository;
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

    public ResponseEntity<?> salvarPaciente(PacienteEntradaDTO pacienteEntradaDTO) {
        if(pacienteEntradaDTO.getCpf().length() != 11){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("CPF deve conter exatamente 11 dígitos");
        }

        if (pacienteEntradaDTO.getSenha().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Senha deve ter pelo menos 6 caracteres");
        }

        if (!pacienteEntradaDTO.getEmail().matches("\\S+@\\S+\\.\\S+")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email inválido");
        }

        boolean cpfExiste = pacienteRepository.existsByCpf(pacienteEntradaDTO.getCpf());
        if(cpfExiste){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("CPF já cadastrado no sistema");
        }

        Paciente paciente = toEntity(pacienteEntradaDTO);
        pacienteRepository.save(paciente);
        return new ResponseEntity<>(toPacienteDTO(paciente), HttpStatus.CREATED);
    }

    public ResponseEntity<List<PacienteSaidaDTO>> listarPaciente() {
        List<PacienteSaidaDTO> pacientes = pacienteRepository.findAll()
                .stream()
                .map(paciente -> toPacienteDTO(paciente))
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
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    private PacienteSaidaDTO toPacienteDTO(Paciente paciente) {
        List<Consulta> consultas = paciente.getConsultas();

        List<Telefone> telefones = paciente.getTelefones();

        if(consultas == null && telefones != null){
            List<String> telefonesNum = telefones.stream()
                    .map(Telefone::getTelefone)
                    .collect(Collectors.toList());

            return new PacienteSaidaDTO(
                    paciente.getIdPaciente(),
                    paciente.getNome(),
                    paciente.getCpf(),
                    paciente.getEmail(),
                    paciente.getSenha(),
                    paciente.getFoto(),
                    paciente.getDataDeNascimento(),
                    null,
                    telefonesNum
            );
        } else if (consultas != null && telefones == null){
            List<Long> consultaIds = consultas.stream()
                    .map(Consulta::getIdConsulta)
                    .collect(Collectors.toList());

            return new PacienteSaidaDTO(
                    paciente.getIdPaciente(),
                    paciente.getNome(),
                    paciente.getCpf(),
                    paciente.getEmail(),
                    paciente.getSenha(),
                    paciente.getFoto(),
                    paciente.getDataDeNascimento(),
                    consultaIds,
                    null
            );
        } else if(consultas == null && telefones == null){
            return new PacienteSaidaDTO(
                    paciente.getIdPaciente(),
                    paciente.getNome(),
                    paciente.getCpf(),
                    paciente.getEmail(),
                    paciente.getSenha(),
                    paciente.getFoto(),
                    paciente.getDataDeNascimento(),
                    null,
                    null
            );
        } else{
            List<String> telefonesNum = telefones.stream()
                    .map(Telefone::getTelefone)
                    .collect(Collectors.toList());

            List<Long> consultaIds = consultas.stream()
                    .map(Consulta::getIdConsulta)
                    .collect(Collectors.toList());

            return new PacienteSaidaDTO(
                    paciente.getIdPaciente(),
                    paciente.getNome(),
                    paciente.getCpf(),
                    paciente.getEmail(),
                    paciente.getSenha(),
                    paciente.getFoto(),
                    paciente.getDataDeNascimento(),
                    consultaIds,
                    telefonesNum
            );
        }
    }
    private Paciente toEntity(PacienteEntradaDTO dto) {
        Paciente paciente = new Paciente();
        paciente.setNome(dto.getNome());
        paciente.setCpf(dto.getCpf());
        paciente.setEmail(dto.getEmail());
        paciente.setSenha(dto.getSenha());
        paciente.setFoto(dto.getFoto());
        paciente.setDataDeNascimento(dto.getDataDeNascimento());
        return paciente;
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
    public Optional<PacienteSaidaDTO> buscarPorId(Long id) {
        return pacienteRepository.findById(id)
                .map(this::toPacienteDTO);
    }

    public Optional<PacienteSaidaDTO> buscarPorCpf(String cpf) {
        return pacienteRepository.findByCpf(cpf)
                .map(this::toPacienteDTO);
    }

    public List<PacienteSaidaDTO> buscarPorNome(String nome) {
        return pacienteRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(this::toPacienteDTO)
                .collect(Collectors.toList());
    }

}