package com.example.Back.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Atestado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAtestado;

    private LocalDate data;
    private String cid;
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "id_profissional")
    private Profissional profissional;

    @ManyToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;
}
