pipeline {
  agent any
  stages {
    stage('check') {
      steps {
        git(url: 'https://github.com/antanvault/auth.git', branch: 'main')
      }
    }

    stage('') {
      steps {
        sh 'ls -la'
      }
    }

  }
}