# ============================================================================
# PROJECT SAAYA - BACKEND API DOCKERFILE
# ============================================================================
# Purpose: Containerize the Node.js backend for DevOps deployment
# Base Image: Alpine Linux (lightweight, security-focused)
# ============================================================================

# Use official Node.js 18 Alpine image (minimal footprint ~40MB)
FROM node:18-alpine

# Set metadata labels (best practice for container management)
LABEL maintainer="Project Saaya Team"
LABEL description="Digital Twin Backend API for Women's Safety IoT Platform"
LABEL version="1.0.0"

# Set working directory inside container
WORKDIR /app

# Copy package files first (Docker layer caching optimization)
# This layer will only rebuild if package.json/package-lock.json changes
COPY package*.json ./

# Install production dependencies only (smaller image size)
RUN npm install --production

# Copy all source code (MVC structure: models, controllers, routes, config)
COPY . .

# Expose port 5000 for external access
EXPOSE 5000

# Health check for Docker/Kubernetes orchestration
# Checks if the /health endpoint responds every 30 seconds
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Run the server
CMD ["node", "server.js"]

# ============================================================================
# BUILD & RUN INSTRUCTIONS
# ============================================================================
# 
# Build the Docker image:
#   docker build -t project-saaya-backend:latest .
#
# Run the container:
#   docker run -d -p 5000:5000 --name saaya-backend project-saaya-backend:latest
#
# Check container logs:
#   docker logs -f saaya-backend
#
# Stop the container:
#   docker stop saaya-backend
#
# ============================================================================
