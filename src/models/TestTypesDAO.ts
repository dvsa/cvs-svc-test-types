import {
  BatchWriteItemOutput,
  DynamoDBClient,
  ScanOutput
} from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
import AWSXRay from "aws-xray-sdk";
import { Configuration } from "../utils/Configuration";
import { IDBConfig } from "./IDBConfig";
import { ITestType } from "./ITestType";
/* tslint:enable */

export default class TestTypesDAO {
  private readonly tableName: string;
  private static dbClient: DynamoDBDocumentClient;

  constructor() {
    const config: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
    this.tableName = config.table;
    if (!TestTypesDAO.dbClient) {
      let client;
      if (process.env._X_AMZN_TRACE_ID) {
        client = AWSXRay.captureAWSv3Client(new DynamoDBClient(config.params));
      } else {
        console.log("Serverless Offline detected; skipping AWS X-Ray setup");
        client = new DynamoDBClient(config.params);
      }
      TestTypesDAO.dbClient = DynamoDBDocumentClient.from(client);
    }
  }

  /**
   * Get All test Types  in the DB
   * @returns ultimately, an array of TestTypes objects, wrapped in a PromiseResult, wrapped in a Promise
   */
  public async getAll(): Promise<ScanOutput> {
    const command = new ScanCommand({ TableName: this.tableName });
    return await TestTypesDAO.dbClient.send(command);
  }

  /**
   * Write data about multiple Test Types to the DB.
   * @param testTypesItems: ITestType[]
   * @returns DynamoDB BatchWriteItemOutput, wrapped in promises
   */
  public async createMultiple(
    testTypesItems: ITestType[]
  ): Promise<BatchWriteItemOutput> {
    const params = this.generatePartialParams();
    testTypesItems.forEach((testTypesItem: ITestType) => {
      params.RequestItems[this.tableName].push({
        PutRequest: {
          Item: testTypesItem,
        },
      });
    });
    const command = new BatchWriteCommand(params);
    return await TestTypesDAO.dbClient.send(command);
  }

  /**
   * Removes multiple Test Types from the DB
   * @param primaryKeysToBeDeleted
   */
  public async deleteMultiple(
    primaryKeysToBeDeleted: string[][]
  ): Promise<BatchWriteItemOutput> {
    const params = this.generatePartialParams();

    primaryKeysToBeDeleted.forEach((compositeKey) => {
      params.RequestItems[this.tableName].push({
        DeleteRequest: {
          Key: {
            id: compositeKey[0],
            name: compositeKey[1],
          },
        },
      });
    });
    const command = new BatchWriteCommand(params);
    return await TestTypesDAO.dbClient.send(command);
  }

  /**
   * Internal method for getting a common parameter template
   */
  private generatePartialParams(): any {
    return {
      RequestItems: {
        [this.tableName]: Array(),
      },
    };
  }
}
