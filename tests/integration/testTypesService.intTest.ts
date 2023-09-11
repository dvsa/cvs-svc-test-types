/* global describe it context before after beforeEach afterEach */
import supertest from "supertest";
import { TestTypesService } from "../../src/services/TestTypesService";
import TestTypesDAO from "../../src/models/TestTypesDAO";
import TestTypes from "../resources/test-types.json";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";
import LambdaTester from "lambda-tester";
import { getTestTypes } from "../../src/functions/getTestTypes";
import recursiveFind from "../util/recursiveFind";
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
        it("should only return test-types which don't have a tag", async () => {
          const expectedResponse = [...TestTypes];
          const testTypesDAO = new TestTypesDAO();
          const testTypesService = new TestTypesService(testTypesDAO);
          // Formatting expectedResponse so it looks like the response
          testTypesService.purgeTestTypes(expectedResponse);
          const res = await request.get("test-types");
          // Sorting response for comparison
          const actualResponse = res.body;
          expect(res.status).toEqual(200);
          expect(
            recursiveFind((testType) => testType.typeOfTest, actualResponse)
          ).toBeUndefined();
          expect(actualResponse).not.toBeUndefined();
        });
        it("should return test types which have the tag and test types that don't", async () => {
          const expectedResponse = [...TestTypes];
          const testTypesDAO = new TestTypesDAO();
          const testTypesService = new TestTypesService(testTypesDAO);
          // Formatting expectedResponse so it looks like the response
          testTypesService.purgeTestTypes(expectedResponse);
          const res = await request.get("test-types?typeOfTest=desk-based");
          // Sorting response for comparison
          const actualResponse = res.body;
          expect(res.status).toEqual(200);
          expect(
            recursiveFind(
              (testType) => testType.typeOfTest === "desk-based",
              actualResponse
            )
          ).not.toBeUndefined();
          expect(
            recursiveFind((testType) => !testType.typeOfTest, actualResponse)
          ).not.toBeUndefined();
        });
      });

      it("should provide CORS headers", async () => {
        const expectedHeaders = {
          "access-control-allow-credentials": "true",
          "access-control-allow-origin": "*",
          "cache-control": "no-cache",
          "connection": "close",
          "content-encoding": "gzip",
          "content-type": "application/json; charset=utf-8",
          "transfer-encoding": "chunked",
          "vary": "Origin,accept-encoding",
          "x-content-type-options": "nosniff",
          "x-xss-protection": "1; mode=block",
        };
        const res = await request.get("test-types");
        expect(res.headers).toMatchObject(expectedHeaders);
        expect(res.status).toEqual(200);
      });
    });
  });
});
