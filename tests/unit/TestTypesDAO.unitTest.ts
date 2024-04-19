import { BatchWriteCommand, BatchWriteCommandOutput, DynamoDBDocumentClient, ScanCommand, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { cloneDeep } from "lodash";
import { ITestType } from "../../src/models/ITestType";
import TestTypesDAO from "../../src/models/TestTypesDAO";
import testTypes from "../resources/test-types.json";

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
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(ScanCommand).resolves("Success" as unknown as ScanCommandOutput);
      const dao = new TestTypesDAO();
      expect(await dao.getAll()).toEqual("Success");
    });
    it("returns error on failed query", async () => {
      const myError = new Error("It broke");
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(ScanCommand).rejects(myError);
      expect.assertions(1);
      try {
        await new TestTypesDAO().getAll();
      } catch (e) {
        expect((e as Error).message).toEqual("It broke");
      }
    });
  });

  context("createMultiple", () => {
    it("returns data on Successful Query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(BatchWriteCommand).resolves("Success" as unknown as BatchWriteCommandOutput);

      const output = await new TestTypesDAO().createMultiple(
        testTypes as ITestType[]
      );
      expect(output).toEqual("Success");
      expect(mockDynamoClient.commandCalls(BatchWriteCommand)).toHaveLength(1);
    });

    it("generates the correct query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(BatchWriteCommand)
        .resolves("Good" as unknown as BatchWriteCommandOutput);

      expect.assertions(2);
      await new TestTypesDAO().createMultiple(testTypes as ITestType[]);
      const stub = mockDynamoClient.commandCalls(BatchWriteCommand);
      const testTypesStub = stub[0].args[0].input.RequestItems!["cvs-local-test-types"];
      // One PutRequest per entry
      expect(testTypesStub.length).toEqual(
        testTypes.length
      );
      expect(
        Object.keys(testTypesStub[0])[0]
      ).toEqual("PutRequest");
    });

    it("Throws an error if AWS returns error", async () => {
      const myError = new Error("It broke");
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(BatchWriteCommand)
        .rejects(myError as unknown as BatchWriteCommandOutput);
      try {
        await new TestTypesDAO().createMultiple(testTypes as ITestType[]);
      } catch (e) {
        expect((e as Error).message).toEqual("It broke");
      }
    });
  });

  context("deleteMultiple", () => {
    it("returns data on Successful Query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(BatchWriteCommand).resolves("Success" as unknown as BatchWriteCommandOutput);

      const testTypeIDs = cloneDeep(testTypes).map((testType) => [
        testType.id,
        testType.name,
      ]);

      const output = await new TestTypesDAO().deleteMultiple(testTypeIDs);
      expect(output).toEqual("Success");
      expect(mockDynamoClient.commandCalls(BatchWriteCommand)).toHaveLength(1);
    });

    it("generates the correct query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(BatchWriteCommand)
        .resolves("Good" as unknown as BatchWriteCommandOutput);

      const testTypeIDs = cloneDeep(testTypes).map((testType) => [
        testType.id,
        testType.name,
      ]);

      expect.assertions(4);
      await new TestTypesDAO().deleteMultiple(testTypeIDs);
      const stub = mockDynamoClient.commandCalls(BatchWriteCommand);
      const testTypesStub = stub[0].args[0].input.RequestItems!["cvs-local-test-types"];
      // One PutRequest per entry
      expect(testTypesStub.length).toEqual(
        testTypes.length
      );
      expect(
        Object.keys(testTypesStub[0])[0]
      ).toEqual("DeleteRequest");
      expect(
        testTypesStub[0].DeleteRequest!.Key!.id
      ).toEqual(testTypes[0].id);
      expect(
        testTypesStub[0].DeleteRequest!.Key!.name
      ).toEqual(testTypes[0].name);
    });
  });
  it("Throws an error if AWS returns error", async () => {
    const myError = new Error("It broke");
    const mockDynamoClient = mockClient(DynamoDBDocumentClient);
    mockDynamoClient
      .on(BatchWriteCommand)
      .rejects(myError as unknown as BatchWriteCommandOutput);
    try {
      await new TestTypesDAO().deleteMultiple([["", ""]]);
    } catch (e) {
      expect((e as Error).message).toEqual("It broke");
    }
  });

  context("generatePartialParams", () => {
    it("returns the Params skeleton", () => {
      expect({ RequestItems: { "cvs-local-test-types": [] } }).toEqual(
        (new TestTypesDAO() as any).generatePartialParams()
      );
    });
  });
});
