---
title: "Configurando uma VM Segura para Aplicações Node.js com Nginx"
excerpt: "Aprenda a configurar corretamente uma máquina virtual para hospedar aplicações Node.js com Nginx como proxy reverso, implementando as melhores práticas de segurança, desde SSH até certificados SSL."
coverImage: "/assets/blog/nodejs-vm-setup/hero.jpg"
date: "2025-03-13T12:00:00.000Z"
author:
  name: Enzo Spagnolli Direito
  picture: "https://avatars.githubusercontent.com/u/66880567?s=400&u=3028074e2a160c0ceb5b6d162b22c7d264f97a73&v=4"
ogImage:
  url: "/assets/blog/nodejs-vm-setup/hero.jpg"
---

Configurar uma máquina virtual (VM) para hospedar aplicações Node.js pode parecer simples à primeira vista, mas garantir que essa configuração seja segura e eficiente requer atenção a diversos detalhes. Neste guia, vamos percorrer todo o processo de configuração de uma VM para aplicações Node.js usando Nginx como proxy reverso, com foco especial nas medidas de segurança essenciais.

## Preparando a VM

Antes de começar, você precisará de uma VM com um sistema operacional Linux. Neste guia, usaremos Ubuntu Server 22.04 LTS, mas os conceitos se aplicam a outras distribuições com pequenas adaptações.

### Atualizando o Sistema

Sempre comece atualizando o sistema:

```bash
sudo apt update
sudo apt upgrade -y
```

### Instalando Dependências Essenciais

```bash
sudo apt install -y curl wget git build-essential
```

## Configurando o Acesso SSH Seguro

O SSH é a principal porta de entrada para sua VM. Configurá-lo corretamente é crucial para a segurança.

### 1. Desabilitar Login como Root

Edite o arquivo de configuração SSH:

```bash
sudo nano /etc/ssh/sshd_config
```

Encontre e altere a linha:

```plaintext
PermitRootLogin no
```

### 2. Usar Autenticação por Chave em vez de Senha

Gere um par de chaves SSH em sua máquina local (não na VM):

```bash
ssh-keygen -t ed25519 -C "seu_email@exemplo.com"
```

Copie a chave pública para a VM:

```bash
ssh-copy-id usuario@endereco-da-vm
```

Agora, desabilite a autenticação por senha na VM:

```bash
sudo nano /etc/ssh/sshd_config
```

Altere ou adicione:

```plaintext
PasswordAuthentication no
```

### 3. Alterar a Porta SSH Padrão

Ainda no arquivo sshd_config, altere a porta padrão (22) para outra de sua escolha:

```plaintext
Port 2222
```

### 4. Reinicie o Serviço SSH

```bash
sudo systemctl restart sshd
```

## Configurando o Firewall

Um firewall bem configurado é essencial para proteger sua VM contra acessos não autorizados.

### 1. Configurando UFW (Uncomplicated Firewall)

```bash
sudo apt install ufw
```

### 2. Configurando Regras Básicas

```bash
# Permitir a nova porta SSH
sudo ufw allow 2222/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Negar todo o resto e habilitar o firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable
```

### 3. Implementando Fail2Ban para Proteção contra Força Bruta

