pipeline {

  agent none

  stages {

    stage('Checkout') {
      agent{label("uoa-buildtools-small")}
      steps {
        checkout scm
      }
    }

    stage('Build DEVELOPMENT') {
      agent {
        docker {
          label 'uoa-buildtools-small'
          image 'node:12-alpine'
          args '--user=root' // be root inside container so npm can access the node_modules in the current work directory (owned by Jenkins)
        }
      }
      steps {
        sh "npm install"
        sh "npm install -g @angular/cli"

        sh "node --version"
        sh "npm --version"
        sh "ng --version"

        sh "rm -rf dist/dev/"
        sh "sed -i -e 's#COMMIT_ID#${env.GIT_COMMIT}#' ./src/environments/environment.dev.ts"
        sh "sed -i -e s/BUILD_TIME/\$(date  +%Y%m%d%H%M)/ ./src/environments/environment.dev.ts"
        sh "ng build --configuration=dev --output-path=dist/dev/"
      }
    }

    stage('Deploy DEVELOPMENT') {
      agent{label("uoa-buildtools-small")}
      steps {
        echo 'Copying build artifact to development environment'

        sshagent (credentials: ['webfiles2-nonprod']) {
          sh "/usr/bin/rsync --verbose --modify-window=1 -rv --del dist/dev/* jenkawsprd@webfiles2.dev.auckland.ac.nz:/var/www/sites/athena.dev.auckland.ac.nz/"
        }
      }
    }

    stage('Build TEST') {
      agent {
        docker {
          label 'uoa-buildtools-small'
          image 'node:12-alpine'
          args '--user=root' // be root inside container so npm can access the node_modules in the current work directory (owned by Jenkins)
        }
      }
      steps {
        sh "npm install"
        sh "npm install -g @angular/cli"

        sh "rm -rf dist/test/"
        sh "sed -i -e 's#COMMIT_ID#${env.GIT_COMMIT}#' ./src/environments/environment.test.ts"
        sh "sed -i -e s/BUILD_TIME/\$(date  +%Y%m%d%H%M)/ ./src/environments/environment.test.ts"
        sh "ng build --configuration=test --output-path=dist/test/"
      }
    }

    stage('Deploy TEST') {
      agent{label("uoa-buildtools-small")}
      steps {
        timeout(time: 10, unit: 'MINUTES') {
          input message: 'Approve release and deployment to TEST?'
        }
        echo 'Copying build artifact to test environment'

        sshagent (credentials: ['webfiles2-nonprod']) {
          sh "/usr/bin/rsync --modify-window=1 -rv --del dist/test/* jenkawsprd@webfiles2.test.auckland.ac.nz:/var/www/sites/athena.test.auckland.ac.nz/"
        }
      }
    }

    stage('Build PRODUCTION') {
      agent {
        docker {
          label 'uoa-buildtools-small'
          image 'node:12-alpine'
          args '--user=root' // be root inside container so npm can access the node_modules in the current work directory (owned by Jenkins)
        }
      }
      steps {
        sh "npm install"
        sh "npm install -g @angular/cli"

        sh "rm -rf dist/prod/"
        sh "sed -i -e 's#COMMIT_ID#${env.GIT_COMMIT}#' ./src/environments/environment.prod.ts"
        sh "sed -i -e s/BUILD_TIME/\$(date  +%Y%m%d%H%M)/ ./src/environments/environment.prod.ts"
        sh "ng build --configuration=production --output-path=dist/prod/"
      }
    }

    stage('Deploy PRODUCTION') {
      agent{label("uoa-buildtools-small")}
      steps {
        timeout(time: 30, unit: 'MINUTES') {
          input message: 'Approve release and deployment to PRODUCTION?'
        }
        echo 'Copying build artifact to production environment'

        sshagent (credentials: ['webfiles2-prod']) {
          sh "/usr/bin/rsync --modify-window=1 -rv --del dist/prod/* jenkawsprd@webwwwprd01.its.auckland.ac.nz:/var/www/sites/athena.auckland.ac.nz/"
        }
      }
    }
  }
}
