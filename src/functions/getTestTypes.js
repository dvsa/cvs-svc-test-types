'use strict'

const TestTypesDAO = require('../models/TestTypesDAO')
const TestTypesService = require('../services/TestTypesService')
const HTTPResponse = require('../models/HTTPResponse')

const getTestTypes = () => {
  const testTypes = new TestTypesDAO()
  const testTypesService = new TestTypesService(testTypes)

  return testTypesService.getTestTypesList()
    .then((data) => {
      return new HTTPResponse(200, data)
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body)
    })
}

module.exports = getTestTypes
