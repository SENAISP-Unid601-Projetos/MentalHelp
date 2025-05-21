package com.example.Back.Service;

import com.example.Back.Repository.AtestadoRepository;
import com.example.Back.Repository.ConsultaRepository;
import com.example.Back.entity.Atestado;
import com.example.Back.entity.Consulta;
import com.itextpdf.io.font.constants.StandardFonts;
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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class AtestadoService {

    @Autowired
    private AtestadoRepository atestadoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    public Atestado criarAtestado(Long idConsulta) {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        Atestado atestado = new Atestado();
        atestado.setConsulta(consulta);
        atestado.setData(LocalDate.now());
        atestado.setCrmMedico(consulta.getProfissional().getCrm());
        atestado.setNomePaciente(consulta.getPaciente().getNome());
        atestado.setCid("Z76.5");
        atestado.setDescricao("Atesto que o(a) paciente esteve sob meus cuidados na data mencionada.");
        atestado.setAssinatura("_________________________");

        return atestadoRepository.save(atestado);
    }

    public byte[] gerarAtestadoPDF(Long idConsulta) throws Exception {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        Optional<Atestado> atestadoExistente = atestadoRepository.findByConsulta_IdConsulta(idConsulta);
        Atestado atestado = atestadoExistente.orElseGet(() -> criarAtestado(idConsulta));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc, PageSize.A4);
        document.setMargins(70, 50, 70, 50);

        var font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        var bold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

        Paragraph titulo = new Paragraph("ATESTADO MÉDICO")
                .setFont(bold)
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(titulo);
        document.add(new Paragraph("\n"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        Paragraph corpo = new Paragraph()
                .setFont(font)
                .setFontSize(12)
                .add("Paciente: ").add(new Text(atestado.getNomePaciente()).setFont(bold)).add("\n")
                .add("Profissional: ").add(new Text(consulta.getProfissional().getNome()).setFont(bold)).add("\n")
                .add("CRM: ").add(new Text(atestado.getCrmMedico()).setFont(bold)).add("\n")
                .add("Data da consulta: ").add(new Text(consulta.getData().format(formatter)).setFont(bold)).add("\n")
                .add("CID: ").add(new Text(atestado.getCid()).setFont(bold)).add("\n\n")
                .add(atestado.getDescricao());
        document.add(corpo);

        document.add(new Paragraph("\n\n\n"));
        document.add(new Paragraph(atestado.getAssinatura())
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("Assinatura do Profissional")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10));

        document.close();
        return out.toByteArray();
    }
}
