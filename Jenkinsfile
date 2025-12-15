pipeline {
    agent any

    environment {
      
        DOCKERHUB_USER = 'priyobrotokarmakar'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
     
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/PriyobrotoKarmakar/Project-SAAYA.git'
            }
        }

        
        stage('Build Artifacts') {
            steps {
                script {
                  
                    echo 'Building Backend Image...'
                    dir('backend') {
                        sh "docker build -t ${DOCKERHUB_USER}/saaya-backend:latest ."
                    }

                  
                    echo 'Building Frontend Image...'
                    dir('frontend') {
                    
                        sh "cp ../.env .env"
                        sh "docker build -t ${DOCKERHUB_USER}/saaya-frontend:latest ."
                       
                        sh "rm -f .env"
                    }

               
                    sh "docker rm -f saaya-qa-server || true"
                    sh "docker run -d -p 5000:5000 --name saaya-qa-server ${DOCKERHUB_USER}/saaya-backend:latest"
                    
                    echo 'Waiting for backend to initialize...'
                    sh "sleep 10" 
                }
            }
        }

       
        stage('Maven Quality Gate') {
            steps {
                dir('qa-suite') {
                    sh 'mvn test' 
                }
            }
        }


        stage('Push to Cloud') {
            steps {
             
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    
                    echo 'Pushing Backend...'
                    sh "docker push ${DOCKERHUB_USER}/saaya-backend:latest"
                    
                    echo 'Pushing Frontend...'
                    sh "docker push ${DOCKERHUB_USER}/saaya-frontend:latest"
                }
            }
        }
    }

   
    post {
        always {
            echo ' Cleaning up test containers...'
            sh "docker rm -f saaya-qa-server || true"
        }
    }
}
