FROM node:18-slim

# Create non-root user
RUN useradd -m appuser  

# Set working directory
WORKDIR /home/appuser/app

# Copy and install dependencies
COPY package*.json ./
RUN npm install --omit-dev

# Copy source code
COPY . .

# Set permissions
RUN chown -R appuser:appuser /home/appuser/app

# Switch to non-root user
USER appuser

# Expose port (adjust based on your app, e.g., Vite uses 5173)
EXPOSE 5173

# Correct way to run npm script
CMD ["npm", "run", "dev"]
