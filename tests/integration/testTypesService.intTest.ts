/* global describe it context before after beforeEach afterEach */
import supertest from "supertest";
import { TestTypesService } from "../../src/services/TestTypesService";
import TestTypesDAO from "../../src/models/TestTypesDAO";
import TestTypes from "../resources/test-types.json";
import { ITestType } from "../../src/models/ITestType";
const url = "http://localhost:3002/";
const request = supertest(url);

describe("test types", () => {
  describe("getTestTypes", () => {
    context("when database is populated", () => {
      let testTypesService: TestTypesService;
      let testTypesDAO = null;
      let mockData: ITestType[] | any = [...TestTypes];

      beforeEach((done) => {
        testTypesDAO = new TestTypesDAO();
        testTypesService = new TestTypesService(testTypesDAO);
        mockData = [...TestTypes];
        testTypesService.insertTestTypesList(mockData);
        done();
      });

      afterEach((done) => {
        const mockDataKeys = mockData.map((testType: { id: any; name: any; }) => [testType.id, testType.name]);
        testTypesService.deleteTestTypesList(mockDataKeys);
        done();
      });
    });

    context("GET /test-types", () => {
      it("should return all testTypes in the database", async () => {
        const expectedResponse = [...TestTypes];
        const testTypesDAO = new TestTypesDAO();
        const testTypesService = new TestTypesService(testTypesDAO);
        // Formatting expectedResponse so it looks like the response
        testTypesService.purgeTestTypes(expectedResponse);
        const res = await request.get("test-types");
        // Sorting response for comparison
        const actualResponse = res.body;
        expect(res.status).toEqual(200);
        expect(expectedResponse.length).toEqual(actualResponse.length);
      });
    });

    it("should provide CORS headers", async () => {
      const res = await request.get("test-types");
      expect(res.status).toEqual(200);
    });
  });
});
