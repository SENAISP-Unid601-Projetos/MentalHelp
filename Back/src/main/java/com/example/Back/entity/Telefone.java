package com.example.Back.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Telefone {
    @Id
    private String telefone;

    private String tipo;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;
}