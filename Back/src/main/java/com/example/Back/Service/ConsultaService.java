package com.example.Back.service;

import com.example.Back.DTO.ConsultaDTO;
import com.example.Back.entity.Consulta;
import com.example.Back.Repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    private ConsultaDTO toDTO(Consulta consulta) {
        ConsultaDTO dto = new ConsultaDTO();
        dto.setIdConsulta(consulta.getIdConsulta());
        dto.setData(consulta.getData());
        dto.setValorConsulta(consulta.getValorConsulta());
        dto.setIdPaciente(consulta.getIdPaciente());
        dto.setIdProfissional(consulta.getIdProfissional());
        return dto;
    }

    private Consulta toEntity(ConsultaDTO dto) {
        Consulta consulta = new Consulta();
        consulta.setIdConsulta(dto.getIdConsulta());
        consulta.setData(dto.getData());
        consulta.setValorConsulta(dto.getValorConsulta());
        consulta.setIdPaciente(dto.getIdPaciente());
        consulta.setIdProfissional(dto.getIdProfissional());
        return consulta;
    }

    public ResponseEntity<ConsultaDTO> criarConsulta(ConsultaDTO consultaDTO) {
        Consulta consulta = toEntity(consultaDTO);
        Consulta novaConsulta = consultaRepository.save(consulta);
        return new ResponseEntity<>(toDTO(novaConsulta), HttpStatus.CREATED);
    }

    public ResponseEntity<List<ConsultaDTO>> listarConsultas() {
        List<ConsultaDTO> consultas = consultaRepository.findAll()
                .stream()
                .map(consulta -> toDTO(consulta))
                .collect(Collectors.toList());
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }

    public ResponseEntity<ConsultaDTO> buscarConsultaPorId(Long id) {
        Optional<Consulta> consulta = consultaRepository.findById(id);
        if (consulta.isPresent()) {
            return new ResponseEntity<>(toDTO(consulta.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<ConsultaDTO> atualizarConsulta(Long id, ConsultaDTO consultaDTO) {
        Optional<Consulta> consultaExistente = consultaRepository.findById(id);
        if (consultaExistente.isPresent()) {
            Consulta consulta = consultaExistente.get();
            consulta.setData(consultaDTO.getData());
            consulta.setValorConsulta(consultaDTO.getValorConsulta());
            consulta.setIdPaciente(consultaDTO.getIdPaciente());
            consulta.setIdProfissional(consultaDTO.getIdProfissional());
            Consulta consultaSalva = consultaRepository.save(consulta);
            return new ResponseEntity<>(toDTO(consultaSalva), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Void> deletarConsulta(Long id) {
        if (consultaRepository.existsById(id)) {
            consultaRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<ConsultaDTO>> buscarConsultasPorPaciente(Long idPaciente) {
        List<ConsultaDTO> consultas = consultaRepository.findByIdPaciente(idPaciente)
                .stream()
                .map(consulta -> toDTO((Consulta) consulta))
                .collect(Collectors.toList());
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }

    public ResponseEntity<List<ConsultaDTO>> buscarConsultasPorProfissional(Long idProfissional) {
        List<ConsultaDTO> consultas = consultaRepository.findByIdProfissional(idProfissional)
                .stream()
                .map(consulta -> toDTO((Consulta) consulta))
                .collect(Collectors.toList());
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }

    public ResponseEntity<List<ConsultaDTO>> buscarConsultasPorData(LocalDate data) {
        List<ConsultaDTO> consultas = consultaRepository.findByData(data)
                .stream()
                .map(consulta -> toDTO((Consulta) consulta))
                .collect(Collectors.toList());
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }
}