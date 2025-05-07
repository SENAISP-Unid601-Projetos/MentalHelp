package com.example.Back.Service;

import com.example.Back.DTO.ProfissionalEntradaDTO;
import com.example.Back.DTO.ProfissionalLoginDTO;
import com.example.Back.DTO.ProfissionalSaidaDTO;
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
    private ProfissionalRepository profissionalRepository;

    public ResponseEntity<ProfissionalSaidaDTO> salvarProfissional(ProfissionalEntradaDTO profissionalEntradaDTO) {
        Profissional profissional = toEntity(profissionalEntradaDTO);
        profissionalRepository.save(profissional);
        return new ResponseEntity<>(toProfissionalDTO(profissional), HttpStatus.CREATED);
    }

    public ResponseEntity<List<ProfissionalSaidaDTO>> listarProfissional() {
        List<ProfissionalSaidaDTO> profissionais = profissionalRepository.findAll()
                .stream()
                .map(profissional -> toProfissionalDTO(profissional))
                .collect(Collectors.toList());
        return new ResponseEntity<>(profissionais, HttpStatus.OK);
    }

    public ResponseEntity<ProfissionalSaidaDTO> atualizarProfissional(Long idProfissional, ProfissionalEntradaDTO profissionalEntradaDTO) {
        Optional<Profissional> profissionalOpt = profissionalRepository.findById(idProfissional);
        if (profissionalOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Profissional profissional = profissionalOpt.get();
        profissional.setNome(profissionalEntradaDTO.getNome());
        profissional.setCrm(profissionalEntradaDTO.getCrm());
        profissional.setEmail(profissionalEntradaDTO.getEmail());
        profissional.setSenha(profissionalEntradaDTO.getSenha());
        profissional.setEspecialidade(profissionalEntradaDTO.getEspecialidade());

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

    private ProfissionalSaidaDTO toProfissionalDTO(Profissional profissional) {
        List<Consulta> consultas = profissional.getConsultas();

        if(consultas == null){
            return new ProfissionalSaidaDTO(
                    profissional.getIdProfissional(),
                    profissional.getNome(),
                    profissional.getCrm(),
                    profissional.getEmail(),
                    profissional.getSenha(),
                    profissional.getEspecialidade(),
                    null
            );
        }

        List<Long> consultaIds = consultas.stream()
                .map(Consulta::getIdConsulta)
                .collect(Collectors.toList());

        return new ProfissionalSaidaDTO(
                profissional.getIdProfissional(),
                profissional.getNome(),
                profissional.getCrm(),
                profissional.getEmail(),
                profissional.getSenha(),
                profissional.getEspecialidade(),
                consultaIds
        );

    }
    private Profissional toEntity(ProfissionalEntradaDTO dto) {
        Profissional profissional = new Profissional();
        profissional.setNome(dto.getNome());
        profissional.setCrm(dto.getCrm());
        profissional.setEmail(dto.getEmail());
        profissional.setSenha(dto.getSenha());
        profissional.setEspecialidade(dto.getEspecialidade());
        return profissional;
    }

    public boolean authenticateUser(ProfissionalLoginDTO profissionalLoginDTO) {
        return profissionalRepository.findByEmail(profissionalLoginDTO.getEmail())
                .map(profissional -> profissional.getSenha().equals(profissionalLoginDTO.getSenha()))
                .orElse(false);
    }

}
