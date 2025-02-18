pipeline {
    // Define the build agent – here we run our pipeline steps inside a Docker container running Node.js
    agent {
        docker {
            image 'node:20'  // Use your preferred Node version
            args '--user root'
        }
    }
    // Set environment variables used across stages
    environment {
        DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials'  // This should match your Jenkins credentials ID
        IMAGE_NAME = 'your-dockerhub-username/your-node-app'
    }
    // Optional: Trigger the build on SCM changes (if not using GitHub webhooks)
    triggers {
        pollSCM('* * * * *')
    }
    stages {
        stage('Checkout') {
            steps {
                // Clone your GitHub repository; adjust branch and URL as needed
                git branch: 'main', url: 'https://github.com/YourUsername/YourRepo.git'
            }
        }
        stage('Install Dependencies & Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('OWASP Dependency Check') {
            steps {
                // Run a security scan using OWASP dependency-check (ensure it’s available or install it on the fly)
                sh '''
                    npm install -g owasp-dependency-check
                    dependency-check --project "NodeApp" --scan . --format HTML --out owasp-report.html
                '''
            }
        }
        stage('Build Docker Image') {
            steps {
                // Build a Docker image using the Dockerfile in your repository
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    // Log in to Docker Hub and push the built image using stored credentials
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        sh "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }
        stage('Deploy (CD)') {
            steps {
                // Optionally, deploy your app by SSH-ing into a production server and running Docker commands
                sshagent(credentials: ['your-ssh-key']) {
                    sh '''
                      ssh -o StrictHostKeyChecking=no user@your-production-server << 'EOF'
                      docker pull ${IMAGE_NAME}:latest
                      docker stop node-app || true
                      docker rm node-app || true
                      docker run -d --name node-app -p 80:3000 ${IMAGE_NAME}:latest
                      EOF
                    '''
                }
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check logs and reports.'
        }
        always {
            // Archive the OWASP report even if it is empty or build fails
            archiveArtifacts artifacts: 'owasp-report.html', allowEmptyArchive: true
        }
    }
}
