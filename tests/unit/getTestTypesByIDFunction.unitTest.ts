import { getTestTypesById } from "../../src/functions/getTestTypesById";
import { TestTypesService } from "../../src/services/TestTypesService";
import { Context } from "aws-lambda";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { HTTPError } from "../../src/models/HTTPError";
import { HTTPRESPONSE } from "../../src/assets/Enums";

describe("getTestTypesById Function", () => {
  // @ts-ignore
  const ctx: Context = null;

  context("with good event but invalid details", () => {
    it("should return error from Joi", async () => {
      TestTypesService.prototype.getTestTypesById = jest
        .fn()
        .mockResolvedValue("Success");
      const myEvent = {
        httpMethod: "GET",
        path: "/test-types/1",
        queryStringParameters: {
          fields: "testTypeClassification",
          vehicleType: "hgv",
          vehicleSize: "small",
          vehicleConfiguration: "notAConfiguration",
        },
        pathParameters: {
          id: "1",
        },
      };
      const result = await getTestTypesById(myEvent, ctx, () => {
        return;
      });
      expect(result).toBeInstanceOf(HTTPResponse);
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual(
        JSON.stringify(
          'Query parameter "vehicleConfiguration" must be one of [articulated, rigid, centre axle drawbar, semi-car transporter, semi-trailer, long semi-trailer, low loader, other, drawbar, four-in-line, dolly, full drawbar, null]'
        )
      );
    });
  });

  context("with good event - non PSV details", () => {
    it("should return data from service on Success", async () => {
      TestTypesService.prototype.getTestTypesById = jest
        .fn()
        .mockResolvedValue("Success");
      const myEvent = {
        httpMethod: "GET",
        path: "/test-types/1",
        queryStringParameters: {
          fields: "testTypeClassification",
          vehicleType: "hgv",
          vehicleSize: "small",
          vehicleConfiguration: "drawbar",
        },
        pathParameters: {
          id: "1",
        },
      };
      const result = await getTestTypesById(myEvent, ctx, () => {
        return;
      });
      expect(result).toBeInstanceOf(HTTPResponse);
      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual(JSON.stringify("Success"));
    });
  });

  context("with good event", () => {
    it("should return data from service on Success", async () => {
      TestTypesService.prototype.getTestTypesById = jest
        .fn()
        .mockResolvedValue("Success");
      const myEvent = {
        httpMethod: "GET",
        path: "/test-types/1",
        queryStringParameters: {
          fields: "testTypeClassification",
          vehicleType: "psv",
          vehicleSize: "small",
          vehicleConfiguration: "rigid",
        },
        pathParameters: {
          id: "1",
        },
      };
      const result = await getTestTypesById(myEvent, ctx, () => {
        return;
      });
      expect(result).toBeInstanceOf(HTTPResponse);
      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual(JSON.stringify("Success"));
    });

    it("should RETURN the error on Service Failure", async () => {
      const myError = new HTTPError(418, "It broke!");
      TestTypesService.prototype.getTestTypesById = jest
        .fn()
        .mockRejectedValue(myError);
      const myEvent = {
        httpMethod: "GET",
        path: "/test-types/1",
        queryStringParameters: {
          fields: "testTypeClassification",
          vehicleType: "psv",
          vehicleSize: "small",
          vehicleConfiguration: "rigid",
        },
        pathParameters: {
          id: "1",
        },
      };
      const result = await getTestTypesById(myEvent, ctx, () => {
        return;
      });
      expect(result).toBeInstanceOf(HTTPResponse);
      expect(result.statusCode).toEqual(418);
      expect(result.body).toEqual(JSON.stringify("It broke!"));
    });
  });

  context("with missing query params", () => {
    it("should return data from service", async () => {
      TestTypesService.prototype.getTestTypesById = jest
        .fn()
        .mockResolvedValue("Success");
      const myEvent = {
        httpMethod: "GET",
        path: "/test-types/1",
        queryStringParameters: {},
        pathParameters: {
          id: "1",
        },
      };
      const result = await getTestTypesById(myEvent, ctx, () => {
        return;
      });
      expect(result).toBeInstanceOf(HTTPResponse);
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual(
        JSON.stringify('Query parameter "fields" is required')
      );
    });
  });
  context("with path params as null", () => {
    it("should trigger validation in function", async () => {
      TestTypesService.prototype.getTestTypesById = jest
        .fn()
        .mockResolvedValue("Success");
      const myEvent = {
        httpMethod: "GET",
        path: "/test-types/1",
        queryStringParameters: {},
        pathParameters: null,
      };
      const result = await getTestTypesById(myEvent, ctx, () => {
        return;
      });
      expect(result).toBeInstanceOf(HTTPResponse);
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual(
        JSON.stringify(HTTPRESPONSE.MISSING_PARAMETERS)
      );
    });
  });
  context("with path params", () => {
    it("should trigger validation in function when id is null", async () => {
      TestTypesService.prototype.getTestTypesById = jest
        .fn()
        .mockResolvedValue("Success");
      const myEvent = {
        httpMethod: "GET",
        path: "/test-types/1",
        queryStringParameters: {},
        pathParameters: {
          id: null,
        },
      };
      const result = await getTestTypesById(myEvent, ctx, () => {
        return;
      });
      expect(result).toBeInstanceOf(HTTPResponse);
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual(
        JSON.stringify(HTTPRESPONSE.MISSING_PARAMETERS)
      );
    });
    it("should trigger validation in function when id is undefined", async () => {
      TestTypesService.prototype.getTestTypesById = jest
        .fn()
        .mockResolvedValue("Success");
      const myEvent = {
        httpMethod: "GET",
        path: "/test-types/1",
        queryStringParameters: {},
        pathParameters: {
          id: undefined,
        },
      };
      const result = await getTestTypesById(myEvent, ctx, () => {
        return;
      });
      expect(result).toBeInstanceOf(HTTPResponse);
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual(
        JSON.stringify(HTTPRESPONSE.MISSING_PARAMETERS)
      );
    });
    it("should trigger validation in function when id is an empty string", async () => {
      TestTypesService.prototype.getTestTypesById = jest
        .fn()
        .mockResolvedValue("Success");
      const myEvent = {
        httpMethod: "GET",
        path: "/test-types/1",
        queryStringParameters: {},
        pathParameters: {
          id: " ",
        },
      };
      const result = await getTestTypesById(myEvent, ctx, () => {
        return;
      });
      expect(result).toBeInstanceOf(HTTPResponse);
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual(
        JSON.stringify(HTTPRESPONSE.MISSING_PARAMETERS)
      );
    });
  });
});
