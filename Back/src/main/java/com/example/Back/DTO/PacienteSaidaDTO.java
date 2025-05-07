package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteSaidaDTO {
    @lombok.Setter
    private static String foto;
    private Long idPaciente;
    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private String fotoPac;

    private List<Long> id_consultas;
    private List<Long> id_telefones;
}
