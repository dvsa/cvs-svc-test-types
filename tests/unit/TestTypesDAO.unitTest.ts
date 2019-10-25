import AWS from "aws-sdk";
import TestTypesDAO from "../../src/models/TestTypesDAO";
import {cloneDeep} from "lodash";
import testTypes from "../resources/test-types.json";
import {ITestType} from "../../src/models/ITestType";

describe("TestTypesDAO", () => {
  let branch: string | undefined = "";
  beforeAll(() => {
    branch = process.env.BRANCH;
    process.env.BRANCH = "local";
  });
  afterAll(() => {
    process.env.BRANCH = branch;
    jest.restoreAllMocks();
    jest.resetModules();
  });
  context("constructor", () => {
    it("creates new dbClient for new instance", () => {
      expect((TestTypesDAO as any).dbClient).toEqual(undefined);
      const dao = new TestTypesDAO();
      expect((TestTypesDAO as any).dbClient).not.toEqual(undefined);
    });
  });

  context("getAll", () => {
    it("returns data directly from DynamoDB", async () => {
      AWS.DynamoDB.DocumentClient.prototype.scan = jest.fn().mockImplementation(() => {
        return {
          promise: () => Promise.resolve("Success")
        };
      });
      const dao = new TestTypesDAO();
      expect(await dao.getAll()).toEqual("Success");
    });
    it("returns error on failed query", async () => {
      const myError = new Error("It broke");
      AWS.DynamoDB.DocumentClient.prototype.scan = jest.fn().mockImplementation(() => {
        return {
          promise: () => Promise.reject(myError)
        };
      });
      expect.assertions(1);
      try {
        await new TestTypesDAO().getAll();
      } catch (e) {
        expect(e.message).toEqual("It broke");
      }
    });
  });

  context("createMultiple", () => {
    it("returns data on Successful Query", async () => {
      const getMock = jest.fn().mockImplementation(() => {
        return {
          promise: () => Promise.resolve("Success")
        };
      });
      AWS.DynamoDB.DocumentClient.prototype.batchWrite = getMock;

      const output = await new TestTypesDAO().createMultiple(testTypes as ITestType[]);
      expect(output).toEqual("Success");
      expect(getMock.mock.calls).toHaveLength(1);
    });

    it("generates the correct query", async () => {
      let params: any = {};
      AWS.DynamoDB.DocumentClient.prototype.batchWrite = jest.fn().mockImplementation((args: any) => {
        params = args;
        return {
          promise: () => Promise.resolve("Good")
        };
      });

      expect.assertions(2);
      await new TestTypesDAO().createMultiple(testTypes as ITestType[]);
      // One PutRequest per entry
      expect(params.RequestItems["cvs-local-test-types"].length).toEqual(testTypes.length);
      expect(Object.keys(params.RequestItems["cvs-local-test-types"][0])[0]).toEqual("PutRequest");
    });

    it("Throws an error if AWS returns error", async () => {
      const myError = new Error("It broke");
      AWS.DynamoDB.DocumentClient.prototype.batchWrite = jest.fn().mockImplementation(() => {
        return {
          promise: () => Promise.reject(myError)
        };
      });
      try {
        await new TestTypesDAO().createMultiple(testTypes as ITestType[]);
      } catch (e) {
        expect(e.message).toEqual("It broke");
      }
    });
  });

  context("deleteMultiple", () => {
    it("returns data on Successful Query", async () => {
      const getMock = jest.fn().mockImplementation(() => {
        return {
          promise: () => Promise.resolve("Success")
        };
      });
      AWS.DynamoDB.DocumentClient.prototype.batchWrite = getMock;

      const testTypeIDs = cloneDeep(testTypes).map((testType) => [testType.id, testType.name]);

      const output = await new TestTypesDAO().deleteMultiple(testTypeIDs);
      expect(output).toEqual("Success");
      expect(getMock.mock.calls).toHaveLength(1);
    });

    it("generates the correct query", async () => {
      let params: any = {};
      AWS.DynamoDB.DocumentClient.prototype.batchWrite = jest.fn().mockImplementation((args: any) => {
        params = args;
        return {
          promise: () => Promise.resolve("Good")
        };
      });

      const testTypeIDs = cloneDeep(testTypes).map((testType) => [testType.id, testType.name]);

      expect.assertions(4);
      await new TestTypesDAO().deleteMultiple(testTypeIDs);
      // One PutRequest per entry
      expect(params.RequestItems["cvs-local-test-types"].length).toEqual(testTypes.length);
      expect(Object.keys(params.RequestItems["cvs-local-test-types"][0])[0]).toEqual("DeleteRequest");
      expect(params.RequestItems["cvs-local-test-types"][0].DeleteRequest.Key.id).toEqual(testTypes[0].id);
      expect(params.RequestItems["cvs-local-test-types"][0].DeleteRequest.Key.name).toEqual(testTypes[0].name);
    });
  });
  it("Throws an error if AWS returns error", async () => {
    const myError = new Error("It broke");
    AWS.DynamoDB.DocumentClient.prototype.batchWrite = jest.fn().mockImplementation(() => {
      return {
        promise: () => Promise.reject(myError)
      };
    });
    try {
      await new TestTypesDAO().deleteMultiple([["", ""]]);
    } catch (e) {
      expect(e.message).toEqual("It broke");
    }
  });

  context("generatePartialParams", () => {
    it("returns the Params skeleton", () => {
      expect({RequestItems: {"cvs-local-test-types": []}}).toEqual((new TestTypesDAO() as any).generatePartialParams());
    });
  });
});
