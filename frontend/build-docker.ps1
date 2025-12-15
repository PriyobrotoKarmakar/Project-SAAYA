# Frontend Docker Build Script (PowerShell)
# This script ensures .env is available during Docker build

Write-Host "🔧 Preparing frontend Docker build..." -ForegroundColor Cyan

# Copy .env from root to frontend directory
if (Test-Path "../.env") {
    Write-Host "✅ Copying .env from root directory..." -ForegroundColor Green
    Copy-Item -Path "../.env" -Destination ".env" -Force
} else {
    Write-Host "❌ ERROR: .env file not found in root directory!" -ForegroundColor Red
    Write-Host "Expected location: ../.env" -ForegroundColor Yellow
    exit 1
}

# Build Docker image
Write-Host "🐳 Building Docker image..." -ForegroundColor Cyan
docker build -t priyobrotokarmakar/saaya-frontend:latest .

# Check build status
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker build successful!" -ForegroundColor Green
    
    # Clean up copied .env
    Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
    Remove-Item -Path ".env" -Force -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "🚀 To push the image, run:" -ForegroundColor Yellow
    Write-Host "   docker push priyobrotokarmakar/saaya-frontend:latest" -ForegroundColor White
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    Remove-Item -Path ".env" -Force -ErrorAction SilentlyContinue
    exit 1
}
