package com.example.Back.service;

import com.example.Back.repository.ConsultaRepository;
import com.example.Back.entity.Consulta;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;


@Service
public class AtestadoService {


    @Autowired
    private ConsultaRepository consultaRepository;

    public byte[] gerarAtestadoPDF(Long idConsulta) throws Exception {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.setMargins(70, 50, 70, 50); // Margens: top, right, bottom, left

        // Fonte padrão
        var font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        var bold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

        // Título centralizado
        Paragraph titulo = new Paragraph("ATESTADO MÉDICO")
                .setFont(bold)
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.BLACK);
        document.add(titulo);

        document.add(new Paragraph("\n"));

        // Corpo do atestado
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        Paragraph corpo = new Paragraph()
                .setFont(font)
                .setFontSize(12)
                .add("Paciente: ").add(new Text(consulta.getPaciente().getNome()).setFont(bold)).add("\n")
                .add("Profissional: ").add(new Text(consulta.getProfissional().getNome()).setFont(bold)).add("\n")
                .add("Data da consulta: ").add(new Text(consulta.getData().format(formatter)).setFont(bold)).add("\n\n")
                .add("Atesto, para os devidos fins, que o(a) paciente acima esteve sob meus cuidados na data mencionada.");
        document.add(corpo);

        // Espaço para assinatura
        document.add(new Paragraph("\n\n\n"));
        document.add(new Paragraph("_______________________________")
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("Assinatura do Profissional")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10));

        document.close();
        return out.toByteArray();
    }

}
