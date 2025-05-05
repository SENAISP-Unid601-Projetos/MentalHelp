package com.example.Back.service;

import com.example.Back.DTO.ProfissionalDTO;
import com.example.Back.DTO.ProfissionalLoginDTO;
import com.example.Back.Repository.ProfissionalRepository;
import com.example.Back.entity.Consulta;
import com.example.Back.entity.Profissional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfissionalService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

    public String salvarProfissional(ProfissionalDTO profissionalDTO) {
        Profissional profissional = toEntity(profissionalDTO);
        profissionalRepository.save(profissional);
        return "Profissional cadastrado com sucesso!";
    }

    public List<ProfissionalDTO> listarProfissional() {
        return profissionalRepository.findAll()
                .stream()
                .map(this::toProfissionalDTO)
                .collect(Collectors.toList());
    }

    public String atualizarProfissional(Long idProfissional, ProfissionalDTO profissionalDTO) {
        if (profissionalRepository.existsById(idProfissional)) {
            Profissional profissionalExistente = profissionalRepository.findById(idProfissional).get();
            profissionalExistente.setNome(profissionalDTO.getNome());
            profissionalExistente.setNome(profissionalDTO.getCrm());
            profissionalExistente.setEmail(profissionalDTO.getEmail());
            profissionalExistente.setSenha(profissionalDTO.getSenha());
            profissionalExistente.setSenha(profissionalDTO.getEspecialidade());
            profissionalRepository.save(profissionalExistente);
            return "Profissional atualizado com sucesso";
        }
        return "Profissional não encontrado";
    }

    public String deletarProfissional(Long idProfissional) {
        if (profissionalRepository.existsById(idProfissional)) {
            profissionalRepository.deleteById(idProfissional);
            return "Profissional deletado com sucesso";
        }
        return "Profissional não encontrado";
    }

    private ProfissionalDTO toProfissionalDTO(Profissional profissional) {
        List<Long> consultaIds = profissional.getConsultas().stream()
                .map(Consulta::getIdConsulta)
                .collect(Collectors.toList());
        return new ProfissionalDTO(
                profissional.getIdProfissional(),
                profissional.getNome(),
                profissional.getCrm(),
                profissional.getEmail(),
                profissional.getSenha(),
                profissional.getEspecialidade(),
                consultaIds
        );
    }
    private Profissional toEntity(ProfissionalDTO dto) {
        Profissional profissional = new Profissional();
        profissional.setIdProfissional(dto.getIdProfissional());
        profissional.setNome(dto.getNome());
        profissional.setCrm(dto.getCrm());
        profissional.setEmail(dto.getEmail());
        profissional.setSenha(dto.getSenha());
        profissional.setEspecialidade(dto.getEspecialidade());
        List<Consulta> consultas = dto.getId_consultas().stream()
                .map(id -> {
                    Consulta consulta = new Consulta();
                    consulta.setIdConsulta(id);
                    return consulta;
                })
                .collect(Collectors.toList());
        profissional.setConsultas(consultas);
        return profissional;
    }

    public String login(ProfissionalLoginDTO profissionalLoginDTO) {
        var profissional = profissionalRepository.findByEmail(profissionalLoginDTO.getEmail());

        if (profissional.isPresent()) {
            if (profissional.get().getSenha().equals(profissionalLoginDTO.getSenha())) {
                return "Login realizado com sucesso";
            } else {
                return "Senha incorreta";
            }
        } else {
            return "Professor não encontrado";
        }
    }



}
