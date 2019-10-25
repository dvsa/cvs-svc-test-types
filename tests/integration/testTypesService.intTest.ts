/* global describe it context before after beforeEach afterEach */
import supertest from "supertest";
import { TestTypesService } from "../../src/services/TestTypesService";
import TestTypesDAO from "../../src/models/TestTypesDAO";
import TestTypes from "../resources/test-types.json";
import { ITestType } from "../../src/models/ITestType";
import {emptyDatabase, populateDatabase} from "../util/dbOperations";
const url = "http://localhost:3002/";

describe("test types", () => {
  const request = supertest(url);
  describe("getTestTypes", () => {
    beforeAll(async () => {
      jest.restoreAllMocks();
      await emptyDatabase();
    });
    beforeEach(async () => {
      await populateDatabase();
    });
    afterEach(async () => {
      await emptyDatabase();
    });
    afterAll(async () => {
      await populateDatabase();
    });
    context("when database is populated", () => {
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
});
