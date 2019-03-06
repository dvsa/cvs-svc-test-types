/* global describe it context before after beforeEach afterEach */
const supertest = require('supertest')
const expect = require('chai').expect
const url = 'http://localhost:3002/'
const request = supertest(url)
const TestTypesService = require('../../src/services/TestTypesService')
const TestTypesDAO = require('../../src/models/TestTypesDAO')

describe('test types', () => {
  describe('getTestTypes', () => {
    context('when database is populated', () => {
      let testTypesService = null
      let mockData = null
      let testTypesDAO = null

      before((done) => {
        testTypesDAO = new TestTypesDAO()
        testTypesService = new TestTypesService(testTypesDAO)
        mockData = require('../resources/test-types.json')
        testTypesService.insertTestTypesList(mockData)
        done()
      })

      context('GET /test-types', () => {
        it('should return all testTypes in the database', (done) => {
          request.get('test-types')
            .end((err, res) => {
              let expectedResponse = mockData
              // Sorting response for comparison
              let actualResponse = res.body.sort((first, second) => {
                return parseInt(first.id) - parseInt(second.id)
              })

              // Formatting expectedResponse so it looks like the response
              testTypesService.purgeTestTypes(expectedResponse)

              if (err) {
                expect.fail()
              }
              expect(res.statusCode).to.equal(200)
              expect(expectedResponse).to.eql(actualResponse)

              done()
            })
        })

        it('should provide CORS headers', (done) => {
          request.get('test-types')
            .expect('access-control-allow-origin', '*')
            .expect('access-control-allow-credentials', 'true')
            .expect(200)
            .end((err, res) => {
              if (err) {
                expect.fail()
              }

              done()
            })
        })
      })

      after((done) => {
        const mockDataKeys = mockData.map((testType) => [testType.id, testType.name])
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
