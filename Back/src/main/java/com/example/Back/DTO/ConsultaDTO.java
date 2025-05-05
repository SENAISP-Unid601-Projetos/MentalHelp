package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultaDTO {
    private Long idConsulta;
    private LocalDate data;
    private Double valorConsulta;

    private Long id_paciente;
    private Long id_profissional;
}
