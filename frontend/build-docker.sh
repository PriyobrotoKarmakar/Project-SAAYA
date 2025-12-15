#!/bin/bash

# Frontend Docker Build Script
# This script ensures .env is available during Docker build

echo "🔧 Preparing frontend Docker build..."

# Copy .env from root to frontend directory
if [ -f "../.env" ]; then
    echo "✅ Copying .env from root directory..."
    cp ../.env .env
else
    echo "❌ ERROR: .env file not found in root directory!"
    echo "Expected location: ../env"
    exit 1
fi

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t priyobrotokarmakar/saaya-frontend:latest .

# Check build status
if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    # Clean up copied .env
    echo "🧹 Cleaning up..."
    rm -f .env
    
    echo ""
    echo "🚀 To push the image, run:"
    echo "   docker push priyobrotokarmakar/saaya-frontend:latest"
else
    echo "❌ Docker build failed!"
    rm -f .env
    exit 1
fi
