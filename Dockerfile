# Usar a imagem base oficial do Node.js
FROM node:18

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar o arquivo package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Instalar Expo CLI globalmente
RUN npm install -g expo-cli

# Copiar todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Expor as portas que o Expo e o servidor usarão
EXPOSE 19000
EXPOSE 3000

# Iniciar o servidor e o aplicativo Expo e manter o contêiner ativo
CMD ["sh", "-c", "npm run start-server & npm start & tail -f /dev/null"]