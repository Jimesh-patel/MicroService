FROM node:18

WORKDIR /price

RUN apt-get update && apt-get install -y python3 && ln -s /usr/bin/python3 /usr/bin/python

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3005

CMD ["node", "server.js"]
