'use strict'

const TestTypesDAO = require('../models/TestTypesDAO')
const TestTypesService = require('../services/TestTypesService')
const HTTPResponse = require('../models/HTTPResponse')

const getTestTypes = () => {
  const testTypes = new TestTypesDAO()
  const testTypesService = new TestTypesService(testTypes)

  return testTypesService.getTestTypesList()
    .then((data) => {
      return new HTTPResponse(200, JSON.stringify(data))
    })
    .catch((error) => {
      console.log(error)

      return new HTTPResponse(error.statusCode, JSON.stringify(error.body))
    })
}

module.exports = getTestTypes
