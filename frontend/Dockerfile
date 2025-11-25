# Development Dockerfile for React (Vite)
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite port
EXPOSE 3000

# Start Vite server with host exposure
# --host is required for Docker
CMD ["npm", "run", "dev", "--", "--host"]