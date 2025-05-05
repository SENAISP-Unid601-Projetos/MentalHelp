package com.example.Back.Service;

import com.example.Back.DTO.TelefoneDTO;
import com.example.Back.Repository.PacienteRepository;
import com.example.Back.entity.Telefone;
import com.example.Back.Repository.TelefoneRepository;
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
        telefone.setPaciente(PacienteRepository.findByIdPaciente(dto.getIdPaciente()).get());
        return telefone;
    }

    public ResponseEntity<TelefoneDTO> criarTelefone(TelefoneDTO telefoneDTO) {
        if (telefoneDTO.getTelefone() == null || telefoneRepository.existsById(telefoneDTO.getTelefone())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Telefone telefone = toEntity(telefoneDTO);
        Telefone novoTelefone = telefoneRepository.save(telefone);
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

    public ResponseEntity<TelefoneDTO> atualizarTelefone(String numero, TelefoneDTO telefoneDTO) {
        Optional<Telefone> telefoneExistente = telefoneRepository.findById(numero);
        if (telefoneExistente.isPresent()) {
            Telefone telefone = telefoneExistente.get();
            telefone.setTipo(telefoneDTO.getTipo());
            telefone.setIdPaciente(telefoneDTO.getIdPaciente());
            Telefone telefoneSalvo = telefoneRepository.save(telefone);
            return new ResponseEntity<>(toDTO(telefoneSalvo), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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
        List<TelefoneDTO> telefones = telefoneRepository.findByIdPaciente(idPaciente)
                .stream()
                .map(telefone -> toDTO(telefone))
                .collect(Collectors.toList());
        return new ResponseEntity<>(telefones, HttpStatus.OK);
    }
}