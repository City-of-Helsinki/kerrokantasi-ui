FROM node:8

# At this stage everything might be useful

WORKDIR /app

COPY . /app

EXPOSE 8086

# Create config from env and serve web root with httpd
CMD npm start
