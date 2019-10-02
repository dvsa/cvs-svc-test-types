/* global describe it context */
import { expect } from "chai";
import { TestTypesService } from "../../src/services/TestTypesService";
import fs from "fs";
import TestTypes from "../resources/test-types.json";
import path from "path";

describe("getTestTypesList", () => {
  describe("when database is on", () => {
    context("database call returns valid data", () => {
      context("getTestTypesList", () => {
        const expectedTestTypesRecords: any = [...TestTypes];
        it("should return the expected data", () => {
          const MockTestTypesDAO = jest.fn().mockImplementation(() => {
            return {
              getAll: () => {
                return Promise.resolve({
                  Items: expectedTestTypesRecords,
                  Count: expectedTestTypesRecords.length
                });
              }
            };
          });

          const testTypesService = new TestTypesService(new MockTestTypesDAO());
          return testTypesService.getTestTypesList()
            .then((returnedRecords) => {
              expect(returnedRecords).to.eql(expectedTestTypesRecords);
            });
        });
      });

      context("getTestTypesById", () => {
        let mockTestTypesRecords: any;
        let testTypesService: TestTypesService | any;
        let MockTestTypesDAO: jest.Mock;
        beforeEach(() => {
          mockTestTypesRecords = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/test-types.json"), "utf8"));
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

        context("when vehicleAxles filter is not present", () => {
          it("should return the expected data", () => {
            return testTypesService.getTestTypesById("1", {
              fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"],
              vehicleType: "psv",
              vehicleSize: "small",
              vehicleConfiguration: "rigid"
            })
              .then((returnedRecords: any) => {
                expect(returnedRecords).to.eql({
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
                expect(returnedRecords).to.deep.equal({
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
                  expect(returnedRecords).to.deep.equal({
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
                  expect(returnedRecords).to.deep.equal({
                    id: "62",
                    testTypeClassification: "Annual NO CERTIFICATE",
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
        it("should return error 404", () => {
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

          return testTypesService.getTestTypesList()
            .then(() => {
              expect.fail();
            }).catch((errorResponse) => {
              expect(errorResponse.statusCode).to.equal(404);
              expect(errorResponse.body).to.equal("No resources match the search criteria.");
            });
        });
      });

      context("getTestTypesById", () => {
        it("should return error 404", () => {
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

          return testTypesService.getTestTypesById("1", { fields: ["testTypeClassification", "defaultTestCode", "linkedTestCode"], vehicleType: "psv", vehicleSize: "small", vehicleConfiguration: "rigid" })
            .then(() => {
              expect.fail();
            }).catch((errorResponse: { statusCode: any; body: any; }) => {
              expect(errorResponse.statusCode).to.equal(404);
              expect(errorResponse.body).to.equal("No resources match the search criteria.");
            });
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
        .then(() => undefined )
        .catch((errorResponse) => {
          expect(errorResponse.statusCode).to.be.equal(500);
          expect(errorResponse.body).to.equal("Internal Server Error");
        });
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
      const MockTestTypesDAO = jest.fn().mockImplementation(() => {});

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInfilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleAxles")).to.eql(true);
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
      const MockTestTypesDAO = jest.fn().mockImplementation(() => {});

      const testTypesService = new TestTypesService(new MockTestTypesDAO());

      expect(testTypesService.fieldInfilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleAxles")).to.eql(true);
    });
  });
});
