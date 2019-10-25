import {getTestTypes} from "../../src/functions/getTestTypes";
import {TestTypesService} from "../../src/services/TestTypesService";
import mockContext from "aws-lambda-mock-context";
import {HTTPError} from "../../src/models/HTTPError";

describe("getTestTypes function", () => {
  const ctx = mockContext();
  context("gets successful response from Service", () => {
    it("returns 200 OK + data", async () =>  {
      TestTypesService.prototype.getTestTypesList = jest.fn().mockResolvedValue("Success");
      const output = await getTestTypes({}, ctx, () => { return; });
      expect(output.statusCode).toEqual(200);
      expect(output.body).toEqual(JSON.stringify("Success"));
    });
  });

  context("gets error from Service", () => {
    it("Returns the error as an HTTPResponse", async () =>  {
      const myError = new HTTPError(418, "It Broke!");
      TestTypesService.prototype.getTestTypesList = jest.fn().mockRejectedValue(myError);
      const output = await getTestTypes({}, ctx, () => { return; });
      expect(output.statusCode).toEqual(418);
      expect(output.body).toEqual(JSON.stringify("It Broke!"));
    });
  });
});
