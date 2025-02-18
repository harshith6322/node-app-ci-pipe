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
        IMAGE_NAME = 'harshithreddy6322/your-node-app-jenkins'
    }
    // Optional: Trigger the build on SCM changes (if not using GitHub webhooks)
    triggers {
        pollSCM('* * * * *')
    }
    stages {
        stage('Checkout') {
            steps {
                // Clone your GitHub repository; adjust branch and URL as needed
                git branch: 'main', url: 'https://github.com/harshith6322/node-app-ci-pipe.git'
            }
        }
        stage('Install Dependencies & Test') {
            steps {
                sh 'npm install'
                sh 'npm test | true'
            }
        }
        stage('OWASP Dependency Check') {
            steps {
                // Run a security scan using OWASP dependency-check (ensure it’s available or install it on the fly)
                sh '''
                    npm install -g owasp-dependency-check
                    npm run owasp-check
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
