pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = "nareshgundavelli/react-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Nareshgundavelli/frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:${BUILD_NUMBER} .'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                docker tag $IMAGE_NAME:${BUILD_NUMBER} $IMAGE_NAME:latest
                docker push $IMAGE_NAME:${BUILD_NUMBER}
                docker push $IMAGE_NAME:latest
                '''
            }
        }

        stage('Clean Up') {
            steps {
                sh 'docker rmi $IMAGE_NAME:${BUILD_NUMBER} || true'
                sh 'docker rmi $IMAGE_NAME:latest || true'
            }
        }
    }

    post {
        success {
            echo "✅ Frontend Docker image built and pushed successfully!"
        }
        failure {
            echo "❌ Pipeline failed — check Jenkins logs."
        }
    }
}
