pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    environment {
        IMAGE = "node-blue-green"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat '"%DOCKER%" build -t %IMAGE%:%TAG% .'
            }
        }

        stage('Deploy Green') {
            steps {
                bat '''
                    "%DOCKER%" stop node-green 2>NUL
                    "%DOCKER%" rm node-green 2>NUL

                    "%DOCKER%" run -d ^
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
            echo 'Green deployment successful.'
        }

        failure {
            echo 'Green deployment failed. The existing deployment was not changed.'
        }
    }
}
