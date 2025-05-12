package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultaDTO {
    private Long idConsulta;
    private LocalDateTime data;
    private Double valorConsulta;

    private Long idPaciente;
    private Long idProfissional;
}