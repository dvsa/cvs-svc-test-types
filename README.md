# cvs-svc-test-types

#### Run AWS Lambda node functions locally with a mock API Gateway and DynamoDB to test against
- `npm install`
- `node_modules/.bin/sls dynamodb install`
- `npm start` to start serverless locally with default ports
-  `IS_OFFLINE=true DYNAMO_PORT={dynamodb port} SERVERLESS_PORT={serverless port} ./node_modules/serverless/bin/serverless offline start` to start serverless locally with custom ports

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

### Testing
In order to test, you need to run the following:
- `npm run test` for unit tests
- `npm run test-i` for integration tests


### Environmental variables

- The `IS_OFFLINE` environment variable needs to be set to `true` in order for the microservice to connect to the local dynamodb instance. Defaults to `true`
- The `SERVERLESS_PORT` environment variable needs to be set to a value representing the port you want the serverless instance to run on. This variable is mandatory. Defaults to `3000`
- The `DYNAMO_PORT` environment variable needs to be set to a value representing the port you want the dynamodb shell to run on. This variable is mandatory. Defaults to `8000`.
