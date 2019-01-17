'use strict'

const TestTypesDAO = require('../models/TestTypesDAO')
const TestTypesService = require('../services/TestTypesService')
const HTTPResponse = require('../models/HTTPResponse')
const Joi = require('joi')
const Path = require('path-parser').default

const testTypes = (event) => {
  const testTypesDAO = new TestTypesDAO()
  const testTypesService = new TestTypesService(testTypesDAO)

  const path = (process.env.BRANCH === 'local') ? event.path : event.pathParameters.proxy

  const getAllTestTypes = new Path('/test-types')
  const getTestTypesById = new Path('/test-types/:id')

  // GET /test-types
  if (getAllTestTypes.test(path)) {
    return testTypesService.getTestTypesList()
      .then((data) => {
        return new HTTPResponse(200, data)
      })
      .catch((error) => {
        return new HTTPResponse(error.statusCode, error.body)
      })
  }

  // GET /test-types/{id}
  if (getTestTypesById.test(path)) {
    // Validate query parameters
    const queryParamSchema = Joi.object().keys({
      fields: Joi.string().regex(/^(testTypeClassification|defaultTestCode|linkedTestCode),?\s*((testTypeClassification|defaultTestCode|linkedTestCode),?\s*)?((testTypeClassification|defaultTestCode|linkedTestCode),?\s*)?$/).required(),
      vehicleType: Joi.any().only([ 'psv', 'hgv', 'trl' ]).required(),
      vehicleSize: Joi.any().only([ 'small', 'large' ]).required(),
      vehicleConfiguration: Joi.any().only([ 'rigid', 'articulated' ]).required(),
      vehicleAxles: Joi.any().only([ '2', '3' ]).optional()
    })

    let queryParams = Object.assign({}, event.queryStringParameters)
    let validation = Joi.validate(queryParams, queryParamSchema)

    if (validation.error) {
      return Promise.resolve(new HTTPResponse(400, `Query parameter ${validation.error.details[0].message}`))
    }

    // Splitting fields into an array and cleaning up unwanted whitespace
    Object.assign(queryParams, { fields: queryParams.fields.replace(/\s/g, '').split(',') })

    return testTypesService.getTestTypesById(getTestTypesById.test(path).id, queryParams)
      .then((data) => {
        return new HTTPResponse(200, data)
      })
      .catch((error) => {
        return new HTTPResponse(error.statusCode, error.body)
      })
  }

  // If you get to this point, your URL is bad
  return Promise.resolve(new HTTPResponse(400, `Cannot GET ${path}`))
}

module.exports = testTypes
