package com.example.Back.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app.fotos")
public class FotoStorageProperties {

    private List<String> diretoriosProfissional;

    private List<String> diretoriosPaciente;

    public List<String> getDiretoriosProfissional() {
        return diretoriosProfissional;
    }

    public void setDiretoriosProfissional(List<String> diretoriosProfissional) {
        this.diretoriosProfissional = diretoriosProfissional;
    }

    public List<String> getDiretoriosPaciente() {
        return diretoriosPaciente;
    }

    public void setDiretoriosPaciente(List<String> diretoriosPaciente) {
        this.diretoriosPaciente = diretoriosPaciente;
    }
}