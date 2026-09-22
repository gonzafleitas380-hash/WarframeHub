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
            echo 'Build OK. Todo compiló correctamente sin tests.'
        }
        failure {
            echo 'El pipeline falló en la instalación o compilación.'
        }
        always {
            cleanWs()
        }
    }
}
