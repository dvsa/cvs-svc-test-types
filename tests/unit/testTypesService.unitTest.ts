import {TestTypesService} from "../../src/services/TestTypesService";
import TestTypes from "../resources/test-types.json";
import {cloneDeep} from "lodash";
import {ERRORS, HTTPRESPONSE} from "../../src/assets/Enums";
import {ForEuVehicleCategory, ForVehicleSubclass, TestCode} from "../../src/models/ITestType";

describe("when database is on", () => {
  let mockTestTypesRecords: any;
  let testTypesService: TestTypesService | any;
  let MockTestTypesDAO: jest.Mock;

  beforeEach(() => {
    mockTestTypesRecords = cloneDeep(TestTypes);
    MockTestTypesDAO = jest.fn().mockImplementation(() => {
      return {
        getAll: () => {
          return Promise.resolve({
            Items: mockTestTypesRecords,
            Count: mockTestTypesRecords.length
          });
        }
      };
    });
    testTypesService = new TestTypesService(new MockTestTypesDAO());
  });

  afterEach(() => {
    mockTestTypesRecords = null;
    testTypesService = null;
    MockTestTypesDAO.mockReset();
  });

  context("database call returns valid data", () => {
    context("getTestTypesList", () => {
      it("should return the purged, sorted data", () => {
        const expectedTestTypesRecords = cloneDeep(mockTestTypesRecords);
        MockTestTypesDAO = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.resolve({
                Items: mockTestTypesRecords,
                Count: mockTestTypesRecords.length
              });
            }
          };
        });
        testTypesService = new TestTypesService(new MockTestTypesDAO());
        testTypesService.purgeTestTypes(expectedTestTypesRecords);
        testTypesService.sort(expectedTestTypesRecords);
        return testTypesService.getTestTypesList()
          .then((returnedRecords: any) => {
            expect(expectedTestTypesRecords).toEqual(returnedRecords);
          });
      });
    });

    context("getTestTypesById", () => {
      context("no tests with matching ID found", () => {
        it("throws 404", async () => {
          expect.assertions(2);
          try {
            await testTypesService.getTestTypesById("745", {
              fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
              vehicleType: "psv",
              vehicleSize: "small",
              vehicleConfiguration: "rigid"
            });
          } catch (e) {
            expect(e.statusCode).toEqual(404);
            expect(e.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
          }
        });
      });

      context("no tests with matching filter criteria found", () => {
        it("throws 404", async () => {
          expect.assertions(2);
          try {
            // No HGVs for id 1
            await testTypesService.getTestTypesById("1", {
              fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
              vehicleType: "hgv",
              vehicleSize: "small",
              vehicleConfiguration: "rigid",
            });
          } catch (e) {
            expect(e.statusCode).toEqual(404);
            expect(e.body).toEqual(HTTPRESPONSE.RESOURCE_NOT_FOUND);
          }
        });
      });

      context("testTypeClassification not requested", () => {
        it("returns id  and requested fields, without testTypeClassification", async () => {
          expect.assertions(4);
          const output = await testTypesService.getTestTypesById("1", {
              fields: ["defaultTestCode", "linkedTestCode"],
              vehicleType: "psv",
              vehicleSize: "small",
              vehicleConfiguration: "rigid",
            });
          const outputKeys = Object.keys(output);
          expect(outputKeys).toContain("id");
          expect(outputKeys).toContain("defaultTestCode");
          expect(outputKeys).toContain("linkedTestCode");
          expect(outputKeys).not.toContain("testTypeClassification");
        });
      });

      context("when vehicleAxles filter is not present", () => {
        it("should return the expected data", () => {
          return testTypesService.getTestTypesById("1", {
            fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
            vehicleType: "psv",
            vehicleSize: "small",
            vehicleConfiguration: "rigid"
          })
            .then((returnedRecords: any) => {
              expect(returnedRecords).toEqual({
                id: "1",
                testTypeClassification: "Annual With Certificate",
                defaultTestCode: "aas",
                linkedTestCode: null
              });
            });
        });
      });

      context("when vehicleSize and vehicleAxles filters are not present", () => {
        it("should return the expected data", () => {
          return testTypesService.getTestTypesById("1", {
            fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
            vehicleType: "psv",
            vehicleConfiguration: "articulated"
          })
            .then((returnedRecords: any) => {
              expect(returnedRecords).toEqual({
                id: "1",
                testTypeClassification: "Annual With Certificate",
                defaultTestCode: "adl",
                linkedTestCode: null
              });
            });
        });
      });

      context("when vehicleSize, vehicleAxles and vehicleConfiguration filters are not present", () => {
        it("should return the expected data", () => {
          return testTypesService.getTestTypesById("90", {
            fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
            vehicleType: "hgv"
          })
            .then((returnedRecords: any) => {
              expect(returnedRecords).toEqual({
                id: "90",
                testTypeClassification: "Annual NO CERTIFICATE",
                defaultTestCode: "qdv",
                linkedTestCode: null
              });
            });
        });
      });

      context("when vehicleSize, vehicleAxles and vehicleConfiguration filters are not present", () => {
        it("should return the expected data", () => {
          return testTypesService.getTestTypesById("90", {
            fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
            vehicleType: "hgv"
          })
            .then((returnedRecords: any) => {
              expect(returnedRecords).toEqual({
                id: "90",
                testTypeClassification: "Annual NO CERTIFICATE",
                defaultTestCode: "qdv",
                linkedTestCode: null
              });
            });
        });
      });
    });

    context("when the testCode queried contains an array on vehicleAxles field", () => {
      it("should return the testCode", () => {
        return testTypesService.getTestTypesById("62", {
          fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
          vehicleType: "hgv",
          vehicleAxles: 5
        })
          .then((returnedRecords: any) => {
            expect(returnedRecords).toEqual({
              id: "62",
              testTypeClassification: "Annual With Certificate",
              defaultTestCode: "qqv",
              linkedTestCode: null
            });
          });
      });
    });

    context("when vehicleSize, vehicleAxles and vehicleConfiguration filters are not present", () => {
      it("should return the expected data", () => {
        return testTypesService.getTestTypesById("90", {
          fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
          vehicleType: "hgv"
        })
            .then((returnedRecords: any) => {
              expect(returnedRecords).toEqual({
                id: "90",
                testTypeClassification: "Annual NO CERTIFICATE",
                defaultTestCode: "qdv",
                linkedTestCode: null
              });
            });
      });
    });

    context("when the testCode queried contains an array on vehicleAxles field", () => {
      it("should return the testCode", () => {
        return testTypesService.getTestTypesById("62", {
          fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
          vehicleType: "hgv",
          vehicleAxles: 5
        })
          .then((returnedRecords: any) => {
            expect(returnedRecords).toEqual({
              id: "62",
              testTypeClassification: "Annual With Certificate",
              defaultTestCode: "qqv",
              linkedTestCode: null
            });
          });
      });
    });

    context("when the testCode queried contains an array on vehicleAxles field", () => {
      it("should return the testCode", () => {
        return testTypesService.getTestTypesById("62", {
          fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
          vehicleType: "hgv",
          vehicleAxles: 5
        })
          .then((returnedRecords: any) => {
            expect(returnedRecords).toEqual({
              id: "62",
              testTypeClassification: "Annual With Certificate",
              defaultTestCode: "qqv",
              linkedTestCode: null
            });
          });
      });
    });
  });
});

