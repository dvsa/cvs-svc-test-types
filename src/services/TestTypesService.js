'use strict'

const HTTPError = require('../models/HTTPError')

class TestTypesService {
  constructor (testTypesDAO) {
    this.testTypesDAO = testTypesDAO
  }

  getTestTypesList () {
    return this.testTypesDAO.getAll()
      .then((data) => {
        if (data.Count === 0) {
          throw new HTTPError(404, 'No resources match the search criteria.')
        }

        this.purgeTestTypes(data.Items)
        return this.sort(data.Items)
      })
      .catch((error) => {
        if (!(error instanceof HTTPError)) {
          console.error(error)
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }

        throw new HTTPError(error.statusCode, error.body)
      })
  }

  getTestTypesById (id, filterExpression) {
    return this.testTypesDAO.getAll()
      .then((data) => {
        if (data.Count === 0) {
          throw new HTTPError(404, 'No resources match the search criteria.')
        }

        return data.Items
      })
      .then((testTypes) => {
        return this.findTestType(id, testTypes)
      })
      .then((testType) => {
        if (testType === null) {
          throw new HTTPError(404, 'No resources match the search criteria.')
        }
        let testCodes = testType.testCodes

        testCodes = testCodes.filter((testCode) => { // filter by vehicleType if present in DB, otherwise skip
          return testCode.forVehicleType ? testCode.forVehicleType === filterExpression.vehicleType : true
        })
        testCodes = testCodes.filter((testCode) => { // filter by vehicleSize if present in DB, otherwise skip
          return (testCode.forVehicleSize && filterExpression.vehicleSize) ? testCode.forVehicleSize === filterExpression.vehicleSize : true
        })
        testCodes = testCodes.filter((testCode) => { // filter by vehicleConfiguration if present in DB, otherwise skip
          return testCode.forVehicleConfiguration ? testCode.forVehicleConfiguration === filterExpression.vehicleConfiguration : true
        })
        testCodes = testCodes.filter((testCode) => { // filter by vehicleAxles if present in DB & and in request, otherwise skip
          return (testCode.forVehicleAxles && filterExpression.vehicleAxles) ? testCode.forVehicleAxles === filterExpression.vehicleAxles : true
        })

        if (testCodes.length === 0) {
          throw new HTTPError(404, 'No resources match the search criteria.')
        }

        let response = {
          id: testType.id
        }

        filterExpression.fields // Iterate through filterExpression's fields and populate them in the response
          .forEach((field) => {
            response[field] = testCodes[0][field]
          })

        // Populating testTypeClassification that is found in testType, not testCode
        if (filterExpression.fields.includes('testTypeClassification')) {
          response['testTypeClassification'] = testType.testTypeClassification
        }

        return response
      })
  }

  findTestType (id, testTypes) {
    for (let i = 0; i < testTypes.length; i++) {
      let testType = testTypes[i]
      if (testType.hasOwnProperty('nextTestTypesOrCategories')) {
        let childrenTestType = this.findTestType(id, testType.nextTestTypesOrCategories)

        if (childrenTestType != null) {
          return childrenTestType
        }
      } else if (testType.hasOwnProperty('id') && testType.id === id) {
        return testType
      }
    }

    return null
  }

  sort (testTypes) {
    // Pass by value
    let testTypeArray = testTypes

    for (let i = 0; i < testTypeArray.length; i++) {
      let testType = testTypeArray[i]

      if (testType.hasOwnProperty('nextTestTypesOrCategories')) {
        Object.assign(testTypeArray, { nextTestTypesOrCategories: this.sort(testType.nextTestTypesOrCategories) })
      }
    }

    return testTypeArray.sort((a, b) => parseInt(a.id) - parseInt(b.id))
  }

  purgeTestTypes (testTypes) {
    for (let i = 0; i < testTypes.length; i++) {
      let testType = testTypes[i]
      if (testType.hasOwnProperty('nextTestTypesOrCategories')) {
        this.purgeTestTypes(testType.nextTestTypesOrCategories)
      } else if (testType.hasOwnProperty('id')) {
        delete testType.testTypeClassification
        delete testType.testCodes
      }
    }
  }

  insertTestTypesList (testTypesItems) {
    return this.testTypesDAO.createMultiple(testTypesItems)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal Server Error')
        }
      })
  }

  deleteTestTypesList (testTypesItemKeys) {
    return this.testTypesDAO.deleteMultiple(testTypesItemKeys)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal Server Error')
        }
      })
  }
}

module.exports = TestTypesService
