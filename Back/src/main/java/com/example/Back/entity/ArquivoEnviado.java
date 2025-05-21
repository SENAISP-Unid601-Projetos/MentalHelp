package com.example.Back.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ArquivoEnviado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeArquivo;
    private LocalDateTime dataEnvio;
    @Lob
    @Column(name = "conteudo")
    private byte[] conteudo;




    @ManyToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_profissional")
    private Profissional profissional;
}

