FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3010

CMD ["npm", "run", "start"]
