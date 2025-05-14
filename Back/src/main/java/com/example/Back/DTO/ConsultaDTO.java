package com.example.Back.DTO;

import com.example.Back.enums.TipoConsulta;
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

    private TipoConsulta tipoConsulta;

    private Long idPaciente;
    private Long idProfissional;
}