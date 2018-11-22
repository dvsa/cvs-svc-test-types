'use strict'

const testTypesService = require('../services/testTypesService')

/**
 * Lambda function that calls internal testTypesService function
 * to retrieve a list of all test types, and returns said list as
 * an AWS response.
 * @returns {Promise<{statusCode: number, body: string} | never | {statusCode: *, headers: *, body: string}>}
 */
const getTestTypes = async () => {
  return testTypesService()
    .then((result) => {
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    })
    .catch((e) => {
      return {
        statusCode: e.statusCode,
        headers: e.headers,
        body: JSON.stringify(e.body)
      }
    })
}

module.exports = getTestTypes
