package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TelefoneDTO {
    private String telefone;
    private String tipo;

    private Long id_paciente;
}
