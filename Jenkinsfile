pipeline {
    agent any

    environment {
        IMAGE = "node-blue-green"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE%:%TAG% .'
            }
        }

        stage('Deploy Green') {
            steps {
                bat '''
                    docker stop node-green 2>NUL
                    docker rm node-green 2>NUL

                    docker run -d ^
                        --name node-green ^
                        -p 3002:3000 ^
                        -e VERSION=%TAG% ^
                        %IMAGE%:%TAG%
                '''
            }
        }

        stage('Test Green') {
            steps {
                bat '''
                    timeout /t 5 /nobreak
                    curl --fail http://localhost:3002/
                '''
            }
        }

        stage('Deployment Complete') {
            steps {
                echo 'Green deployment completed successfully.'
            }
        }
    }

    post {
        success {
            echo 'Blue-Green deployment successful.'
        }

        failure {
            echo 'Deployment failed. Blue remains available.'
        }
    }
}
