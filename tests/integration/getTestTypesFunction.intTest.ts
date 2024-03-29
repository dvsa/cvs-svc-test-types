import LambdaTester from "lambda-tester";
import { handler } from "../../src/handler";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";

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

  it("should return a promise", () => {
    const lambda = LambdaTester(handler).event({
      httpMethod: "GET",
      path: "/test-types",
    });
    return lambda.expectResolve((response: any) => {
      return expect(response).toBeDefined();
    });
  });
});
