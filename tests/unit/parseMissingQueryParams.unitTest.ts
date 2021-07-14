import { parseAndCastQueryParams } from "../../src/utils/parseMissingQueryParams";
import { NUM_PARAMETERS } from "../../src/assets/Enums";

const numericParameters = Object.values(NUM_PARAMETERS);

describe("parseMissingQueryParams", () => {
  context("if queryStringParameters does not contain vehicleSize", () => {
    it("vehicleSize should not be added", () => {
      const queryStringParametersWithoutVehicleSize = {
        vehicleAxles: "3",
        vehicleConfiguration: "rigid",
      };

      expect(
        Object.keys(
          parseAndCastQueryParams(
            queryStringParametersWithoutVehicleSize,
            numericParameters
          )
        )
      ).not.toContain("vehicleSize");
    });
  });

  context(
    'if queryStringParameters contains parameters with the string value "null" ',
    () => {
      it("vehicleConfiguration should be returned as null value", () => {
        const testQueryStringParameters = {
          vehicleAxles: "3",
          vehicleSize: "small",
          vehicleConfiguration: "null",
        };

        expect(
          parseAndCastQueryParams(testQueryStringParameters, numericParameters)
            .vehicleConfiguration
        ).toEqual(null);
      });

      it("vehicleWheels should be returned as null value", () => {
        const testQueryStringParameters = {
          vehicleAxles: "3",
          vehicleSize: "small",
          vehicleWheels: "null",
        };

        expect(
          parseAndCastQueryParams(testQueryStringParameters, numericParameters)
            .vehicleWheels
        ).toEqual(null);
      });

      it("vehicleClass should be returned as null value", () => {
        const testQueryStringParameters = {
          vehicleAxles: "3",
          vehicleSize: "small",
          vehicleClass: "null",
        };

        expect(
          parseAndCastQueryParams(testQueryStringParameters, numericParameters)
            .vehicleClass
        ).toEqual(null);
      });
    }
  );

  context(
    'if queryStringParameters contains parameters with the string value "undefined" ',
    () => {
      it("vehicleConfiguration should be returned as null value", () => {
        const testQueryStringParameters = {
          vehicleAxles: "3",
          vehicleSize: "small",
          vehicleConfiguration: "undefined",
        };

        expect(
          parseAndCastQueryParams(testQueryStringParameters, numericParameters)
            .vehicleConfiguration
        ).toEqual(null);
      });

      it("vehicleWheels should be returned as null value", () => {
        const testQueryStringParameters = {
          vehicleAxles: "3",
          vehicleSize: "small",
          vehicleWheels: "undefined",
        };

        expect(
          parseAndCastQueryParams(testQueryStringParameters, numericParameters)
            .vehicleWheels
        ).toEqual(null);
      });

      it("vehicleClass should be returned as null value", () => {
        const testQueryStringParameters = {
          vehicleAxles: "3",
          vehicleSize: "small",
          vehicleClass: "undefined",
        };

        expect(
          parseAndCastQueryParams(testQueryStringParameters, numericParameters)
            .vehicleClass
        ).toEqual(null);
      });
    }
  );

  context("if queryStringParameters contains numeric parameters ", () => {
    it("vehicleAxles should be converted to number", () => {
      const testQueryStringParameters = {
        vehicleAxles: "3",
      };

      expect(
        typeof parseAndCastQueryParams(
          testQueryStringParameters,
          numericParameters
        ).vehicleAxles
      ).toBe("number");
      expect(
        parseAndCastQueryParams(testQueryStringParameters, numericParameters)
          .vehicleAxles
      ).toBe(3);
    });

    it("vehicleWheels should be converted to number", () => {
      const testQueryStringParameters = {
        vehicleWheels: "4",
      };

      expect(
        typeof parseAndCastQueryParams(
          testQueryStringParameters,
          numericParameters
        ).vehicleWheels
      ).toBe("number");
      expect(
        parseAndCastQueryParams(testQueryStringParameters, numericParameters)
          .vehicleWheels
      ).toBe(4);
    });
  });

  context("if queryStringParameters.vehicleAxles is null string", () => {
    it("vehicleAxles should be returned as null value", () => {
      const queryStringParametersWithoutVehicleSize = {
        vehicleAxles: "null",
        vehicleSize: "small",
        vehicleConfiguration: "rigid",
      };

      expect(
        parseAndCastQueryParams(
          queryStringParametersWithoutVehicleSize,
          numericParameters
        ).vehicleAxles
      ).toEqual(null);
    });
  });

  context(
    "if queryStringParameters.vehicleAxles is a string representing a number",
    () => {
      it("vehicleAxles should be parsed", () => {
        const queryStringParametersWithoutVehicleSize = {
          vehicleAxles: "3",
          vehicleSize: "small",
          vehicleConfiguration: "rigid",
        };

        expect(
          parseAndCastQueryParams(
            queryStringParametersWithoutVehicleSize,
            numericParameters
          ).vehicleAxles
        ).toEqual(3);
      });
    }
  );

  context("if queryStringParameters does not contain vehicleAxles", () => {
    it("vehicleAxles should be returned null", () => {
      const queryStringParametersWithoutVehicleSize = {
        vehicleSize: "small",
        vehicleConfiguration: "rigid",
      };

      expect(
        parseAndCastQueryParams(
          queryStringParametersWithoutVehicleSize,
          numericParameters
        ).vehicleAxles
      ).toEqual(undefined);
    });
  });
});
