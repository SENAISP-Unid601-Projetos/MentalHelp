# MentalHelp

# Ambientes

## Ambiente Local

Para rodar o ambiente local você deve fazer o clone do projeto e subir o back-end no Intellij IDEA e o front-end no vscode. 

## Ambiente de Homologação
---
Para rodar o ambiente de homologação:
1. Rodar a máquina virtual
2. Conectar via ssh ssh senaisc@10.110.12.x
3. Rodar o seguinte comando no terminal - sudo chmod 777 /var/run/docker.sock
---

Jenkins - ferramenta de build automático - http://10.110.12.10:8080/
- user: senaisc
- senha: Senai123
  
Portainer - gestão dos containers - http://10.110.12.10:9000/
- user: admin
- 123456789101112

PGADMIN - gestão do banco de dados - http://10.110.12.10:5000/
- user: senaisc@senai.com
- senha: 123456

PS: lembrar que a conexão do servidor de homologação pode mudar o IP. Então verificar a conexão se houver falha.

## Ambiente de Produção

Será hospedado no Render (back-end) e o front-end será hospedado no Github Pages.
<ainda em construção>
