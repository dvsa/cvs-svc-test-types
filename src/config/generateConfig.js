function generateConfig () {
  var BRANCH = process.env.BRANCH

  var localConfig =
  {
    DYNAMODB_DOCUMENTCLIENT_PARAMS:
    {
      region: 'localhost',
      endpoint: 'http://localhost:8002/'
    },
    DYNAMODB_TABLE_NAME: 'cvs-' + BRANCH + '-test-types'
  }

  var pipelineConfig =
  {
    DYNAMODB_DOCUMENTCLIENT_PARAMS: {},
    DYNAMODB_TABLE_NAME: 'cvs-' + BRANCH + '-test-types'
  }

  if (!BRANCH) {
    console.error('Please define BRANCH environment variable')
  } else if (BRANCH === 'local') {
    return localConfig
  } else {
    return pipelineConfig
  }
}

module.exports = generateConfig
