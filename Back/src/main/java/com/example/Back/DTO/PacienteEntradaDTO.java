package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PacienteEntradaDTO {
    private String nome;
    private String cpf;
    private String email;
    private String senha;
}
