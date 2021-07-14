import supertest from "supertest";
import { ITestType } from "../../src/models/ITestType";
import { HTTPRESPONSE } from "../../src/assets/Enums";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";
const url = "http://localhost:3002/";

describe("get testTypes", () => {
  const request = supertest(url);
  beforeAll(async () => {
    await emptyDatabase();
  });

  afterAll(async () => {
    await populateDatabase();
  });

  context("when database is empty", () => {
    it("should return error code 404", async () => {
      const res = await request.get("test-types");
      expect(res.status).toEqual(404);
      expect(res.header["access-control-allow-origin"]).toEqual("*");
      expect(res.header["access-control-allow-credentials"]).toEqual("true");
      expect(res.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
    });
  });
});
