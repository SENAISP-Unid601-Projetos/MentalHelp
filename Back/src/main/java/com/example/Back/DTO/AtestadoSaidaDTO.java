package com.example.Back.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AtestadoSaidaDTO {
    private Long idAtestado;
    private LocalDate data;
    private String crmMedico;
    private String cid;
    private String descricao;

    private String nomeProfissional;
    private String nomePaciente;
}

