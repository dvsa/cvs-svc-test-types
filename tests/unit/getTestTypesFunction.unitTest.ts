import { getTestTypes } from "../../src/functions/getTestTypes";
import { TestTypesService } from "../../src/services/TestTypesService";
import { HTTPError } from "../../src/models/HTTPError";
import { Context } from "aws-lambda";
import TestTypes from "../resources/test-types.json";
import { cloneDeep } from "lodash";

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

  context(
    "gets successful response with suggested test types from Service",
    () => {
      it("returns 200 OK + data", async () => {
        const mockTestTypesRecord = cloneDeep(TestTypes[0]);

        TestTypesService.prototype.getTestTypesList = jest
          .fn()
          .mockResolvedValue(mockTestTypesRecord);
        const output = await getTestTypes({}, ctx, () => {
          return;
        });
        const {
          id,
          linkedIds,
          suggestedTestTypeIds,
          name,
          testTypeName,
          suggestedTestTypeDisplayName,
          suggestedTestTypeDisplayOrder,
          forVehicleType,
          forVehicleSize,
          forVehicleConfiguration,
          forVehicleAxles,
          forEuVehicleCategory,
          forVehicleClass,
          forVehicleSubclass,
          forVehicleWheels,
          testTypeClassification,
        } = JSON.parse(output.body);
        expect(output.statusCode).toEqual(200);
        expect(id).toEqual("1");
        expect(linkedIds).toEqual(["38", "39"]);
        expect(suggestedTestTypeIds).toEqual(["1", "7", "10"]);
        expect(name).toEqual("Annual test");
        expect(testTypeName).toEqual("Annual test");
        expect(suggestedTestTypeDisplayName).toEqual("Annual test");
        expect(suggestedTestTypeDisplayOrder).toEqual("3");
        expect(forVehicleType).toEqual(["psv"]);
        expect(forVehicleSize).toEqual(["small", "large"]);
        expect(forVehicleConfiguration).toEqual(["articulated", "rigid"]);
        expect(forVehicleAxles).toEqual(null);
        expect(forEuVehicleCategory).toEqual(null);
        expect(forVehicleClass).toEqual(null);
        expect(forVehicleSubclass).toEqual(null);
        expect(forVehicleWheels).toEqual(null);
        expect(testTypeClassification).toEqual("Annual With Certificate");
      });
    }
  );


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
