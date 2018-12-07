'use strict'

const TestTypesDAO = require('../models/TestTypesDAO')
const TestTypesService = require('../services/TestTypesService')

const getTestTypes = () => {
  const testTypes = new TestTypesDAO()
  const testTypesService = new TestTypesService(testTypes)

  return testTypesService.getTestTypesList()
    .then((data) => {
      return {
        statusCode: 200,
        body: JSON.stringify(data)
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
