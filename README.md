# 🧠 MentalHelp - Instruções de Ambiente

---

## 💻 Ambiente Local

Para rodar o projeto localmente, siga os passos abaixo:

1. 📥 Clone o repositório do projeto.
2. 🚀 Suba o **back-end** utilizando o **IntelliJ IDEA**.
3. 🎨 Suba o **front-end** utilizando o **VSCode**.


### 🛠️ Configure o IntelliJ

1. Vá em **Run options** ▶️  
2. ➕ Adicione uma nova aplicação para rodar  
3. ⚙️ Clique em **Mais opções** e selecione **VM OPTIONS**  
4. 💬 Insira o seguinte código:

   ```
   -Dspring.profiles.active=dev
   ```

---

## 🧪 Ambiente de Homologação

Para configurar e rodar o ambiente de homologação:

1. 🖥️ Inicie a **máquina virtual**.
2. 🔐 Conecte-se via SSH:

   ```bash
   ssh senaisc@10.110.12.x
   ```

3. 🧾 No terminal, execute:

   ```bash
   sudo chmod 777 /var/run/docker.sock
   ```



### 🌐 Acesso à Aplicação

🔗 Acesse em: [http://10.110.12.50:3000/](http://10.110.12.50:3000/)



### 📋 Ferramentas de Gestão

### 🔧 Jenkins – Build Automático  
🔗 [http://10.110.12.50:8080/](http://10.110.12.50:8080/)  
👤 **Usuário:** `senaisc`  
🔑 **Senha:** `Senai123`



### 📦 Portainer – Gestão de Containers  
🔗 [http://10.110.12.50:9000/](http://10.110.12.50:9000/)  
👤 **Usuário:** `admin`  
🔑 **Senha:** `123456789101112`



### 🛢️ PGAdmin – Gestão do Banco de Dados  
🔗 [http://10.110.12.50:5000/](http://10.110.12.50:5000/)  
👤 **Usuário:** `senaisc@senai.com`  
🔑 **Senha:** `123456`


### 🐘 Postgres – Banco de Dados  
👤 **Usuário:** `postgres`  
🔑 **Senha:** `12345`



### 📚 Swagger – Documentação da API  
🔗 [http://10.110.12.50:9500/swagger-ui/index.html](http://10.110.12.50:9500/swagger-ui/index.html)



> ⚠️ **Nota Importante:**  
> A conexão do servidor de homologação pode sofrer alterações no IP.  
> Em caso de falha, verifique se o IP foi modificado.

---

## 🚀 Ambiente de Produção

O ambiente de produção está hospedado da seguinte forma:

- 🔙 **Back-end**: Render  
- 🔜 **Front-end**: GitHub Pages

### 📂 Acesse o front-end em:  
🔗 [https://senaisp-unid601-projetos.github.io/MentalHelp/Front/](https://senaisp-unid601-projetos.github.io/MentalHelp/Front/)

### 📘 Documentação da API (Swagger):  
🔗 [https://mentalhelp.onrender.com/swagger-ui/index.html](https://mentalhelp.onrender.com/swagger-ui/index.html)
