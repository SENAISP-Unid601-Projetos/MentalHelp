package com.example.Back.service;

import com.example.Back.dto.PacienteSaidaDTO;
import com.example.Back.dto.ProfissionalEntradaDTO;
import com.example.Back.dto.ProfissionalSaidaDTO;
import com.example.Back.repository.ProfissionalRepository;
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
    public ResponseEntity<?> salvarProfissional(ProfissionalEntradaDTO profissionalEntradaDTO) {
        if (profissionalEntradaDTO.getCrm().length() < 4){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Crm deve ter pelo menos 4 caracteres");
        }

        if (profissionalEntradaDTO.getSenha().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Senha deve ter pelo menos 6 caracteres");
        }

        if (!profissionalEntradaDTO.getEmail().matches("\\S+@\\S+\\.\\S+")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email inválido");
        }

        boolean crmExiste = profissionalRepository.existsByCrm(profissionalEntradaDTO.getCrm());

        if (crmExiste) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("CRM já cadastrado."); //
        }

        Profissional profissional = toEntity(profissionalEntradaDTO);
        profissionalRepository.save(profissional);
        return ResponseEntity.status(HttpStatus.CREATED).body(toProfissionalDTO(profissional));
    }

    // Buscar profissional por ID
    public Optional<ProfissionalSaidaDTO> buscarProfissionalPorId(Long id) {
        return profissionalRepository.findById(id)
                .map(this::toProfissionalDTO);
    }

    public Optional<ProfissionalSaidaDTO> buscarProfissionalPorCrm(String crm) {
        return profissionalRepository.findByCrm(crm)
                .map(this::toProfissionalDTO);
    }

    public List<ProfissionalSaidaDTO> buscarProfissionaisPorEspecialidade(String especialidade) {
        return profissionalRepository.findByEspecialidade(especialidade)
                .stream()
                .map(this::toProfissionalDTO)
                .toList();
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

}
