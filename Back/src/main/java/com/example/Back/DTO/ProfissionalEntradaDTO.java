package com.example.Back.DTO;

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
    private String foto;

}
