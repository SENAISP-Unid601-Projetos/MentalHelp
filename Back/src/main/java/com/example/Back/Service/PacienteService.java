package com.example.Back.service;

import com.example.Back.Repository.PacienteRepository;
import com.example.Back.entity.Paciente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository repository;

    Paciente paciente = new Paciente();





}
