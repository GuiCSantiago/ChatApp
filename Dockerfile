# Usar a imagem base oficial do Node.js 16 LTS
FROM node:16

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar o arquivo package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências do projeto, incluindo @expo/ngrok como dependência de desenvolvimento
RUN npm install
RUN npm install --save-dev @expo/ngrok

# Copiar todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Criar um usuário não-root
RUN useradd -m -d /home/nodeuser -s /bin/bash nodeuser

# Dar permissão ao novo usuário para a pasta de trabalho
RUN chown -R nodeuser:nodeuser /usr/src/app

# Mudar para o novo usuário
USER nodeuser

# Expor as portas que o Expo e o servidor usarão
EXPOSE 19000
EXPOSE 3000

# Iniciar o servidor e o aplicativo Expo e manter o contêiner ativo
CMD ["sh", "-c", "npm run start-server & npx expo start --tunnel & tail -f /dev/null"]