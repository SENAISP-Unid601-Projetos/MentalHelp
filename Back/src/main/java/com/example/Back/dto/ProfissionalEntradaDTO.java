package com.example.Back.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfissionalEntradaDTO {
    private String nome;
    private String crm;
    private String email;
    private String senha;
    private String especialidade;

    @JsonIgnore
    private String foto;

}
