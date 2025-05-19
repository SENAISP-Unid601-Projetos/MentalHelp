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
        if (profissionalEntradaDTO.getCrm().length() < 4){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (profissionalEntradaDTO.getSenha().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (!profissionalEntradaDTO.getEmail().matches("\\S+@\\S+\\.\\S+")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        boolean crmExiste = profissionalRepository.existsByCrm(profissionalEntradaDTO.getCrm());

        if (crmExiste) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(null); //
        }

        Profissional profissional = toEntity(profissionalEntradaDTO);
        profissionalRepository.save(profissional);
        return ResponseEntity.status(HttpStatus.CREATED).body(toProfissionalDTO(profissional));
    }

    // Buscar profissional por ID
    public ResponseEntity<ProfissionalSaidaDTO> buscarProfissionalPorId(Long id) {
        Optional<Profissional> profissionalOpt = profissionalRepository.findById(id);
        if (profissionalOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(toProfissionalDTO(profissionalOpt.get()), HttpStatus.OK);
    }

    // Buscar profissional por CRM
    public ResponseEntity<ProfissionalSaidaDTO> buscarProfissionalPorCrm(String crm) {
        Optional<Profissional> profissionalOpt = profissionalRepository.findByCrm(crm);
        if (profissionalOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(toProfissionalDTO(profissionalOpt.get()), HttpStatus.OK);
    }

    // Buscar profissionais por Especialidade
    public ResponseEntity<List<ProfissionalSaidaDTO>> buscarProfissionaisPorEspecialidade(String especialidade) {
        Optional<Profissional> profissionais = profissionalRepository.findByEspecialidade(especialidade);
        if (profissionais.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<ProfissionalSaidaDTO> dtos = profissionais.stream()
                .map(this::toProfissionalDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
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
                    profissional.getFoto(),
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
                profissional.getFoto(),
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
        profissional.setFoto(dto.getFoto());
        return profissional;
    }

    public boolean authenticateUser(ProfissionalLoginDTO profissionalLoginDTO) {
        return profissionalRepository.findByEmail(profissionalLoginDTO.getEmail())
                .map(profissional -> profissional.getSenha().equals(profissionalLoginDTO.getSenha()))
                .orElse(false);
    }

}
