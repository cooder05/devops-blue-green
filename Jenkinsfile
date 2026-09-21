pipeline {
    agent any

    environment {
        IMAGE = "node-blue-green"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                        -t ${IMAGE}:${TAG} \
                        -t ${IMAGE}:latest .
                '''
            }
        }

        stage('Deploy Green') {
            steps {
                sh '''
                    docker stop node-green || true
                    docker rm node-green || true

                    docker run -d \
                        --name node-green \
                        -p 3002:3000 \
                        -e VERSION=${TAG} \
                        ${IMAGE}:${TAG}
                '''
            }
        }

        stage('Test Green') {
            steps {
                sh '''
                    sleep 5

                    curl --fail http://localhost:3002/ || exit 1
                '''
            }
        }

        stage('Switch to Green') {
            steps {
                sh '''
                    echo "Green deployment successful"
                    echo "New version: ${TAG}"
                '''
            }
        }
    }

    post {
        success {
            echo 'Blue-Green deployment completed successfully.'
        }

        failure {
            echo 'Green deployment failed. Blue remains active.'
        }
    }
}
