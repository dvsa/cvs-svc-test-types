/* global describe it context */
const expect = require('chai').expect
const TestTypesDAOMock = require('../models/TestTypesDAOMock')
const TestTypesService = require('../../src/services/TestTypesService')
const fs = require('fs')
const path = require('path')

describe('getTestTypesList', () => {
  var testTypesDAOMock = new TestTypesDAOMock()

  describe('when database is on', () => {
    context('database call returns valid data', () => {
      context('getTestTypesList', () => {
        it('should return the expected data', () => {
          const mockData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/test-types.json')))

          testTypesDAOMock.testTypesRecordsMock = mockData
          testTypesDAOMock.numberOfrecords = 1
          testTypesDAOMock.numberOfScannedRecords = 1
          var testTypesService = new TestTypesService(testTypesDAOMock)

          return testTypesService.getTestTypesList()
            .then((returnedRecords) => {
              expect(returnedRecords).to.eql(mockData)
            })
        })
      })

      context('getTestTypesById', () => {
        it('should return the expected data', () => {
          const mockData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/test-types.json')))

          testTypesDAOMock.testTypesRecordsMock = mockData
          testTypesDAOMock.numberOfrecords = 1
          testTypesDAOMock.numberOfScannedRecords = 1
          var testTypesService = new TestTypesService(testTypesDAOMock)

          return testTypesService.getTestTypesById('1', { fields: ['testTypeClassification', 'defaultTestCode', 'linkedTestCode'], vehicleType: 'psv', vehicleSize: 'small', vehicleConfiguration: 'rigid' })
            .then((returnedRecords) => {
              expect(returnedRecords).to.eql({ id: '1', testTypeClassification: 'Annual With Certificate', defaultTestCode: 'AAS', linkedTestCode: null })
            })
        })
      })
    })
    context('database call returns empty data', () => {
      context('getTestTypesList', () => {
        it('should return error 404', () => {
          testTypesDAOMock.testTypesRecordsMock = []
          testTypesDAOMock.numberOfrecords = 0
          testTypesDAOMock.numberOfScannedRecords = 0
          var testTypesService = new TestTypesService(testTypesDAOMock)

          return testTypesService.getTestTypesList()
            .then(() => {
              expect.fail()
            }).catch((errorResponse) => {
              expect(errorResponse.statusCode).to.equal(404)
              expect(errorResponse.body).to.equal('No resources match the search criteria.')
            })
        })
      })

      context('getTestTypesById', () => {
        it('should return error 404', () => {
          testTypesDAOMock.testTypesRecordsMock = []
          testTypesDAOMock.numberOfrecords = 0
          testTypesDAOMock.numberOfScannedRecords = 0
          var testTypesService = new TestTypesService(testTypesDAOMock)

          return testTypesService.getTestTypesById('1', { fields: ['testTypeClassification', 'defaultTestCode', 'linkedTestCode'], vehicleType: 'psv', vehicleSize: 'small', vehicleConfiguration: 'rigid' })
            .then(() => {
              expect.fail()
            }).catch((errorResponse) => {
              expect(errorResponse.statusCode).to.equal(404)
              expect(errorResponse.body).to.equal('No resources match the search criteria.')
            })
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
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })
})
