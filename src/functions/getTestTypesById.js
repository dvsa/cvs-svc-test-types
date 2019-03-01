'use strict'

const TestTypesDAO = require('../models/TestTypesDAO')
const TestTypesService = require('../services/TestTypesService')
const HTTPResponse = require('../models/HTTPResponse')
const Joi = require('joi')

const getTestTypesById = (event, context, callback) => {
    const testTypesDAO = new TestTypesDAO()
    const testTypesService = new TestTypesService(testTypesDAO)
  
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

    return testTypesService.getTestTypesById(event.pathParameters.id, queryParams)
      .then((data) => {
        return {
          statusCode: 200,
          body: data
        }
      })
      .catch((error) => {
        return {
          statusCode: error.statusCode,
          body: error.body
        }
    })
  }
  
  module.exports.getTestTypesById = getTestTypesById