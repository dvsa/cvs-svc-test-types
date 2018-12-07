const expect = require('chai').expect
const TestTypesDAOMock = require('../models/TestTypesDAOMock')
const TestTypesService = require('../../src/services/TestTypesService')
const HTTPResponseStatus = require('../../src/models/HTTPResponseStatus')

describe('getTestTypesList', () => {
  var testTypesDAOMock = new TestTypesDAOMock()

  describe('when database is on', () => {
    context('database call returns valid data', () => {
      it('should return the expected data', () => {
        testTypesDAOMock.testTypesRecordsMock = { item: 'testItem' }
        testTypesDAOMock.numberOfrecords = 1
        testTypesDAOMock.numberOfScannedRecords = 1
        var testTypesService = new TestTypesService(testTypesDAOMock)

        return testTypesService.getTestTypesList()
          .then((returnedRecords) => {
            expect(returnedRecords).to.eql({ item: 'testItem' })
          })
      })
    })
    context('database call returns empty data', () => {
      it('should return error 404', () => {
        testTypesDAOMock.testTypesRecordsMock = []
        testTypesDAOMock.numberOfrecords = 0
        testTypesDAOMock.numberOfScannedRecords = 0
        var testTypesService = new TestTypesService(testTypesDAOMock)

        return testTypesService.getTestTypesList()
          .then(() => {
            expect.fail()
          }).catch((errorResponse) => {
            expect(errorResponse).to.be.instanceOf(HTTPResponseStatus)
            expect(errorResponse.statusCode).to.equal(404)
            expect(errorResponse.body).to.equal('No resources match the search criteria.')
          })
      })
    })
  })

  describe('when database is off', () => {
    it('should return error 500', () => {
      testTypesDAOMock.testTypesRecordsMock = []
      testTypesDAOMock.numberOfrecords = 0
      testTypesDAOMock.numberOfScannedRecords = 0
      testTypesDAOMock.isDatabaseOn = false
      var testTypesService = new TestTypesService(testTypesDAOMock)

      return testTypesService.getTestTypesList()
        .then(() => {
        })
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPResponseStatus)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })
})
