const AWS = require('aws-sdk')
const config = require('../config/config')

const dbClient = new AWS.DynamoDB.DocumentClient(
  (config.ENV === 'local') ? { region: config.OFFLINE.DYNAMODB_REGION, endpoint: config.OFFLINE.DYNAMODB_ENDPOINT } : {})

class TestTypesDAO {
  constructor () {
    (config.ENV === 'local') ? (this.tableName = `cvs-${config.ENV}-${config.OFFLINE.COMPONENT}-TestTypes`) : (this.tableName = `cvs-${config.ENV}-${config.COMPONENT}-TestTypes`)
  }

  getAll () {
    return dbClient.scan({ TableName: this.tableName }).promise()
  }

  createMultiple (testTypesItems) {
    var params = this.generatePartialParams()

    testTypesItems.forEach(testTypesItem => {
      params.RequestItems[this.tableName].push({
        PutRequest: {
          Item: testTypesItem
        }
      })
    })

    return dbClient.batchWrite(params).promise()
  }

  deleteMultiple (primaryKeysToBeDeleted) {
    var params = this.generatePartialParams()

    primaryKeysToBeDeleted.forEach(compositeKey => {
      params.RequestItems[this.tableName].push({
        DeleteRequest: {
          Key: {
            id: compositeKey[0],
            name: compositeKey[1]
          }
        }
      })
    })

    return dbClient.batchWrite(params).promise()
  }

  generatePartialParams () {
    return {
      RequestItems: {
        [this.tableName]: []
      }
    }
  }
}

module.exports = TestTypesDAO