```bash
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

Configure o Fail2Ban para SSH:

```ini
[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```

Inicie o serviço:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Instalando e Configurando Node.js

Vamos instalar o Node.js usando o NVM (Node Version Manager), que facilita a gestão de versões.

### 1. Instalando NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

Recarregue o perfil:

```bash
source ~/.bashrc
```

### 2. Instalando Node.js

```bash
nvm install 18
nvm use 18
nvm alias default 18
```

### 3. Configurando PM2 para Gerenciamento de Processos

PM2 é uma ferramenta essencial para manter aplicações Node.js em execução:

```bash
npm install -g pm2
```

## Configurando Nginx como Proxy Reverso

Nginx atuará como um proxy reverso, encaminhando solicitações para sua aplicação Node.js.

### 1. Instalando Nginx

```bash
sudo apt install nginx
```

### 2. Configurando um Site no Nginx

Crie um arquivo de configuração para seu site:

```bash
sudo nano /etc/nginx/sites-available/meu-app
```

Adicione a configuração básica:

```nginx
server {
    listen 80;
    server_name meuapp.com www.meuapp.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative a configuração:

```bash
sudo ln -s /etc/nginx/sites-available/meu-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Implementando Rate Limiting no Nginx

O rate limiting ajuda a proteger contra ataques de DDoS e abuso de recursos.

Edite o arquivo de configuração do seu site:

```bash
sudo nano /etc/nginx/sites-available/meu-app
```

Adicione as configurações de rate limiting:

```nginx
# Definindo zonas de limitação
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    listen 80;
    server_name meuapp.com www.meuapp.com;

    # Aplicando rate limiting
    location / {
        limit_req zone=mylimit burst=20 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Configurando SSL/TLS com Let's Encrypt

HTTPS é essencial para qualquer aplicação web moderna.

### 1. Instalando Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

### 2. Obtendo um Certificado

```bash
sudo certbot --nginx -d meuapp.com -d www.meuapp.com
```

### 3. Configurando Renovação Automática

Certbot configura automaticamente um cron job para renovação, mas você pode verificar:

```bash
sudo systemctl status certbot.timer
```

### 4. Fortalecendo a Segurança SSL

Edite a configuração do Nginx:

```bash
sudo nano /etc/nginx/sites-available/meu-app
```

Adicione configurações de segurança SSL:

```nginx
server {
    # SSL configuration
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    # Certificados gerenciados pelo Certbot
    
    # Configurações de segurança SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
    ssl_ecdh_curve secp384r1;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Adicione HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

## Implantando sua Aplicação Node.js

Agora que a infraestrutura está pronta, vamos implantar a aplicação.

### 1. Clonando o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git /home/usuario/meu-app
cd /home/usuario/meu-app
```

### 2. Instalando Dependências

```bash
npm install
```

### 3. Configurando Variáveis de Ambiente

Crie um arquivo .env:

```bash
nano .env
```

Adicione suas variáveis:

```env
NODE_ENV=production
PORT=3000
# Outras variáveis específicas da aplicação
```

### 4. Iniciando a Aplicação com PM2

```bash
pm2 start app.js --name "meu-app"
pm2 save
pm2 startup
```

## Monitoramento e Logs

### 1. Configurando Logs do Nginx

```bash
sudo nano /etc/nginx/nginx.conf
```

Certifique-se de que o logging esteja configurado:

```nginx
http {
    log_format detailed '$remote_addr - $remote_user [$time_local] '
                      '"$request" $status $body_bytes_sent '
                      '"$http_referer" "$http_user_agent" '
                      '$request_time $upstream_response_time $pipe';
    
    access_log /var/log/nginx/access.log detailed;
    error_log /var/log/nginx/error.log;
}
```

### 2. Monitorando a Aplicação com PM2

```bash
pm2 monit
pm2 logs
```

## Backups e Recuperação de Desastres

### 1. Configurando Backups Automáticos

Instale o utilitário de backup:

```bash
sudo apt install restic
```

Configure um script de backup:

```bash
nano /home/usuario/backup.sh
```

```bash
#!/bin/bash
export RESTIC_REPOSITORY="/caminho/para/backup"
export RESTIC_PASSWORD="sua-senha-segura"

# Backup da aplicação
restic backup /home/usuario/meu-app

# Backup das configurações do Nginx
restic backup /etc/nginx/sites-available

# Backup do banco de dados (se aplicável)
# mysqldump -u usuario -p senha banco_de_dados > /tmp/backup.sql
# restic backup /tmp/backup.sql
```

Torne o script executável:

```bash
chmod +x /home/usuario/backup.sh
```

Configure um cron job para executar regularmente:

```bash
crontab -e
```

Adicione:

```cron
0 2 * * * /home/usuario/backup.sh
```

## Considerações Finais de Segurança

### 1. Atualizações Regulares

Configure atualizações automáticas:

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### 2. Auditoria de Segurança

Instale ferramentas de auditoria:

```bash
sudo apt install rkhunter lynis
```

Execute verificações regulares:

```bash
sudo rkhunter --check
sudo lynis audit system
```

### 3. Monitoramento de Integridade de Arquivos

```bash
sudo apt install aide
sudo aideinit
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
```

Configure verificações regulares:

```bash
crontab -e
```

Adicione:

```cron
0 3 * * * sudo aide --check
```

## Conclusão

Configurar uma VM para hospedar aplicações Node.js com Nginx envolve muito mais do que simplesmente instalar os pacotes necessários. A segurança deve ser uma preocupação constante, desde o acesso SSH até a proteção da aplicação com HTTPS e rate limiting.

Seguindo este guia, você terá uma infraestrutura robusta e segura para suas aplicações Node.js. Lembre-se de que a segurança é um processo contínuo, não um estado final. Mantenha-se atualizado sobre novas vulnerabilidades e melhores práticas para garantir que sua aplicação permaneça protegida.

Implementar todas essas medidas pode parecer trabalhoso inicialmente, mas o investimento em segurança desde o início economizará tempo e recursos no futuro, além de proteger seus dados e a confiança dos seus usuários. 