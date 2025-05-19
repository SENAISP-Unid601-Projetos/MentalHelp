package com.example.Back.DTO;



import lombok.Data;

import java.time.LocalDate;

@Data
public class AtestadoEntradaDTO {
    private LocalDate data;
    private String cid;
    private String descricao;

    private Long idProfissional;
    private Long idPaciente;
}

