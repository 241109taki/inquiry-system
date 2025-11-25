# Development Dockerfile for NestJS
FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for some native modules
RUN apk add --no-cache python3 make g++

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the API port
EXPOSE 4000

# Start in development mode (hot reload)
CMD ["npm", "run", "start:dev"]