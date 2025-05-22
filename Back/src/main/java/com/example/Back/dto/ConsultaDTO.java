package com.example.Back.dto;

import com.example.Back.enums.TipoConsulta;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultaDTO {
    @Schema(readOnly = true)
    private Long idConsulta;
    private LocalDateTime data;
    private Double valorConsulta;

    private TipoConsulta tipoConsulta;

    private Long idPaciente;
    private Long idProfissional;
}