context("database call returns empty data", () => {
  context("getTestTypesList", () => {
    it("should return error 404", async () => {
      const MockTestTypesDAO = jest.fn().mockImplementation(() => {
        return {
          getAll: () => {
            return Promise.resolve({
              Items: [],
              Count: 0
            });
          }
        };
      });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      try {
        await testTypesService.getTestTypesList();
      } catch (errorResponse) {
        expect(errorResponse.statusCode).toEqual(404);
        expect(errorResponse.body).toEqual("No resources match the search criteria.");
      }
    });

    context("getTestTypesById", () => {
      it("should return error 404", async () => {
        const MockTestTypesDAO = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.resolve({
                Items: [],
                Count: 0
              });
            }
          };
        });

        const testTypesService = new TestTypesService(new MockTestTypesDAO());

        try {
          await testTypesService.getTestTypesById("1", {
            fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
            vehicleType: "psv",
            vehicleSize: "small",
            vehicleConfiguration: "rigid"
          });
        } catch (errorResponse) {
          expect(errorResponse.statusCode).toEqual(404);
          expect(errorResponse.body).toEqual("No resources match the search criteria.");
        }
      });
    });
  });
});

describe("when database is off", () => {
  it("should return error 500", () => {

    const MockTestTypesDAO = jest.fn().mockImplementation(() => {
      return {
        getAll: () => {
          return Promise.reject({});
        }
      };
    });

    const testTypesService = new TestTypesService(new MockTestTypesDAO());

    return testTypesService.getTestTypesList()
      .then(() => undefined)
      .catch((errorResponse) => {
        expect(errorResponse.statusCode).toEqual(500);
        expect(errorResponse.body).toEqual("Internal Server Error");
      });
  });
});

