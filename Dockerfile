FROM node:8

WORKDIR /app

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 8086

CMD yarn start
