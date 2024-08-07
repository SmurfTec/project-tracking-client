pipeline {
    agent { label 'firstnode' }
    stages {
        stage("Copy Code") {
            steps {
                dir('/home/projects/nextprojects/project-tracking-client') {
                    sh "sudo cp -r /${WORKSPACE}/** ./"
                }
            }
        }
        stage("Pm2 Process") {
            steps {
                dir('/home/projects/nextprojects/project-tracking-client') {
                    sh "npm install --legacy-peer-deps"
                    sh "npm run build"
                    sh "sudo pm2 restart 2"
                }
            }
        }
    }
}
