package com.example.Back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfissionalSaidaDTO {
    private Long idProfissional;
    private String nome;
    private String crm;
    private String email;
    private String senha;
    private String especialidade;
    private String foto;

    private List<Long> id_consultas;
}
