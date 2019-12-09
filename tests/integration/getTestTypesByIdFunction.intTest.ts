import LambdaTester from "lambda-tester";
import {getTestTypesById} from "../../src/functions/getTestTypesById";
import {emptyDatabase, populateDatabase} from "../util/dbOperations";

describe("getTestTypesById", () => {
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
  context("when the queryStringParameters are invalid", () => {
    it("should return 400", () => {
      return LambdaTester(getTestTypesById)
        .event({
          queryStringParameters: {
            fields: "testTypeClassification, defaultTestCode, linkedTestCode",
            vehicleType: "psv",
            vehicleSize: "smalll",
            vehicleConfiguration: "rigid",
            vehicleAxles: "2"
          }
        })
        .expectResolve((result: { statusCode: any; body: any; }) => {
          expect(result.statusCode).toEqual(400);
          expect(result.body).toEqual('"Query parameter \\"vehicleSize\\" must be one of [small, large]"');
        });
    });
  });

  context("when the queryStringParameter vehicleAxles is out of range", () => {
    it("should return 400", () => {
      return LambdaTester(getTestTypesById)
        .event({
          queryStringParameters: {
            fields: "testTypeClassification, defaultTestCode, linkedTestCode",
            vehicleType: "psv",
            vehicleSize: "small",
            vehicleConfiguration: "rigid",
            vehicleAxles: "101"
          }
        })
        .expectResolve((result: { statusCode: any; body: any; }) => {
          expect(result.statusCode).toEqual(400);
          expect(result.body).toEqual('"Query parameter \\"vehicleAxles\\" must be less than or equal to 99"');
        });
    });
  });

  context("when the queryStringParameter vehicleAxles is out of range from below", () => {
    it("should return 400", () => {
      return LambdaTester(getTestTypesById)
        .event({
          queryStringParameters: {
            fields: "testTypeClassification, defaultTestCode, linkedTestCode",
            vehicleType: "psv",
            vehicleSize: "small",
            vehicleConfiguration: "rigid",
            vehicleAxles: "-1"
          }
        })
        .expectResolve((result: { statusCode: any; body: any; }) => {
          expect(result.statusCode).toEqual(400);
          expect(result.body).toEqual('"Query parameter \\"vehicleAxles\\" must be larger than or equal to 0"');
        });
    });
  });

  context("when the queryStringParameter vehicleAxles is in range", () => {
    it("should return 200", () => {
      const expectedResult = { id: "30",
            testTypeClassification: "NON ANNUAL",
            defaultTestCode: "qal",
            linkedTestCode: null
          };
      return LambdaTester(getTestTypesById)
        .event({
          queryStringParameters: {
            fields: "testTypeClassification, defaultTestCode, linkedTestCode",
            vehicleType: "psv",
            vehicleSize: "large",
            vehicleConfiguration: "rigid",
            vehicleAxles: 2
          },
          pathParameters: {
            id: "30"
          }
        })
        .expectResolve((result: { statusCode: any; body: string; }) => {
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.body)).toEqual(expectedResult);
        });
    });
  });

  context("when the queryStringParameter vehicleAxles is null", () => {
    it("should return 200", () => {
      const expectedResult = { id: "48",
            testTypeClassification: "Annual NO CERTIFICATE",
            defaultTestCode: "nvv",
            linkedTestCode: null
          };
      return LambdaTester(getTestTypesById)
        .event({
          queryStringParameters: {
            fields: "testTypeClassification, defaultTestCode, linkedTestCode",
            vehicleType: "hgv",
              vehicleSize: "small",
            vehicleAxles: "null"
          },
          pathParameters: {
            id: "48"
          }
        })
        .expectResolve((result: { statusCode: any; body: string; }) => {
            console.error(result.body);
            expect(result.statusCode).toEqual(200);
            expect(JSON.parse(result.body)).toEqual(expectedResult);
        });
    });
  });

  context("when the queryStringParameter vehicleAxles is sent null as String", () => {
    it("should return 200", () => {
      const expectedResult = { id: "48",
            testTypeClassification: "Annual NO CERTIFICATE",
            defaultTestCode: "nvv",
            linkedTestCode: null
          };
      return LambdaTester(getTestTypesById)
        .event({
          queryStringParameters: {
            fields: "testTypeClassification, defaultTestCode, linkedTestCode",
            vehicleType: "hgv",
            vehicleSize: "large",
            vehicleConfiguration: "rigid",
            vehicleAxles: "null"
          },
          pathParameters: {
            id: "48"
          }
        })
        .expectResolve((result: { statusCode: any; body: string; }) => {
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.body)).toEqual(expectedResult);
        });
    });
  });

  context("when the queryStringParameter vehicleConfiguration is sent null as String", () => {
        it("should return 200", () => {
            const expectedResult = { id: "48",
                testTypeClassification: "Annual NO CERTIFICATE",
                defaultTestCode: "nvv",
                linkedTestCode: null
            };
            return LambdaTester(getTestTypesById)
                .event({
                    queryStringParameters: {
                        fields: "testTypeClassification, defaultTestCode, linkedTestCode",
                        vehicleType: "hgv",
                        vehicleSize: "large",
                        vehicleConfiguration: "null",
                        vehicleAxles: "3"
                    },
                    pathParameters: {
                        id: "48"
                    }
                })
                .expectResolve((result: { statusCode: any; body: string; }) => {
                    expect(result.statusCode).toEqual(200);
                    expect(JSON.parse(result.body)).toEqual(expectedResult);
                });
        });
    });

  context("when the queryStringParameter vehicleAxles is not present", () => {
        it("should return 200", () => {
            const expectedResult = { id: "48",
                testTypeClassification: "Annual NO CERTIFICATE",
                defaultTestCode: "nvv",
                linkedTestCode: null
            };
            return LambdaTester(getTestTypesById)
                .event({
                    queryStringParameters: {
                        fields: "testTypeClassification, defaultTestCode, linkedTestCode",
                        vehicleType: "hgv",
                        vehicleSize: "large"
                    },
                    pathParameters: {
                        id: "48"
                    }
                })
                .expectResolve((result: { statusCode: any; body: string; }) => {
                    expect(result.statusCode).toEqual(200);
                    expect(JSON.parse(result.body)).toEqual(expectedResult);
                });
        });
    });

  context("when the request is valid", () => {
    context("and the parameters match a test type in the database", () => {
      it("should return 200", () => {
        return LambdaTester(getTestTypesById)
          .event({
            queryStringParameters: {
              fields: "testTypeClassification",
              vehicleType: "psv",
              vehicleSize: "small",
              vehicleConfiguration: "rigid"
            },
            pathParameters: {
              id: "1"
            }
          })
          .expectResolve((result: { statusCode: any; body: string; }) => {
            expect(result.statusCode).toEqual(200);
            expect(JSON.parse(result.body).id).toEqual("1");
            expect(JSON.parse(result.body).testTypeClassification).toEqual("Annual With Certificate");
          });
      });
    });

    context("and the parameters match a test category in the database", () => {
      it("should return 404", () => {
        return LambdaTester(getTestTypesById)
          .event({
            queryStringParameters: {
              fields: "testTypeClassification",
              vehicleType: "psv",
              vehicleSize: "small",
              vehicleConfiguration: "rigid"
            },
            pathParameters: {
              id: "2"
            }
          })
          .expectResolve((result: { statusCode: any; body: any; }) => {
            expect(result.statusCode).toEqual(404);
            expect(result.body).toEqual('"No resources match the search criteria."');
          });
      });
    });

    context("when searching for tests defined for vehicles with 5+ axles", () => {
      it("should return the correct test (200) for a vehicle with 5+ axles", () => {
        const expectedResult = {
          id: "72",
          testTypeClassification: "Annual NO CERTIFICATE",
          defaultTestCode: "pov5",
          linkedTestCode: null
        };
        return LambdaTester(getTestTypesById)
          .event({
            queryStringParameters: {
              fields: "testTypeClassification, defaultTestCode, linkedTestCode",
              vehicleType: "hgv",
              vehicleSize: "large",
              vehicleConfiguration: null,
              vehicleAxles: 7
            },
            pathParameters: {
              id: "72"
            }
          })
          .expectResolve((result: { statusCode: any; body: string; }) => {
            expect(result.statusCode).toEqual(200);
            expect(JSON.parse(result.body)).toEqual(expectedResult);
          });
      });

      it("should return 404 if the vehicle has less axles than the test has defined", () => {
        return LambdaTester(getTestTypesById)
          .event({
            queryStringParameters: {
              fields: "testTypeClassification, defaultTestCode, linkedTestCode",
              vehicleType: "hgv",
              vehicleSize: "large",
              vehicleConfiguration: null,
              vehicleAxles: 1
            },
            pathParameters: {
              id: "72"
            }
          })
          .expectResolve((result: { statusCode: any; body: string; }) => {
            expect(result.statusCode).toEqual(404);
          });
      });
    });
  });

});
