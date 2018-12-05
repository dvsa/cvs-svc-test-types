const supertest = require('supertest')
const expect = require('chai').expect
const url = 'http://localhost:3002/'
const request = supertest(url)
const TestTypesService = require('../../src/services/TestTypesService')
const TestTypesDto = require('../../src/models/TestTypesDto')
var _ = require('lodash/core')

describe('test types', () => {
  describe('getTestTypes', () => {
    context('when database is populated', () => {
      var testTypesService = null
      var mockData = null
      var testTypesDto = null

      before((done) => {
        testTypesDto = new TestTypesDto()
        testTypesService = new TestTypesService(testTypesDto)
        mockData = require('../resources/test-types.json')
        testTypesService.insertTestTypesList(mockData)
        done()
      })

      it('should return all testTypes in the database', (done) => {
        request.get('test-types')
          .end((err, res) => {
            if (err) {
              expect.fail()
            }
            expect(res.statusCode).to.equal(200)
            expect(_.isEqual(mockData, res.body)).to.equal(true)
            done()
          })
      })

      after((done) => {
        const mockDataKeys = [[3, 'RETEST']]
        testTypesService.deleteTestTypesList(mockDataKeys)
        done()
      })
    })

    context('when database is empty', () => {
      it('should return error code 404', (done) => {
        request.get('test-types').expect(404, done)
      })
    })
  })

  beforeEach((done) => {
    setTimeout(done, 500)
  })
  afterEach((done) => {
    setTimeout(done, 500)
  })
})
