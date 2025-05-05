package com.example.Back.entity;

import jakarta.persistence.*;
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
