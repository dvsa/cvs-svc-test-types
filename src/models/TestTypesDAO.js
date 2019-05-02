const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const Configuration = require('../utils/Configuration')
const dbConfig = Configuration.getInstance().getDynamoDBConfig()
const dbClient = new AWS.DynamoDB.DocumentClient(dbConfig.params)

class TestTypesDAO {
  constructor () {
    this.tableName = dbConfig.table
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
