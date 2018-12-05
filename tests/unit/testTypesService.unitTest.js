const expect = require('chai').expect
const TestTypesDtoMock = require('../models/TestTypesDtoMock')
const TestTypesService = require('../../src/services/TestTypesService')
const HTTPResponseStatus = require('../../src/models/HTTPResponseStatus')

describe('getTestTypesList', () => {
  var testTypesDtoMock = new TestTypesDtoMock()

  describe('when database is on', () => {
    context('database call returns valid data', () => {
      it('should return the expected data', () => {
        testTypesDtoMock.testTypesRecordsMock = { item: 'testItem' }
        testTypesDtoMock.numberOfrecords = 1
        testTypesDtoMock.numberOfScannedRecords = 1
        var testTypesService = new TestTypesService(testTypesDtoMock)

        return testTypesService.getTestTypesList()
          .then((returnedRecords) => {
            expect(returnedRecords).to.eql({ item: 'testItem' })
          })
      })
    })
    context('database call returns empty data', () => {
      it('should return error 404', () => {
        testTypesDtoMock.testTypesRecordsMock = []
        testTypesDtoMock.numberOfrecords = 0
        testTypesDtoMock.numberOfScannedRecords = 0
        var testTypesService = new TestTypesService(testTypesDtoMock)

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
      testTypesDtoMock.testTypesRecordsMock = []
      testTypesDtoMock.numberOfrecords = 0
      testTypesDtoMock.numberOfScannedRecords = 0
      testTypesDtoMock.isDatabaseOn = false
      var testTypesService = new TestTypesService(testTypesDtoMock)

      return testTypesService.getTestTypesList()
        .then(() => {})
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPResponseStatus)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })
})
