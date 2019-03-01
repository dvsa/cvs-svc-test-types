# cvs-svc-test-types

#### Run AWS Lambda node functions locally with a mock API Gateway and DynamoDB to test against
- `npm install`
- `node_modules/.bin/sls dynamodb install`
- `npm start`

### Git Hooks

Please set up the following prepush git hook in .git/hooks/pre-push

```
#!/bin/sh
npm run prepush && git log -p | scanrepo

```

#### Security

Please install and run the following securiy programs as part of your testing process:

https://github.com/awslabs/git-secrets

- After installing, do a one-time set up with `git secrets --register-aws`. Run with `git secrets --scan`.

https://github.com/UKHomeOffice/repo-security-scanner

- After installing, run with `git log -p | scanrepo`.

These will be run as part of prepush so please make sure you set up the git hook above so you don't accidentally introduce any new security vulnerabilities.

### DynamoDB
If you want the database to be populated with mock data on start, in your `serverless.yml` file, you need to set `seed` to `true`. You can find this setting under `custom > dynamodb > start`.

If you choose to run the DynamoDB instance separately, you can send the seed command with the following command:

```sls dynamodb seed --seed=seed_name```

Under `custom > dynamodb > seed` you can define new seed operations with the following config:
```
custom:
    dynamodb:
        seed:
          seed_name:
            sources:
            - table: TABLE_TO_SEED
              sources: [./path/to/resource.json]
```

### Testing
In order to test, you need to run the following:
- `npm run test` for unit tests
- `npm run test-i` for integration tests


### SonarQube
In order to generate SonarQube reports on local, follow the steps:
- Download SonarQube server -> https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-7.6.zip
- Download SonarQube scanner -> https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.3.0.1492-macosx.zip
- Add sonar-scanner in environment variables -> In .brash_profile add the line "export PATH=<PATH_TO_SONAR_SCANNER>/sonar-scanner-3.3.0.1492-macosx/bin:$PATH"
- Start the SonarQube server -> cd <PATH_TO_SONARQUBE_SERVER>/bin/macosx-universal-64 ./sonar.sh start
- In the microservice folder run the command -> npm run sonar-scanner


### Environmental variables

- The `ENV` environment variable indicates in which environment is this application running. Use `ENV=local` for local deployment. This variable is required when starting the application or running tests.
