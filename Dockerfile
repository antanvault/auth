FROM node:22-alpine

WORKDIR /usr/src/auth

COPY package.json .
COPY ./src ./src
COPY server.js .

RUN npm install -g nodemon

RUN npm install

CMD [ "npm", "start"]