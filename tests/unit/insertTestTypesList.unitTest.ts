import { HTTPError } from "../../src/models/HTTPError";
import { TestTypesService } from "../../src/services/TestTypesService";
import TestTypes from "../resources/test-types.json";

describe("insertTestTypesList", () => {
  context("database call inserts items and resolves with no unprocessed TestTypes items", () => {
    it("should return nothing", () => {
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
          expect(returnedRecords).toEqual(undefined);
        });
    });

    it("should return the unprocessed items", () => {
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
          expect(result.length).toEqual(21);
        });
    });
  });

  context("database call fails inserting items when database is off", () => {
    it("should return error 500-Internal Server Error", () => {
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
        .then(() => undefined )
        .catch((errorResponse: { statusCode: any; body: any; }) => {
          expect(errorResponse).toBeInstanceOf(HTTPError);
          expect(errorResponse.statusCode).toEqual(500);
          expect(errorResponse.body).toEqual("Internal Server Error");
        });
    });
  });
});
