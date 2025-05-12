package com.example.Back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConsulta;

    private LocalDateTime data;
    private Double valorConsulta;

    @ManyToOne
    @JoinColumn(name="paciente_id")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name="profissional_id")
    private Profissional profissional;
}