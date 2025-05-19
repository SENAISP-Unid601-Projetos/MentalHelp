package com.example.Back.Service;

import com.example.Back.DTO.AtestadoEntradaDTO;
import com.example.Back.DTO.AtestadoSaidaDTO;
import com.example.Back.Repository.AtestadoRepository;
import com.example.Back.Repository.PacienteRepository;
import com.example.Back.Repository.ProfissionalRepository;
import com.example.Back.entity.Atestado;
import com.example.Back.entity.Paciente;
import com.example.Back.entity.Profissional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AtestadoService {

    private final AtestadoRepository atestadoRepository;
    private final PacienteRepository pacienteRepository;
    private final ProfissionalRepository profissionalRepository;

    public AtestadoSaidaDTO salvarAtestado(AtestadoEntradaDTO dto) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findById(dto.getIdPaciente());
        Optional<Profissional> profissionalOpt = profissionalRepository.findById(dto.getIdProfissional());

        if (pacienteOpt.isEmpty() || profissionalOpt.isEmpty()) {
            throw new RuntimeException("Paciente ou profissional não encontrado");
        }

        Atestado atestado = new Atestado();
        atestado.setData(dto.getData());
        atestado.setDescricao(dto.getDescricao());
        atestado.setCid(dto.getCid());
        atestado.setPaciente(pacienteOpt.get());
        atestado.setProfissional(profissionalOpt.get());

        atestado = atestadoRepository.save(atestado);
        return toDTO(atestado);
    }

    public List<AtestadoSaidaDTO> listarAtestados() {
        return atestadoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AtestadoSaidaDTO toDTO(Atestado atestado) {
        AtestadoSaidaDTO dto = new AtestadoSaidaDTO();
        dto.setIdAtestado(atestado.getIdAtestado());
        dto.setData(atestado.getData());
        dto.setDescricao(atestado.getDescricao());
        dto.setCid(atestado.getCid());
        dto.setCrmMedico(atestado.getProfissional().getCrm());
        dto.setNomePaciente(atestado.getPaciente().getNome());
        return dto;
    }
}
