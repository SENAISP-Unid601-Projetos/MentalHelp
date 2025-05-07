package com.example.Back.Service;

import com.example.Back.DTO.ConsultaDTO;
import com.example.Back.Repository.PacienteRepository;
import com.example.Back.Repository.ProfissionalRepository;
import com.example.Back.entity.Consulta;
import com.example.Back.Repository.ConsultaRepository;

import com.example.Back.entity.Paciente;
import com.example.Back.entity.Profissional;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    private ConsultaDTO toDTO(Consulta consulta) {
        ConsultaDTO dto = new ConsultaDTO();
        dto.setIdConsulta(consulta.getIdConsulta());
        dto.setData(consulta.getData());
        dto.setValorConsulta(consulta.getValorConsulta());
        dto.setIdPaciente(consulta.getPaciente().getIdPaciente());
        dto.setIdProfissional(consulta.getProfissional().getIdProfissional());
        return dto;
    }

    private Consulta toEntity(ConsultaDTO dto) {
        Consulta consulta = new Consulta();
        consulta.setIdConsulta(dto.getIdConsulta());
        consulta.setData(dto.getData());
        consulta.setValorConsulta(dto.getValorConsulta());
        consulta.setPaciente(pacienteRepository.findById(dto.getIdPaciente()).orElseThrow(() -> new RuntimeException("Paciente não encontrado")));
        consulta.setProfissional(profissionalRepository.findById(dto.getIdProfissional()).orElseThrow(() -> new RuntimeException("Profissional não encontrado")));
        return consulta;
    }

    @Transactional
    public ResponseEntity<ConsultaDTO> criarConsulta(ConsultaDTO consultaDTO) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findById(consultaDTO.getIdPaciente());
        if (pacienteOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Profissional> profissionalOpt = profissionalRepository.findById(consultaDTO.getIdProfissional());
        if (profissionalOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Paciente paciente = pacienteOpt.get();
        Profissional profissional = profissionalOpt.get();

        Consulta consulta = toEntity(consultaDTO);
        Consulta novaConsulta = consultaRepository.save(consulta);

        paciente.getConsultas().add(novaConsulta);
        profissional.getConsultas().add(novaConsulta);

        pacienteRepository.save(paciente);
        profissionalRepository.save(profissional);

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

    @Transactional
    public ResponseEntity<ConsultaDTO> atualizarConsulta(Long id, ConsultaDTO consultaDTO) {
        Optional<Consulta> consultaExistente = consultaRepository.findById(id);

        if (consultaExistente.isPresent()) {
            Consulta consulta = consultaExistente.get();
            consulta.setData(consultaDTO.getData());
            consulta.setValorConsulta(consultaDTO.getValorConsulta());
            consulta.setPaciente(pacienteRepository.findById(consultaDTO.getIdPaciente()).orElseThrow(() -> new RuntimeException("Paciente não encontrado")));
            consulta.setProfissional(profissionalRepository.findById(consultaDTO.getIdProfissional()).orElseThrow(() -> new RuntimeException("Profissional não encontrado")));
            Consulta consultaSalva = consultaRepository.save(consulta);
            return new ResponseEntity<>(toDTO(consultaSalva), HttpStatus.OK);
        } else {

        if (consultaExistente.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<Paciente> pacienteOpt = pacienteRepository.findById(consultaDTO.getIdPaciente());
        if (pacienteOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Profissional> profissionalOpt = profissionalRepository.findById(consultaDTO.getIdProfissional());
        if (profissionalOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Consulta consulta = consultaExistente.get();

        Paciente novoPaciente = pacienteOpt.get();
        Paciente pacienteAntigo = consulta.getPaciente();

        Profissional novoProfissional = profissionalOpt.get();
        Profissional profissionalAntigo = consulta.getProfissional();

        if (pacienteAntigo != null && !pacienteAntigo.equals(novoPaciente)) {
            pacienteAntigo.getConsultas().remove(consulta);
            pacienteRepository.save(pacienteAntigo);
        }

        if (profissionalAntigo != null && !profissionalAntigo.equals(novoProfissional)) {
            profissionalAntigo.getConsultas().remove(consulta);
            profissionalRepository.save(profissionalAntigo);
        }

        consulta.setData(consultaDTO.getData());
        consulta.setValorConsulta(consultaDTO.getValorConsulta());
        consulta.setPaciente(novoPaciente);
        consulta.setProfissional(novoProfissional);

        if (!novoPaciente.getConsultas().contains(consulta)) {
            novoPaciente.getConsultas().add(consulta);
        }

        if (!novoProfissional.getConsultas().contains(consulta)) {
            novoProfissional.getConsultas().add(consulta);
        }

        consultaRepository.save(consulta);
        pacienteRepository.save(novoPaciente);
        profissionalRepository.save(novoProfissional);
        return new ResponseEntity<>(toDTO(consulta), HttpStatus.OK);
    }
    }

}