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
        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm test'
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
            echo 'Build y Tests OK. Todo compiló y pasó las pruebas correctamente.'
        }
        failure {
            echo 'El pipeline falló. Algún test no pasó o hubo un error en la compilación.'
        }
        always {
            cleanWs()
        }
    }
}
