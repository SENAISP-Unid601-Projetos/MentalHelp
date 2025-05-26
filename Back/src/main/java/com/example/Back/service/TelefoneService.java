package com.example.Back.service;

import com.example.Back.dto.TelefoneDTO;
import com.example.Back.repository.PacienteRepository;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Telefone;
import com.example.Back.repository.TelefoneRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TelefoneService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private TelefoneRepository telefoneRepository;

    private TelefoneDTO toDTO(Telefone telefone) {
        TelefoneDTO dto = new TelefoneDTO();
        dto.setTelefone(telefone.getTelefone());
        dto.setTipo(telefone.getTipo());
        dto.setIdPaciente(telefone.getPaciente().getIdPaciente());
        return dto;
    }

    private Telefone toEntity(TelefoneDTO dto) {
        Telefone telefone = new Telefone();
        telefone.setTelefone(dto.getTelefone());
        telefone.setTipo(dto.getTipo());
        telefone.setPaciente(pacienteRepository.findById(dto.getIdPaciente()).get());
        return telefone;
    }

    @Transactional
    public ResponseEntity<TelefoneDTO> criarTelefone(TelefoneDTO telefoneDTO) {
        if (telefoneDTO.getTelefone() == null || telefoneRepository.existsById(telefoneDTO.getTelefone())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Paciente> pacienteOpt = pacienteRepository.findById(telefoneDTO.getIdPaciente());
        if (pacienteOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Paciente paciente = pacienteOpt.get();

        Telefone telefone = toEntity(telefoneDTO);
        Telefone novoTelefone = telefoneRepository.save(telefone);

        paciente.getTelefones().add(novoTelefone);
        pacienteRepository.save(paciente);
        return new ResponseEntity<>(toDTO(novoTelefone), HttpStatus.CREATED);
    }

    public ResponseEntity<List<TelefoneDTO>> listarTelefones() {
        List<TelefoneDTO> telefones = telefoneRepository.findAll()
                .stream()
                .map(telefone -> toDTO(telefone))
                .collect(Collectors.toList());
        return new ResponseEntity<>(telefones, HttpStatus.OK);
    }

    public ResponseEntity<TelefoneDTO> buscarTelefonePorNumero(String numero) {
        Optional<Telefone> telefone = telefoneRepository.findById(numero);
        if (telefone.isPresent()) {
            return new ResponseEntity<>(toDTO(telefone.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    public ResponseEntity<TelefoneDTO> atualizarTelefone(String numero, TelefoneDTO telefoneDTO) {
        Optional<Telefone> telefoneOpt = telefoneRepository.findById(numero);
        if (telefoneOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<Paciente> pacienteOpt = pacienteRepository.findById(telefoneDTO.getIdPaciente());
        if (pacienteOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Telefone telefone = telefoneOpt.get();
        Paciente novoPaciente = pacienteOpt.get();
        Paciente pacienteAntigo = telefone.getPaciente();

        if (pacienteAntigo != null && !pacienteAntigo.equals(novoPaciente)) {
            pacienteAntigo.getTelefones().remove(telefone);
            pacienteRepository.save(pacienteAntigo);
        }

        telefone.setTipo(telefoneDTO.getTipo());
        telefone.setPaciente(novoPaciente);

        if (!novoPaciente.getTelefones().contains(telefone)) {
            novoPaciente.getTelefones().add(telefone);
        }

        telefoneRepository.save(telefone);
        pacienteRepository.save(novoPaciente);
        return new ResponseEntity<>(toDTO(telefone), HttpStatus.OK);
    }

    public ResponseEntity<Void> deletarTelefone(String numero) {
        if (telefoneRepository.existsById(numero)) {
            telefoneRepository.deleteById(numero);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<TelefoneDTO>> buscarTelefonesPorPaciente(Long idPaciente) {
        List<TelefoneDTO> telefones = telefoneRepository.findByPaciente(pacienteRepository.findById(idPaciente).get())
                .stream()
                .map(telefone -> toDTO(telefone))
                .collect(Collectors.toList());
        return new ResponseEntity<>(telefones, HttpStatus.OK);
    }
}