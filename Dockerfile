FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "serve", "--", "--host", "0.0.0.0"] # ou la commande de démarrage de votre application Vue.js