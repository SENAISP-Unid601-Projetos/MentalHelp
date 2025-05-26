package com.example.Back.service;

import com.example.Back.dto.ConsultaDTO;
import com.example.Back.repository.PacienteRepository;
import com.example.Back.repository.ProfissionalRepository;
import com.example.Back.entity.Consulta;
import com.example.Back.repository.ConsultaRepository;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Profissional;
import com.example.Back.exception.ConflitoHorarioException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    private static final Logger logger = LoggerFactory.getLogger(ConsultaService.class);

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
        dto.setTipoConsulta(consulta.getTipoConsulta());
        return dto;
    }

    private Consulta toEntity(ConsultaDTO dto) {
        Consulta consulta = new Consulta();
        consulta.setIdConsulta(dto.getIdConsulta());
        consulta.setData(dto.getData());
        consulta.setValorConsulta(dto.getValorConsulta());
        consulta.setTipoConsulta(dto.getTipoConsulta());
        consulta.setPaciente(pacienteRepository.findById(dto.getIdPaciente())
                .orElseThrow(() -> new IllegalArgumentException("Paciente não encontrado")));
        consulta.setProfissional(profissionalRepository.findById(dto.getIdProfissional())
                .orElseThrow(() -> new IllegalArgumentException("Profissional não encontrado")));
        return consulta;
    }

    @Transactional
    public ConsultaDTO criarConsulta(ConsultaDTO consultaDTO) {
        logger.info("Tentando criar consulta para profissional {} na data {}",
                consultaDTO.getIdProfissional(), consultaDTO.getData());

        // Validações
        if (consultaDTO.getIdPaciente() == null || !pacienteRepository.existsById(consultaDTO.getIdPaciente())) {
            logger.warn("Paciente inválido: ID {}", consultaDTO.getIdPaciente());
            throw new IllegalArgumentException("Paciente não encontrado");
        }
        if (consultaDTO.getIdProfissional() == null || !profissionalRepository.existsById(consultaDTO.getIdProfissional())) {
            logger.warn("Profissional inválido: ID {}", consultaDTO.getIdProfissional());
            throw new IllegalArgumentException("Profissional não encontrado");
        }
        if (consultaDTO.getData() == null) {
            logger.warn("Data da consulta não fornecida");
            throw new IllegalArgumentException("Data da consulta é obrigatória");
        }
        if (consultaDTO.getValorConsulta() == null || consultaDTO.getValorConsulta() < 0) {
            logger.warn("Valor da consulta inválido: {}", consultaDTO.getValorConsulta());
            throw new IllegalArgumentException("Valor da consulta inválido");
        }
        if (consultaDTO.getTipoConsulta() == null) {
            logger.warn("Tipo de consulta não fornecido");
            throw new IllegalArgumentException("Tipo de consulta é obrigatório");
        }

        // Verificar conflito de horário
        if (consultaRepository.existsByProfissionalIdAndData(consultaDTO.getIdProfissional(), consultaDTO.getData())) {
            logger.warn("Conflito de horário: profissional {} já tem consulta na data {}",
                    consultaDTO.getIdProfissional(), consultaDTO.getData());
            throw new ConflitoHorarioException("Já existe uma consulta agendada para este profissional neste horário.");
        }

        Paciente paciente = pacienteRepository.findById(consultaDTO.getIdPaciente()).get();
        Profissional profissional = profissionalRepository.findById(consultaDTO.getIdProfissional()).get();

        Consulta consulta = toEntity(consultaDTO);
        Consulta novaConsulta = consultaRepository.save(consulta);

        paciente.getConsultas().add(novaConsulta);
        profissional.getConsultas().add(novaConsulta);

        pacienteRepository.save(paciente);
        profissionalRepository.save(profissional);

        logger.info("Consulta criada com sucesso: ID {}", novaConsulta.getIdConsulta());
        return toDTO(novaConsulta);
    }

    public ResponseEntity<List<ConsultaDTO>> listarConsultas() {
        List<ConsultaDTO> consultas = consultaRepository.findAll()
                .stream()
                .map(this::toDTO)
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
        if (consultaExistente.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!pacienteRepository.existsById(consultaDTO.getIdPaciente())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (!profissionalRepository.existsById(consultaDTO.getIdProfissional())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Consulta consulta = consultaExistente.get();

        Paciente novoPaciente = pacienteRepository.findById(consultaDTO.getIdPaciente()).get();
        Paciente pacienteAntigo = consulta.getPaciente();

        Profissional novoProfissional = profissionalRepository.findById(consultaDTO.getIdProfissional()).get();
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
        consulta.setTipoConsulta(consultaDTO.getTipoConsulta());
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

    public ResponseEntity<Void> deletarConsulta(Long id) {
        if (consultaRepository.existsById(id)) {
            consultaRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<ConsultaDTO>> buscarConsultasPorPaciente(Long idPaciente) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findById(idPaciente);
        if (pacienteOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<ConsultaDTO> consultas = consultaRepository.findByPaciente(pacienteOpt.get())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }

    public ResponseEntity<List<ConsultaDTO>> buscarConsultasPorProfissional(Long idProfissional) {
        Optional<Profissional> profissionalOpt = profissionalRepository.findById(idProfissional);
        if (profissionalOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<ConsultaDTO> consultas = consultaRepository.findByProfissional(profissionalOpt.get())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }

    public ResponseEntity<List<ConsultaDTO>> buscarConsultasPorData(LocalDateTime data) {
        List<ConsultaDTO> consultas = consultaRepository.findByData(data)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<ConsultaDTO>> buscarConsultasPorPacienteEData(Long idPaciente, LocalDateTime data) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findById(idPaciente);
        if (pacienteOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<ConsultaDTO> consultas = consultaRepository.findByPacienteAndData(pacienteOpt.get(), data)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(consultas, HttpStatus.OK);
    }
}