# ===============================================
FROM node:alpine
# ===============================================

# Install build dependencies
RUN apk add --no-cache python g++ make
ENV NODE_ENV=development
# Set the working directory
WORKDIR /app

# Add `/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

# Install dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY config_dev.toml.example config_dev.toml
RUN npm install

# Copy all files
COPY . .

# Start express server
CMD [ "npm", "start" ]

# Expose port 8086
EXPOSE 8086