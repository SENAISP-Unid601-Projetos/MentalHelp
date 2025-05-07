package com.example.Back.Service;

import com.example.Back.Repository.ConsultaRepository;
import com.example.Back.entity.Consulta;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Optional;

import static com.itextpdf.kernel.pdf.PdfName.Font;
import static com.sun.org.apache.xalan.internal.xsltc.compiler.util.Type.Element;

@Service
public class AtestadoService {

    @Autowired
    private ConsultaRepository consultaRepository;

    public byte[] gerarAtestadoPDF(Long idConsulta) throws Exception {
        // Recupera a consulta pelo ID
        Optional<Consulta> consultaOptional = consultaRepository.findById(idConsulta);

        if (!consultaOptional.isPresent()) {
            throw new Exception("Consulta não encontrada");
        }

        Consulta consulta = consultaOptional.get(); // Obtém o objeto consulta

        // Criação do PdfWriter para gravar o PDF em memória
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out); // Criando o PdfWriter

        // Criando o PdfDocument a partir do PdfWriter
        PdfDocument pdfDocument = new PdfDocument(writer);

        // Criando o Document usando o PdfDocument
        Document document = new Document(pdfDocument);

        // Adicionando conteúdo ao documento
        document.add(new Paragraph("ATESTADO MÉDICO"));
        document.add(new Paragraph("Paciente: " + consulta.getPaciente().getNome()));
        document.add(new Paragraph("Profissional: " + consulta.getProfissional().getNome()));
        document.add(new Paragraph("Data: " + consulta.getData().toString()));
        document.close(); // Fecha o documento após a adição de conteúdo

        return out.toByteArray(); // Retorna o conteúdo do PDF gerado
    }

}
