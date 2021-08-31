import { getTestTypes } from "../../src/functions/getTestTypes";
import { TestTypesService } from "../../src/services/TestTypesService";
import { HTTPError } from "../../src/models/HTTPError";
import { Context } from "aws-lambda";
import TestTypes from "../resources/test-types.json";
import {cloneDeep} from "lodash";

describe("getTestTypes function", () => {
  // @ts-ignore
  const ctx: Context = null;
  context("gets successful response from Service", () => {
    it("returns 200 OK + data", async () => {
      TestTypesService.prototype.getTestTypesList = jest
        .fn()
        .mockResolvedValue("Success");
      const output = await getTestTypes({}, ctx, () => {
        return;
      });
      expect(output.statusCode).toEqual(200);
      expect(output.body).toEqual(JSON.stringify("Success"));
    });
  });

  context("gets successful response with suggested test types from Service", () => {
    it("returns 200 OK + data", async () => {
      const mockTestTypesRecord = cloneDeep(TestTypes[0]);

      TestTypesService.prototype.getTestTypesList = jest
        .fn()
        .mockResolvedValue(mockTestTypesRecord);
      const output = await getTestTypes({}, ctx, () => {
        return;
      });
      expect(output.statusCode).toEqual(200);
      expect(JSON.parse(output.body).id).toEqual("1");
      expect(JSON.parse(output.body).linkedIds).toEqual( ["38", "39"]);
      expect(JSON.parse(output.body).suggestedTestTypeIds).toEqual(["1", "7", "10"]);
      expect(JSON.parse(output.body).name).toEqual( "Annual test");
      expect(JSON.parse(output.body).testTypeName).toEqual( "Annual test");
      expect(JSON.parse(output.body).forVehicleType).toEqual( ["psv"]);
      expect(JSON.parse(output.body).forVehicleSize).toEqual( ["small", "large"]);
      expect(JSON.parse(output.body).forVehicleConfiguration).toEqual( ["articulated", "rigid"]);
      expect(JSON.parse(output.body).forVehicleAxles).toEqual( null);
      expect(JSON.parse(output.body).forEuVehicleCategory).toEqual( null);
      expect(JSON.parse(output.body).forVehicleClass).toEqual( null);
      expect(JSON.parse(output.body).forVehicleSubclass).toEqual( null);
      expect(JSON.parse(output.body).forVehicleWheels).toEqual( null);
      expect(JSON.parse(output.body).testTypeClassification).toEqual( "Annual With Certificate");
    });
  });

  context("gets error from Service", () => {
    it("Returns the error as an HTTPResponse", async () => {
      const myError = new HTTPError(418, "It Broke!");
      TestTypesService.prototype.getTestTypesList = jest
        .fn()
        .mockRejectedValue(myError);
      const output = await getTestTypes({}, ctx, () => {
        return;
      });
      expect(output.statusCode).toEqual(418);
      expect(output.body).toEqual(JSON.stringify("It Broke!"));
    });
  });
});
