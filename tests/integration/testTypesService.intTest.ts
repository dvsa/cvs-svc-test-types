/* global describe it context before after beforeEach afterEach */
import supertest from "supertest";
import { expect } from "chai";
import { TestTypesService } from "../../src/services/TestTypesService";
import { TestTypesDAO } from "../../src/models/TestTypesDAO";
import TestTypes from "../resources/test-types.json";
import { ITestType } from "../../src/models/ITestType";
const url = 'http://localhost:3002/'
const request = supertest(url);

describe('test types', () => {
  describe('getTestTypes', () => {
    context('when database is populated', () => {
      let testTypesService: TestTypesService;
      let testTypesDAO = null;
      let mockData : ITestType[] | any = [...TestTypes];

      beforeEach((done) => {
        testTypesDAO = new TestTypesDAO();
        testTypesService = new TestTypesService(testTypesDAO);
        mockData = [...TestTypes];
        testTypesService.insertTestTypesList(mockData);
        done();
      })

      context('GET /test-types', () => {
        it('should return all testTypes in the database', (done) => {
          request.get('test-types')
            .end((err: Error, res: any)  => {
              const expectedResponse = [...TestTypes];
              // Sorting response for comparison
              const actualResponse = res.body.sort((first: { id: string; }, second: { id: string; }) => {
                return parseInt(first.id) - parseInt(second.id);
              })
              testTypesDAO = new TestTypesDAO();
              testTypesService = new TestTypesService(testTypesDAO);
              // Formatting expectedResponse so it looks like the response
              testTypesService.purgeTestTypes(expectedResponse);

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

      afterEach((done) => {
        const mockDataKeys = mockData.map((testType: { id: any; name: any; }) => [testType.id, testType.name])
        testTypesService.deleteTestTypesList(mockDataKeys);
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
