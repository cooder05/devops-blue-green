pipeline {
    agent any

    environment {
        IMAGE = "your-dockerhub-username/node-blue-green"
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
                sh """
                    docker build \
                    -t ${IMAGE}:${TAG} .
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin

                        docker push ${IMAGE}:${TAG}
                    '''
                }
            }
        }

        stage('Deploy Green') {
            steps {
                sh '''
                    docker pull ${IMAGE}:${TAG}

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
                    curl --fail http://localhost:3002/
                '''
            }
        }

        stage('Switch to Green') {
            steps {
                sh '''
                    echo "Green deployment successful."
                    echo "Green is ready to receive production traffic."
                '''
            }
        }
    }

    post {
        success {
            echo 'Blue-Green deployment completed successfully.'
        }

        failure {
            echo 'Green deployment failed. Blue remains available.'
        }
    }
}
