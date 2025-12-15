# Jenkins Pipeline Configuration for Project SAAYA

## Problem: Frontend Can't Access Root .env File

When Jenkins builds the Docker image, the build context is `frontend/` folder, so it cannot access `../.env` in the parent directory.

## Solution

Your Jenkins pipeline needs to copy `.env` to `frontend/` before building the Docker image.

### Updated Jenkins Pipeline (Groovy)

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials-id')
        FRONTEND_IMAGE = 'priyobrotokarmakar/saaya-frontend'
        BACKEND_IMAGE = 'priyobrotokarmakar/saaya-backend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        // Copy .env from root to frontend
                        sh 'cp ../.env .env'
                        
                        // Build Docker image
                        sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                        
                        // Clean up .env (security)
                        sh 'rm -f .env'
                    }
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        sh "docker build -t ${BACKEND_IMAGE}:latest ."
                    }
                }
            }
        }
        
        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials-id') {
                        sh "docker push ${FRONTEND_IMAGE}:latest"
                        sh "docker push ${BACKEND_IMAGE}:latest"
                    }
                }
            }
        }
        
        stage('Deploy to K8s') {
            steps {
                script {
                    // Apply ConfigMap
                    sh 'kubectl apply -f k8s/configmap.yaml'
                    
                    // Apply deployments
                    sh 'kubectl apply -f k8s/saaya-deployment.yaml'
                    
                    // Restart deployments to pull new images
                    sh 'kubectl rollout restart deployment saaya-frontend'
                    sh 'kubectl rollout restart deployment saaya-backend'
                }
            }
        }
    }
    
    post {
        always {
            // Clean up Docker images
            sh 'docker system prune -f'
        }
    }
}
```

## Manual Build (Until Jenkins is Updated)

Since your Jenkins might not have this fix yet, build manually:

### Windows (PowerShell)
```powershell
cd frontend
.\build-docker.ps1
docker push priyobrotokarmakar/saaya-frontend:latest
```

### Linux/Mac
```bash
cd frontend
chmod +x build-docker.sh
./build-docker.sh
docker push priyobrotokarmakar/saaya-frontend:latest
```

### Then restart K8s deployment
```bash
kubectl rollout restart deployment saaya-frontend
```

## Verification

After deployment, check the logs:
```bash
# Check if new image is pulled
kubectl describe pod saaya-frontend-xxxxx | grep Image

# Check JavaScript bundle hash changed
kubectl exec -it saaya-frontend-xxxxx -- ls -la /usr/share/nginx/html/assets/

# Test frontend
curl http://3.85.12.128:30007
```

## Security Note

The `.env` file is:
1. Copied into Docker build context (temporary)
2. Used during `npm run build` to bake variables into JavaScript
3. Deleted from the final image (not in runtime)
4. Cleaned up after build

This is secure because:
- `.env` is only used at build time, not stored in image
- Docker multi-stage build discards build artifacts
- Final image only contains compiled JavaScript bundle
