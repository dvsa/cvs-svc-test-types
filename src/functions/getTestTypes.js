'use strict'

const TestTypesDAO = require('../models/TestTypesDAO')
const TestTypesService = require('../services/TestTypesService')
const HTTPResponse = require('../models/HTTPResponse')

const getTestTypes = (event, context, callback) => {
  const testTypesDAO = new TestTypesDAO()
  const testTypesService = new TestTypesService(testTypesDAO)

  // GET /test-types
  return testTypesService.getTestTypesList()
    .then((data) => {
      return new HTTPResponse(200, data)
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body)
    })
}

module.exports.getTestTypes = getTestTypes
