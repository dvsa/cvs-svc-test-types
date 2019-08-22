import LambdaTester from "lambda-tester";
import { handler } from "../../src/handler";
import {expect} from "chai";

describe('getTestTypes', () => {
  it('should return a promise', () => {
    const lambda = LambdaTester(handler);
    return lambda.expectResolve((response: any) => {
      expect(response).to.exist;
    });
  })
})
