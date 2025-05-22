package com.example.Back.controller;

import com.example.Back.dto.TelefoneDTO;
import com.example.Back.service.TelefoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/telefone")
public class TelefoneController {

    @Autowired
    private TelefoneService telefoneService;

    @Autowired
    private MessageSource messageSource;

    @PostMapping("/post")
    public ResponseEntity<Map<String, Object>> createTelefone(@RequestBody TelefoneDTO telefoneDTO) {
        ResponseEntity<TelefoneDTO> responseEntity = telefoneService.criarTelefone(telefoneDTO);
        Map<String, Object> response = new HashMap<>();
        if (responseEntity.getStatusCode() == HttpStatus.CREATED) {
            response.put("message", messageSource.getMessage("create.success", null, Locale.getDefault()));
            response.put("telefone", responseEntity.getBody());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            response.put("message", messageSource.getMessage("create.error", null, Locale.getDefault()));
            return ResponseEntity.status(responseEntity.getStatusCode()).body(response);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<TelefoneDTO>> getTelefones() {
        return telefoneService.listarTelefones();
    }

    @GetMapping("/{numero}")
    public ResponseEntity<Map<String, Object>> getTelefonePorNumero(@PathVariable String numero) {
        ResponseEntity<TelefoneDTO> responseEntity = telefoneService.buscarTelefonePorNumero(numero);
        Map<String, Object> response = new HashMap<>();

        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            response.put("telefone", responseEntity.getBody());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @PutMapping("/{numero}")
    public ResponseEntity<Map<String, Object>> updateTelefone(@PathVariable String numero, @RequestBody TelefoneDTO telefoneDTO) {
        ResponseEntity<TelefoneDTO> responseEntity = telefoneService.atualizarTelefone(numero, telefoneDTO);
        Map<String, Object> response = new HashMap<>();
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            response.put("message", messageSource.getMessage("update.success", null, Locale.getDefault()));
            response.put("telefone", responseEntity.getBody());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", messageSource.getMessage("update.notfound", null, Locale.getDefault()));
            return ResponseEntity.status(responseEntity.getStatusCode()).body(response);
        }
    }

    @DeleteMapping("/{numero}")
    public ResponseEntity<Map<String, Object>> deleteTelefone(@PathVariable String numero) {
        ResponseEntity<Void> responseEntity = telefoneService.deletarTelefone(numero);
        Map<String, Object> response = new HashMap<>();
        if (responseEntity.getStatusCode() == HttpStatus.NO_CONTENT) {
            response.put("message", messageSource.getMessage("delete.success", null, Locale.getDefault()));
            return ResponseEntity.ok(response);
        } else {
            response.put("message", messageSource.getMessage("delete.notfound", null, Locale.getDefault()));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<Map<String, Object>> getTelefonesPorPaciente(@PathVariable Long idPaciente) {
        ResponseEntity<List<TelefoneDTO>> responseEntity = telefoneService.buscarTelefonesPorPaciente(idPaciente);
        Map<String, Object> response = new HashMap<>();

        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            response.put("telefones", responseEntity.getBody());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}