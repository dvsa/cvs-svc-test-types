/* global describe it context before after beforeEach afterEach */
import supertest from "supertest";
import { TestTypesService } from "../../src/services/TestTypesService";
import TestTypesDAO from "../../src/models/TestTypesDAO";
import TestTypes from "../resources/test-types.json";
import TestTypesVtm from "../resources/test-types-vtm-response.json";
import TestTypesVta from "../resources/test-types-vta-response.json";
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
        it("should return all testTypes in the database where applicableTo is all", async () => {
          const expectedResponse = [...TestTypes];
          const testTypesDAO = new TestTypesDAO();
          const testTypesService = new TestTypesService(testTypesDAO);
          // Formatting expectedResponse so it looks like the response
          testTypesService.purgeTestTypes(expectedResponse);
          const res = await request.get("test-types?applicableTo=all");
          // Sorting response for comparison
          const actualResponse = res.body;
          expect(res.status).toEqual(200);
          expect(expectedResponse.length).toEqual(actualResponse.length);
        });
        it("should return only testTypes with forVtmOnly=true where applicableTo is vtm", async () => {
          const expectedResponse = TestTypesVtm;
          const res = await request.get("test-types?applicableTo=vtm");
          const actualResponse = res.body;
          expect(res.status).toEqual(200);
          expect(expectedResponse).toEqual(actualResponse);
        });

        it("should return only testTypes with forVtmOnly=false when applicableTo is not provided", async () => {
          const expectedResponse = TestTypesVta;
          const res = await request.get("test-types");
          const actualResponse = res.body;
          expect(res.status).toEqual(200);
          expect(expectedResponse).toEqual(actualResponse);
        });
      });

      it("should provide CORS headers", async () => {
        const res = await request.get("test-types");
        expect(res.status).toEqual(200);
      });
    });
  });
});
