pipeline {
    agent {
        docker { image 'node:20' }
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install backend dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        stage('Install frontend dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
        stage('Build frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
    }
    post {
        success {
            echo 'Build OK. Frontend compilado correctamente.'
        }
        failure {
            echo 'El pipeline falló. Revisar el log de la etapa correspondiente.'
        }
        always {
            cleanWs()
        }
    }
}
