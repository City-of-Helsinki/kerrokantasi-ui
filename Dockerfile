FROM node:8

WORKDIR /app

COPY . /app

EXPOSE 8086

RUN npm i

CMD npm start