describe("fieldInfilterExpressionMatchesTheOneInTestCode", () => {
  context("when passing a testCode that contains an array on field forVehicleAxles and a filterExpression that has a value included in that array  ", () => {
    it("should return true", () => {
      const testCode = JSON.parse("{\n" +
        "                \"forVehicleType\": \"hgv\",\n" +
        "                \"forVehicleSize\": null,\n" +
        "                \"forVehicleConfiguration\": null,\n" +
        "                \"forVehicleAxles\": [\n" +
        "                  4,\n" +
        "                  5,\n" +
        "                  6,\n" +
        "                  7,\n" +
        "                  8,\n" +
        "                  9,\n" +
        "                  10\n" +
        "                ],\n" +
        "                \"defaultTestCode\": \"qqv\",\n" +
        "                \"linkedTestCode\": null\n" +
        "              }");

      const filterExpression = {
        vehicleAxles: 5,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleAxles")).toEqual(true);
    });
  });

  context("when passing a testCode that contains an value on field forVehicleAxles and a filterExpression matches that value  ", () => {
    it("should return true", () => {
      const testCode = JSON.parse("{\n" +
        "                \"forVehicleType\": \"hgv\",\n" +
        "                \"forVehicleSize\": null,\n" +
        "                \"forVehicleConfiguration\": null,\n" +
        "                \"forVehicleAxles\": 5,\n" +
        "                \"defaultTestCode\": \"qqv\",\n" +
        "                \"linkedTestCode\": null\n" +
        "              }");

      const filterExpression = {
        vehicleAxles: 5,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleAxles")).toEqual(true);
    });
  });
});

describe("when database is off", () => {
  it("should return error 500", () => {

    const MockTestTypesDAO = jest.fn().mockImplementation(() => {
      return {
        getAll: () => {
          return Promise.reject({});
        }
      };
    });

    const testTypesService = new TestTypesService(new MockTestTypesDAO());

    return testTypesService.getTestTypesList()
      .then(() => undefined)
      .catch((errorResponse) => {
        expect(errorResponse.statusCode).toEqual(500);
        expect(errorResponse.body).toEqual("Internal Server Error");
      });
  });
});

describe("fieldInfilterExpressionMatchesTheOneInTestCode", () => {
  context("when passing a testCode that contains an array on field forVehicleAxles and a filterExpression that has a value included in that array  ", () => {
    it("should return true", () => {
      const testCode = JSON.parse("{\n" +
        "                \"forVehicleType\": \"hgv\",\n" +
        "                \"forVehicleSize\": null,\n" +
        "                \"forVehicleConfiguration\": null,\n" +
        "                \"forVehicleAxles\": [\n" +
        "                  4,\n" +
        "                  5,\n" +
        "                  6,\n" +
        "                  7,\n" +
        "                  8,\n" +
        "                  9,\n" +
        "                  10\n" +
        "                ],\n" +
        "                \"defaultTestCode\": \"qqv\",\n" +
        "                \"linkedTestCode\": null\n" +
        "              }");

      const filterExpression = {
        vehicleAxles: 5,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleAxles")).toEqual(true);
    });
  });

  context("when passing a testCode that contains an value on field forVehicleAxles and a filterExpression matches that value  ", () => {
    it("should return true", () => {
      const testCode = JSON.parse("{\n" +
        "                \"forVehicleType\": \"hgv\",\n" +
        "                \"forVehicleSize\": null,\n" +
        "                \"forVehicleConfiguration\": null,\n" +
        "                \"forVehicleAxles\": 5,\n" +
        "                \"defaultTestCode\": \"qqv\",\n" +
        "                \"linkedTestCode\": null\n" +
        "              }");

      const filterExpression = {
        vehicleAxles: 5,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleAxles")).toEqual(true);
    });
  });

  context("when passing filterExpression with non valid fields", () => {
    it("should throw a 500 error", () => {
      const testCode = {} as TestCode;

      const filterExpression = {
        nonexistentFilter: null,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect.assertions(2);
      try {
        testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "nonexistentFilter");
      } catch (error) {
        expect(error.statusCode).toBe(500);
        expect(error.body).toBe(ERRORS.InternalServerError);
      }
    });
  });

  context("when filtering based on forEuVehicleCategory defined as an array", () => {
    it("should return true", () => {
      const testCode = {
        forEuVehicleCategory: [
          ForEuVehicleCategory.N2,
          ForEuVehicleCategory.N3,
        ]
      } as TestCode;

      const filterExpression = {
        euVehicleCategory: ForEuVehicleCategory.N2,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forEuVehicleCategory")).toBe(true);
    });
  });

  context("when filtering based on forEuVehicleCategory defined as a single value", () => {
    it("should return true", () => {
      const testCode = {
        forEuVehicleCategory: ForEuVehicleCategory.N2
      } as TestCode;

      const filterExpression = {
        euVehicleCategory: ForEuVehicleCategory.N2,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forEuVehicleCategory")).toBe(true);
    });
  });

  context("when filtering based on forVehicleClass defined as an array", () => {
    it("should return true", () => {
      const testCode = {
        forVehicleClass: [
          "a",
          "b",
        ]
      } as TestCode;

      const filterExpression = {
        vehicleClass: "a",
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleClass")).toBe(true);
    });
  });

  context("when filtering based on forVehicleClass defined as a single value", () => {
    it("should return true", () => {
      const testCode = {
        forVehicleClass: "a"
      } as TestCode;

      const filterExpression = {
        vehicleClass: "a",
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleClass")).toBe(true);
    });
  });

  context("when filtering based on forVehicleSubclass defined as an array", () => {
    it("should return true", () => {
      const testCode = {
        forVehicleSubclass: [
          ForVehicleSubclass.A,
          ForVehicleSubclass.C,
        ]
      } as TestCode;

      const filterExpression = {
        vehicleSubclass: ForVehicleSubclass.A,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleSubclass")).toBe(true);
    });
  });

  context("when filtering based on forVehicleSubclass defined as a single value", () => {
    it("should return true", () => {
      const testCode = {
        forVehicleSubclass: ForVehicleSubclass.A,
      } as TestCode;

      const filterExpression = {
        vehicleSubclass: ForVehicleSubclass.A,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleSubclass")).toBe(true);
    });
  });

  context("when filtering based on forVehicleWheels defined as an array", () => {
    it("should return true", () => {
      const testCode = {
        forVehicleWheels: [
          1,
          2,
          3,
        ]
      } as TestCode;

      const filterExpression = {
        vehicleWheels: 3,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleWheels")).toBe(true);
    });
  });

  context("when filtering based on forVehicleWheels defined as a single value", () => {
    it("should return true", () => {
      const testCode = {
        forVehicleWheels: 1,
      } as TestCode;

      const filterExpression = {
        vehicleWheels: 1,
      };
      // tslint:disable-next-line:no-empty
      const MockTestTypesDAO = jest.fn().mockImplementation(() => { });

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleWheels")).toBe(true);
    });
  });
});
