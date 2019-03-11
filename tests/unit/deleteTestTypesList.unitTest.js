const HTTPError = require('../../src/models/HTTPError')
const expect = require('chai').expect
const TestTypesDAOMock = require('../models/TestTypesDAOMock')
const TestTypesService = require('../../src/services/TestTypesService')
const fs = require('fs')
const path = require('path')

describe('deleteTestTypesList', () => {
  const testTypesDAOMock = new TestTypesDAOMock()

  context('database call deletes items', () => {
    it('should return nothing', () => {
      testTypesDAOMock.testTypesRecordsMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/test-types.json'), 'utf8'))
      const testTypesService = new TestTypesService(testTypesDAOMock)

      return testTypesService.deleteTestTypesList(testTypesDAOMock.testTypesRecordsMock)
        .then(data => {
          expect(data).to.be.undefined
        })
    })

    it('should return the unprocessed items', () => {
      testTypesDAOMock.unprocessedItems = testTypesDAOMock.testTypesRecordsMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/test-types.json'), 'utf8'))
      const testTypesService = new TestTypesService(testTypesDAOMock)

      return testTypesService.deleteTestTypesList(testTypesDAOMock.testTypesRecordsMock)
        .then(data => {
          expect(data.length).to.equal(6)
        })
    })
  })

  context('database call fails deleting items', () => {
    it('should return error 500', () => {
      testTypesDAOMock.testTypesRecordsMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/test-types.json'), 'utf8'))
      testTypesDAOMock.isDatabaseOn = false
      const testTypesService = new TestTypesService(testTypesDAOMock)

      return testTypesService.deleteTestTypesList(testTypesDAOMock.testTypesRecordsMock)
        .then(() => {})
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })
})
