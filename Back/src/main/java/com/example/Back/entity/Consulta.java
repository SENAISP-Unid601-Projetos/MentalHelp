package com.example.Back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConsulta;

    private LocalDate data;
    private Double valorConsulta;

    @ManyToOne
    @JoinColumn(name="paciente_id")
    private Long idPaciente;

    @ManyToOne
    @JoinColumn(name="profissional_id")
    private Long idProfissional;
}
