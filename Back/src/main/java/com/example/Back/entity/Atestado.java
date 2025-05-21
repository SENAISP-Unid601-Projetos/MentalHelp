package com.example.Back.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Atestado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    private String crmMedico;

    private String nomePaciente;

    private String cid;

    private String descricao;

    private String assinatura;

    @OneToOne
    @JoinColumn(name = "consulta_id")
    @JsonIgnore // <- ESSENCIAL para evitar erro 500 no GET
    private Consulta consulta;
}
