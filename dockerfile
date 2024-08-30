# Use uma imagem base do Node.js
FROM node:20-alpine

# Crie o diretório da aplicação
WORKDIR /usr/src/app

# Desinstale as dependências
RUN rm -rf node_modules package-lock.json

# Copie o package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install\
&& npm install typescript -g

# Copie o restante do código   
COPY . .

# Exponha a porta
EXPOSE 3000

# Comando para iniciar a aplicação
RUN tsc
CMD ["node", "./dist/index.js"]