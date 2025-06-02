let ambiente = "dev";
let ambientehom = "hom";

let base_url;

// Definir a URL base com base no ambiente
if (ambiente === "dev") {
    base_url = "https://mentalhelp.onrender.com/swagger-ui/index.html"; // URL para desenvolvimento
} else if (ambiente === "hom") {
    base_url = "http://10.110.12.40:3000/"; // URL para homologação
}