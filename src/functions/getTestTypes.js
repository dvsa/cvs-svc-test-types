'use strict'

const TestTypesDAO = require('../models/TestTypesDAO')
const TestTypesService = require('../services/TestTypesService')

const getTestTypes = () => {
  const testTypes = new TestTypesDAO()
  const testTypesService = new TestTypesService(testTypes)

  return testTypesService.getTestTypesList()
    .then((response) => {
      return {
        statusCode: response.statusCode,
        headers: response.headers,
        body: JSON.stringify(response.body)
      }
    })
    .catch((error) => {
      console.log(error)

      return {
        statusCode: error.statusCode,
        headers: error.headers,
        body: JSON.stringify(error.body)
      }
    })
}

module.exports = getTestTypes
