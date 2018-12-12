const AWS = require('aws-sdk')
const generateConfig = require('../config/generateConfig')
const config = generateConfig()
const dbClient = new AWS.DynamoDB.DocumentClient(config.DYNAMODB_DOCUMENTCLIENT_PARAMS)

class TestTypesDAO {
  constructor () {
    this.tableName = config.DYNAMODB_TABLE_NAME
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
            testCategoryNumber: compositeKey[0],
            testType: compositeKey[1]
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
