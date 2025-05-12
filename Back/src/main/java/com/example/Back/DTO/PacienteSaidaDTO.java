package com.example.Back.DTO;

import com.example.Back.entity.TipoPaciente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteSaidaDTO {
    private Long idPaciente;
    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private String foto;

    private TipoPaciente tipoPaciente;

    private List<Long> id_consultas;
    private List<String> id_telefones;
}
