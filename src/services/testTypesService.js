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

        return data.Items
      })
      .catch((error) => {
        console.log(error)

        if (!error.statusCode) {
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }

        throw new HTTPError(error.statusCode, error.body)
      })
  }

  insertTestTypesList (testTypesItems) {
    return this.testTypesDAO.createMultiple(testTypesItems)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems
        }
      })
      .catch((error) => {
        console.log(error)

        if (error) {
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
        console.log(error)

        if (error) {
          throw new HTTPError(500, 'Internal ServerError')
        }
      })
  }
}

module.exports = TestTypesService
