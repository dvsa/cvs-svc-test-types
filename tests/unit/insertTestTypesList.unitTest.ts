import { expect } from "chai";
import { HTTPError } from "../../src/models/HTTPError";
import { TestTypesService } from "../../src/services/TestTypesService";
import TestTypes from "../resources/test-types.json";

describe('insertTestTypesList', () => {
  context('database call inserts items and resolves with no unprocessed TestTypes items', () => {
    it('should return nothing', () => {
      const mockTestTypesRecords: any = [...TestTypes ];
      const MockTestTypesDAO = jest.fn().mockImplementation(() => {
        return {
          createMultiple: () => {
            return Promise.resolve({});
          }
        };
      });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      return testTypesService.insertTestTypesList(mockTestTypesRecords)
        .then((returnedRecords: any) => {
          expect(returnedRecords).to.equal(undefined);
        })
    });

    it('should return the unprocessed items', () => {
      const expectedUnprocessedTestTypesRecords: any = [...TestTypes];
      const MockTestTypesDAO = jest.fn().mockImplementation(() => {
        return {
          createMultiple: () => {
            return Promise.resolve({ UnprocessedItems: [...TestTypes] });
          }
        };
      });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());
      return testTypesService.insertTestTypesList(expectedUnprocessedTestTypesRecords)
        .then((result: any) => {
          expect(result.length).to.equal(6);
        });
    });
  });

  context('database call fails inserting items when database is off', () => {
    it('should return error 500-Internal Server Error', () => {
      const mockTestTypesRecords: any = [ ...TestTypes ]; 
      const MockTestTypesDAO = jest.fn().mockImplementation(() => {
        return {
          createMultiple: () => {
            return Promise.reject({});
          }
        };
      });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      return testTypesService.insertTestTypesList(mockTestTypesRecords)
        .then(() => { })
        .catch((errorResponse: { statusCode: any; body: any; }) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        });
    });
  });
});
