pipeline {
    agent {
        docker { image 'node:22' }
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
                    sh 'rm -f package-lock.json'
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }
        stage('Install frontend dependencies') {
            steps {
                dir('frontend') {
                    sh 'rm -f package-lock.json'
                    sh 'npm install --legacy-peer-deps'
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
