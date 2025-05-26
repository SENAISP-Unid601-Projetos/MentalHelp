package com.example.Back.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PacienteEntradaDTO {
    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private LocalDateTime dataDeNascimento;

    @JsonIgnore
    private String foto;
}