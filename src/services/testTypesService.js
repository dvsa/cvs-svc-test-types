'use strict'

const HTTPResponseStatus = require('../models/HTTPResponseStatus')

class TestTypesService {
  constructor (testTypesDto) {
    this.testTypesDto = testTypesDto
  }

  getTestTypesList () {
    return this.testTypesDto.getAll()
      .then(data => {
        if (data.Count === 0) {
          throw new HTTPResponseStatus(404, 'No resources match the search criteria.')
        }
        return data.Items
      })
      .catch(error => {
        if (!error.statusCode) {
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }

        throw new HTTPResponseStatus(error.statusCode, error.body)
      })
  }

  insertTestTypesList (testTypesItems) {
    return this.testTypesDto.createMultiple(testTypesItems)
      .then(data => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems
        }
      })
      .catch((error) => {
        if (error) {
          throw new HTTPResponseStatus(500, 'Internal Server Error')
        }
      })
  }

  deleteTestTypesList (testTypesItemKeys) {
    return this.testTypesDto.deleteMultiple(testTypesItemKeys)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems
        }
      })
      .catch((error) => {
        if (error) {
          throw new HTTPResponseStatus(500, 'Internal ServerError')
        }
      })
  }
}

module.exports = TestTypesService
