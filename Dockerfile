# Usar a imagem base oficial do Node.js
FROM node:18

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar o arquivo package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Expor a porta que o Expo usará
EXPOSE 19000

# Comando para iniciar o aplicativo Expo
CMD ["npm", "start"]