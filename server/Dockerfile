# Use official Node.js 20 image
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# # Install Nest CLI globally
# RUN npm install -g @nestjs/cli

# Copy the rest of your app
COPY . .

# Expose the backend port
EXPOSE 3900

# Start development server
CMD ["npm", "run", "start:dev"]
