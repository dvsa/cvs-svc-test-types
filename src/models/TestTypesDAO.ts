import { Configuration } from "../utils/Configuration";
import { PromiseResult } from "aws-sdk/lib/request";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { ITestType } from "./ITestType";
import { IDBConfig } from "./IDBConfig";

/* tslint:disable */
let AWS: { DynamoDB: { DocumentClient: new (arg0: any) => DocumentClient } };
if (process.env._X_AMZN_TRACE_ID) {
  AWS = require("aws-xray-sdk").captureAWS(require("aws-sdk"));
} else {
  console.log("Serverless Offline detected; skipping AWS X-Ray setup");
  AWS = require("aws-sdk");
}
/* tslint:enable */

export default class TestTypesDAO {
  private readonly tableName: string;
  private static dbClient: DocumentClient;

  constructor() {
    const config: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
    this.tableName = config.table;
    if (!TestTypesDAO.dbClient) {
      TestTypesDAO.dbClient = new AWS.DynamoDB.DocumentClient(config.params);
    }
  }

  /**
   * Get All test Types  in the DB
   * @returns ultimately, an array of TestTypes objects, wrapped in a PromiseResult, wrapped in a Promise
   */
  public getAll(): Promise<
    PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>
  > {
    return TestTypesDAO.dbClient.scan({ TableName: this.tableName }).promise();
  }

  /**
   * Write data about multiple Test Types to the DB.
   * @param testTypesItems: ITestType[]
   * @returns DynamoDB BatchWriteItemOutput, wrapped in promises
   */
  public createMultiple(
    testTypesItems: ITestType[]
  ): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWS.AWSError>> {
    const params = this.generatePartialParams();
    testTypesItems.forEach((testTypesItem: ITestType) => {
      params.RequestItems[this.tableName].push({
        PutRequest: {
          Item: testTypesItem,
        },
      });
    });

    return TestTypesDAO.dbClient.batchWrite(params).promise();
  }

  /**
   * Removes multiple Test Types from the DB
   * @param primaryKeysToBeDeleted
   */
  public deleteMultiple(
    primaryKeysToBeDeleted: string[][]
  ): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWS.AWSError>> {
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

    return TestTypesDAO.dbClient.batchWrite(params).promise();
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
