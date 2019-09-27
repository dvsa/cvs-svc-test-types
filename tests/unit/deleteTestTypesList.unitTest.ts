import { HTTPError } from "../../src/models/HTTPError";
import { TestTypesService } from "../../src/services/TestTypesService";
import TestTypes from "../resources/test-types.json";

describe("deleteTestTypesList", () => {
  context("database call deletes items and resolves with no unprocessed TestTypes items", () => {
    it("should return nothing", () => {
      const mockTestTypesRecords: any = [ ...TestTypes ];
      const MockTestTypesDAO = jest.fn().mockImplementation(() => {
        return {
          deleteMultiple: () => {
            return Promise.resolve({});
          }
        };
      });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());
      return testTypesService.deleteTestTypesList(mockTestTypesRecords)
        .then((data) => {
          expect(data).toEqual(undefined);
        });
    });

    it("should return the unprocessed items on deleteTestTypesList", () => {
      const expectedUnprocessedTestTypesRecords: any = [ ...TestTypes ];
      const MockTestTypesDAO = jest.fn().mockImplementation(() => {
        return {
          deleteMultiple: () => {
            return Promise.resolve({ UnprocessedItems: [ ...TestTypes ] });
          }
        };
      });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      return testTypesService.deleteTestTypesList(expectedUnprocessedTestTypesRecords)
        .then((data: any) => {
<<<<<<< HEAD
          expect(data.length).toEqual(15);
||||||| merged common ancestors
          expect(data.length).to.equal(6);
=======
          expect(data.length).to.equal(15);
>>>>>>> CVSB-6426: Removing unittest js file and updating tests
        });
    });
  });

  context("database call fails deleting items", () => {
    it("should return error 500-Internal Server Error", () => {
      const mockTestTypesRecords: any = [ ...TestTypes ];
      const MockTestTypesDAO = jest.fn().mockImplementation(() => {
        return {
          deleteMultiple: () => {
            return Promise.reject({});
          }
        };
      });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      return testTypesService.deleteTestTypesList(mockTestTypesRecords)
        .then(() => undefined )
        .catch((errorResponse: { statusCode: any; body: any; }) => {
          expect(errorResponse).toBeInstanceOf(HTTPError);
          expect(errorResponse.statusCode).toEqual(500);
          expect(errorResponse.body).toEqual("Internal Server Error");
        });
    });
  });
});
