# Stage 1: Build the Vite app
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:stable-alpine

# Remove default config and copy custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the standard HTTP port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
