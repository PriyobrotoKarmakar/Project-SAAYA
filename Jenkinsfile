pipeline {
    agent any

    environment {
        // Environment variables for dynamic registry configuration
        DOCKERHUB_USER = 'priyobrotokarmakar'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        // Stage 1: Source Code Management
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/PriyobrotoKarmakar/Project-SAAYA.git'
            }
        }

        // Stage 2: Build Artifacts (Backend AND Frontend)
        stage('Build Artifacts') {
            steps {
                script {
                    // 1. Build Backend Image
                    echo '🐳 Building Backend Image...'
                    dir('backend') {
                        sh "docker build -t ${DOCKERHUB_USER}/saaya-backend:latest ."
                    }

                    // 2. Build Frontend Image with .env from root
                    echo '🐳 Building Frontend Image...'
                    dir('frontend') {
                        // ✅ FIX: Copy .env from root directory for Vite build
                        sh "cp ../.env .env"
                        sh "docker build -t ${DOCKERHUB_USER}/saaya-frontend:latest ."
                        // Clean up .env for security
                        sh "rm -f .env"
                    }

                    // 3. Start Backend for ephemeral testing
                    // Check if container exists first to avoid conflict
                    sh "docker rm -f saaya-qa-server || true"
                    sh "docker run -d -p 5000:5000 --name saaya-qa-server ${DOCKERHUB_USER}/saaya-backend:latest"
                    
                    echo '⏳ Waiting for backend to initialize...'
                    sh "sleep 10" 
                }
            }
        }

        // Stage 3: Quality Assurance Gate
        stage('Maven Quality Gate') {
            steps {
                dir('qa-suite') {
                    sh 'mvn test' // Executes Selenium & Unit Tests
                }
            }
        }

        // Stage 4: Artifact Distribution
        stage('Push to Cloud') {
            steps {
                // Secure login and push to Docker Hub
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    
                    echo '🚀 Pushing Backend...'
                    sh "docker push ${DOCKERHUB_USER}/saaya-backend:latest"
                    
                    echo '🚀 Pushing Frontend...'
                    sh "docker push ${DOCKERHUB_USER}/saaya-frontend:latest"
                }
            }
        }
    }

    // Post-build actions to clean up resources
    post {
        always {
            echo '🧹 Cleaning up test containers...'
            sh "docker rm -f saaya-qa-server || true"
        }
    }
}
