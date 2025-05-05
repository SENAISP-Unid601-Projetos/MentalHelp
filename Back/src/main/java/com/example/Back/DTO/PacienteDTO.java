package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteDTO {
    private Long idPaciente;
    private String nome;
    private String cpf;
    private String email;
    private String senha;

    private List<Long> id_consultas;
    private List<Long> id_telefones;
}
