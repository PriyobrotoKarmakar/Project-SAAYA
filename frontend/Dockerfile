# ============================================================================
# PROJECT SAAYA - FRONTEND DOCKERFILE (Multi-Stage Build)
# ============================================================================
# Stage 1: Build the React application using Vite
# Stage 2: Serve static files using Nginx
# ============================================================================

# Stage 1: Build Stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React app (Vite outputs to /dist)
RUN npm run build

# Stage 2: Production Stage with Nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for web traffic
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# ============================================================================
# BUILD INSTRUCTIONS
# ============================================================================
# 
# Build the image:
#   docker build -t saaya-frontend:latest .
#
# Run the container:
#   docker run -d -p 3000:80 --name saaya-frontend saaya-frontend:latest
#
# Access the app:
#   http://localhost:3000
#
# ============================================================================
