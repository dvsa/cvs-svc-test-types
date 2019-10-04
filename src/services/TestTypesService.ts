import { HTTPError } from "../models/HTTPError";
import TestTypesDAO from "../models/TestTypesDAO";
import { ITestType } from "../models/ITestType";
import {ERRORS} from "../assets/Enums";

export class TestTypesService {
  public readonly testTypesDAO: TestTypesDAO;

  constructor(testTypesDAO: TestTypesDAO) {
    this.testTypesDAO = testTypesDAO;
  }

  public getTestTypesList() {
    return this.testTypesDAO.getAll()
      .then((data) => {
        if (data.Count === 0) {
          throw new HTTPError(404, "No resources match the search criteria.");
        }

        this.purgeTestTypes(data.Items);
        return this.sort(data.Items);
      })
      .catch((error) => {
        if (!(error instanceof HTTPError)) {
          console.error(error);
          error.statusCode = 500;
          error.body = "Internal Server Error";
        }

        throw new HTTPError(error.statusCode, error.body);
      });
  }

  public getTestTypesById(id: string, filterExpression: any) {
    return this.testTypesDAO.getAll()
      .then((data) => {
        if (data.Count === 0) {
          throw new HTTPError(404, "No resources match the search criteria.");
        }

        return data.Items;
      })
      .then((testTypes) => {
        return this.findTestType({ id, testTypes });
      })
      .then((testType) => {
        if (testType === null) {
          throw new HTTPError(404, "No resources match the search criteria.");
        }
        let testCodes = testType.testCodes;

        testCodes = testCodes.filter((testCode: ITestType) => { // filter by vehicleType if present in DB, otherwise skip
          return testCode.forVehicleType ? testCode.forVehicleType === filterExpression.vehicleType : true;
        }).filter((testCode: ITestType) => { // filter by vehicleSize if present in DB & in request, otherwise skip
          return (testCode.forVehicleSize && filterExpression.vehicleSize) ? this.fieldInfilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleSize") : true;
        }).filter((testCode: ITestType) => { // filter by vehicleConfiguration if present in DB & in request, otherwise skip
          return (testCode.forVehicleConfiguration && filterExpression.vehicleConfiguration) ? this.fieldInfilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleConfiguration") : true;
        }).filter((testCode: ITestType) => { // filter by vehicleAxles if present in DB & in request, otherwise skip
          return (testCode.forVehicleAxles && filterExpression.vehicleAxles) ? this.fieldInfilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleAxles") : true;
        });

        if (testCodes.length === 0) {
          throw new HTTPError(404, "No resources match the search criteria.");
        }

        if (testCodes.length > 1) {
          console.error("More than one testType was retrieved");
          throw new HTTPError(500, "Internal server error");
        }

        const response: any = {
          id: testType.id
        };

        filterExpression.fields // Iterate through filterExpression's fields and populate them in the response
          .forEach((field: string) => {
            response[field] = testCodes[0][field];
          });

        // Populating testTypeClassification that is found in testType, not testCode
        if (filterExpression.fields.includes("testTypeClassification")) {
          response.testTypeClassification = testType.testTypeClassification;
        }
        return response;
      });
  }

  public findTestType({ id, testTypes }: { id: string; testTypes: any; }) {
    for (const testType of testTypes) {
    // for (let i = 0; i < testTypes.length; i++) {
    //   const testType: any = testTypes[i];
      if (testType.hasOwnProperty("nextTestTypesOrCategories")) {
        const childrenTestType: any = this.findTestType({ id, testTypes: testType.nextTestTypesOrCategories });

        if (childrenTestType != null) {
          return childrenTestType;
        }
      } else if (testType.hasOwnProperty("id") && testType.id === id) {
        return testType;
      }
    }
    return null;
  }

  public sort(testTypes: ITestType[] | any) {
    // Pass by value
    const testTypeArray = testTypes;

    for (const testType of testTypeArray) {
    // for (let i = 0; i < testTypeArray.length; i++) {
      // const testType = testTypeArray[i];

      if (testType.hasOwnProperty("nextTestTypesOrCategories")) {
        Object.assign(testTypeArray, { nextTestTypesOrCategories: this.sort(testType.nextTestTypesOrCategories) });
      }
    }

    return testTypeArray.sort((a: { id: string; }, b: { id: string; }) => parseInt(a.id, 10) - parseInt(b.id, 10));
  }

  public purgeTestTypes(testTypes: ITestType[] | any) {
    for (const testType of testTypes) {
    // for (let i = 0; i < testTypes.length; i++) {
      // const testType = testTypes[i];
      if (testType.hasOwnProperty("nextTestTypesOrCategories")) {
        this.purgeTestTypes(testType.nextTestTypesOrCategories);
      } else if (testType.hasOwnProperty("id")) {
        delete testType.testTypeClassification;
        delete testType.testCodes;
      }
    }
  }

  public insertTestTypesList(testTypesItems: ITestType[] ) {
    return this.testTypesDAO.createMultiple(testTypesItems)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems;
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error);
          throw new HTTPError(500, "Internal Server Error");
        }
      });
  }

  public deleteTestTypesList(testTypesItemKeys: any ) {
    return this.testTypesDAO.deleteMultiple(testTypesItemKeys)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems;
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error);
          throw new HTTPError(500, "Internal Server Error");
        }
      });
  }

  public fieldInfilterExpressionMatchesTheOneInTestCode(testCode: any, filterExpression: any, field: string) {
    let bool = false;
    switch (field) {
      case "forVehicleSize":
        if (Array.isArray(testCode.forVehicleSize)) {
          testCode.forVehicleSize.map((sizeValue: number) => {
            if (sizeValue === filterExpression.vehicleSize) {
              bool = true;
            }
          });
        } else {
          bool = testCode.forVehicleSize === filterExpression.vehicleSize;
        }
        break;
      case "forVehicleConfiguration":
        if (Array.isArray(testCode.forVehicleConfiguration)) {
          testCode.forVehicleConfiguration.map((configurationValue: number) => {
            if (configurationValue === filterExpression.vehicleConfiguration) {
              bool = true;
            }
          });
        } else {
          bool = testCode.forVehicleConfiguration === filterExpression.vehicleConfiguration;
        }
        break;
      case "forVehicleAxles":
        if (Array.isArray(testCode.forVehicleAxles)) {
          testCode.forVehicleAxles.map((axleValue: number) => {
            if (axleValue === filterExpression.vehicleAxles) {
              bool = true;
            }
          });
        } else {
          bool = testCode.forVehicleAxles === filterExpression.vehicleAxles;
        }
        break;
      default:
        console.error("Field you filtered by does not exist");
        throw(new HTTPError(500, ERRORS.InternalServerError));
    }

    return bool;
  }

}
