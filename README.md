# **MentalHelp - Instruções de Ambiente**

## **Ambiente Local**

Para rodar o projeto localmente, siga os seguintes passos:

1. Clone o repositório do projeto.
2. Suba o back-end utilizando o **IntelliJ IDEA**.
3. Suba o front-end utilizando o **VSCode**.

## **Configure o Intellij**

1. Clique em Run options
2. adicione uma nova aplicação para rodar
3. Clique em mais opções e selecione VM OPTIONS
4. coloque esse código: -Dspring.profiles.active=dev

---

## **Ambiente de Homologação**

Para configurar e rodar o ambiente de homologação, siga os passos abaixo:

1. Inicie a máquina virtual.
2. Conecte-se via **SSH** utilizando o comando:  
   `ssh senaisc@10.110.12.x`
3. No terminal, execute o comando:  
   `sudo chmod 777 /var/run/docker.sock`

---
# Acesso a aplicação
Acesse em: [http://10.110.12.10:3000/](http://10.110.12.10:3000/) 

---

### **Ferramentas de Gestão**

- **Jenkins** (Ferramenta de Build Automático):  
   Acesse em: [http://10.110.12.10:8080/](http://10.110.12.10:8080/)  
   - Usuário: `senaisc`  
   - Senha: `Senai123`

- **Portainer** (Gestão de Containers):  
   Acesse em: [http://10.110.12.10:9000/](http://10.110.12.10:9000/)  
   - Usuário: `admin`  
   - Senha: `123456789101112`

- **PGAdmin** (Gestão do Banco de Dados):  
   Acesse em: [http://10.110.12.10:5000/](http://10.110.12.10:5000/)  
   - Usuário: `senaisc@senai.com`  
   - Senha: `123456`

- **Postgres** (Acesso ao Banco de Dados):  
   - Usuário: `postgres`  
   - Senha: `12345`

- **Swagger** (Documentação da API):  
   Acesse em: [http://10.110.12.10:9500/swagger-ui/index.html](http://10.110.12.10:9500/swagger-ui/index.html)

---

**Nota Importante:**  
A conexão do servidor de homologação pode ter mudanças no IP. Caso ocorra falha na conexão, verifique se o IP do servidor foi alterado.

---

## **Ambiente de Produção**

O ambiente de produção será hospedado da seguinte maneira:

- **Back-end**: Hospedado no **Render**.
- **Front-end**: Hospedado no **GitHub Pages**.

Acesse o front-end em:  
[https://senaisp-unid601-projetos.github.io/MentalHelp/Front/](https://senaisp-unid601-projetos.github.io/MentalHelp/Front/)
