import LambdaTester from "lambda-tester";
import { handler } from "../../src/handler";

//This test is garbage and doesn't actually test anything. Should be replaced with an actual test.
describe("getTestTypes", () => {
  it("should return a promise", () => {
    const lambda = LambdaTester(handler);
    return lambda.expectResolve((response: any) => {
      expect(response).toBeTruthy();
    });
  });
});
