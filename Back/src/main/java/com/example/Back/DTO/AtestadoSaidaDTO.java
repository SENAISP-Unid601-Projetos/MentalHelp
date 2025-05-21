package com.example.Back.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AtestadoSaidaDTO {

  private Long consultaId;
  private String cid;
  private String descricao;
  private String assinaturaBase64;


}

