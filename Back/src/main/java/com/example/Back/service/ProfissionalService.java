package com.example.Back.Service;

import com.example.Back.DTO.ProfissionalDTO;
import com.example.Back.DTO.ProfissionalLoginDTO;
import com.example.Back.Repository.ProfissionalRepository;
import com.example.Back.entity.Consulta;
import com.example.Back.entity.Profissional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfissionalService {

    @Autowired
    private static ProfissionalRepository profissionalRepository;

    public ResponseEntity<ProfissionalDTO> salvarProfissional(ProfissionalDTO profissionalDTO) {
        Profissional profissional = toEntity(profissionalDTO);
        profissionalRepository.save(profissional);
        return new ResponseEntity<>(toProfissionalDTO(profissional), HttpStatus.CREATED);
    }

    public ResponseEntity<List<ProfissionalDTO>> listarProfissional() {
        List<ProfissionalDTO> profissionais = profissionalRepository.findAll()
                .stream()
                .map(profissional -> toProfissionalDTO(profissional))
                .collect(Collectors.toList());
        return new ResponseEntity<>(profissionais, HttpStatus.OK);
    }

    public ResponseEntity<ProfissionalDTO> atualizarProfissional(Long idProfissional, ProfissionalDTO profissionalDTO) {
        Optional<Profissional> profissionalOpt = profissionalRepository.findById(idProfissional);
        if (profissionalOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Profissional profissional = profissionalOpt.get();
        profissional.setNome(profissionalDTO.getNome());
        profissional.setCrm(profissionalDTO.getCrm());
        profissional.setEmail(profissionalDTO.getEmail());
        profissional.setSenha(profissionalDTO.getSenha());
        profissional.setEspecialidade(profissionalDTO.getEspecialidade());

        profissionalRepository.save(profissional);
        return new ResponseEntity<>(toProfissionalDTO(profissional), HttpStatus.OK);
    }

    public ResponseEntity<Void> deletarProfissional(Long idProfissional) {
        if (profissionalRepository.existsById(idProfissional)) {
            profissionalRepository.deleteById(idProfissional);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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

    public static boolean authenticateUser(ProfissionalLoginDTO profissionalDTO) {
        return profissionalRepository.findByEmail(profissionalDTO.getEmail())
                .map(profissional -> profissional.getSenha().equals(profissionalDTO.getSenha()))
                .orElse(false);
    }

}
