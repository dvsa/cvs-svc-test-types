def label = "jenkins-node-${UUID.randomUUID().toString()}"
podTemplate(label: label, containers: [
    containerTemplate(name: 'node', image: '086658912680.dkr.ecr.eu-west-1.amazonaws.com/cvs/nodejs-builder:latest', ttyEnabled: true, alwaysPullImage: true, command: 'cat'),]){
    node(label) {

        stage('checkout') {
            checkout scm
        }

        container('node'){
            
                    withFolderProperties{
                        LBRANCH="${env.BRANCH}".toLowerCase()
            }
            
            stage ("npm deps") {
                sh "npm install"
            }

            stage ("security") {
                 sh "git secrets --register-aws"
                 sh "git secrets --scan"
                 sh "git log -p | scanrepo"
            }
            stage ("sonar") {
                sh "npm run sonar-scanner"
            }

            stage ("unit test") {
                sh "npm run test"
            }

            stage ("integration test") {
                sh "node_modules/gulp/bin/gulp.js start-serverless"
                sh "npm run test-i"
            }

            stage("zip dir"){
                sh "rm -rf ./node_modules"
                sh "npm install --production"
                sh "mkdir ${LBRANCH}"
                sh "cp -r src/* ${LBRANCH}/"
                sh "cp -r node_modules ${LBRANCH}/node_modules"
                sh "zip -qr ${LBRANCH}.zip ${LBRANCH}"
            }

            stage("upload to s3") {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                       accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                           credentialsId: 'jenkins-iam',
                       secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {

                sh "aws s3 cp ${LBRANCH}.zip s3://cvs-services/atf/${LBRANCH}.zip"
                }
            }
        }
    }
}
