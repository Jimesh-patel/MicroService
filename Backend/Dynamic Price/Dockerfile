FROM node:18
WORKDIR /price
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3005
CMD ["node", "server.js"]
