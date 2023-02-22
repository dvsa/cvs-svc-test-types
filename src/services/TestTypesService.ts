import { HTTPError } from "../models/HTTPError";
import TestTypesDAO from "../models/TestTypesDAO";
import {
  ITestType,
  NextTestTypesOrCategory,
  TestCode,
} from "../models/ITestType";
import { ERRORS, HTTPRESPONSE } from "../assets/Enums";

export class TestTypesService {
  public readonly testTypesDAO: TestTypesDAO;

  constructor(testTypesDAO: TestTypesDAO) {
    this.testTypesDAO = testTypesDAO;
  }

  public async getTestTypesList(typeOfTest?: string) {
    try {
      const data = await this.testTypesDAO.getAll();
      if (data.Count === 0) {
        throwResourceNotFound();
      }
      this.purgeTestTypes(data.Items);
      const filteredArray = this.filterTaxonomyTypes(
        data.Items as ITestType[],
        typeOfTest
      );
      return this.sort(filteredArray);
    } catch (error) {
      if (!(error instanceof HTTPError)) {
        console.error(error);
        error.statusCode = 500;
        error.body = "Internal Server Error";
      }

      throw new HTTPError(error.statusCode, error.body);
    }
  }

  public getTestTypesById(id: string, filterExpression: any) {
    return this.testTypesDAO
      .getAll()
      .then((data) => {
        if (data.Count === 0) {
          throwResourceNotFound();
        }

        return data.Items;
      })
      .then((testTypes) => {
        return this.findTestType({ id, testTypes });
      })
      .then((testType) => {
        if (testType === null) {
          throwResourceNotFound();
        }
        let testCodes: TestCode[] = testType.testCodes;

        testCodes = testCodes
          .filter((testCode) => {
            // filter by vehicleType if present in DB, otherwise skip
            return testCode.forVehicleType
              ? this.fieldInFilterExpressionMatchesTheOneInTestCode(
                  testCode,
                  filterExpression,
                  "forVehicleType"
                )
              : true;
          })
          .filter((testCode) => {
            // filter by vehicleSize if present in DB & in request, otherwise skip
            return testCode.forVehicleSize && filterExpression.vehicleSize
              ? this.fieldInFilterExpressionMatchesTheOneInTestCode(
                  testCode,
                  filterExpression,
                  "forVehicleSize"
                )
              : true;
          })
          .filter((testCode) => {
            // filter by vehicleConfiguration if present in DB & in request, otherwise skip
            return testCode.forVehicleConfiguration &&
              filterExpression.vehicleConfiguration
              ? this.fieldInFilterExpressionMatchesTheOneInTestCode(
                  testCode,
                  filterExpression,
                  "forVehicleConfiguration"
                )
              : true;
          })
          .filter((testCode) => {
            // filter by vehicleAxles if present in DB & in request, otherwise skip
            return testCode.forVehicleAxles && filterExpression.vehicleAxles
              ? this.fieldInFilterExpressionMatchesTheOneInTestCode(
                  testCode,
                  filterExpression,
                  "forVehicleAxles"
                )
              : true;
          })
          .filter((testCode) => {
            return testCode.forEuVehicleCategory &&
              filterExpression.euVehicleCategory
              ? this.fieldInFilterExpressionMatchesTheOneInTestCode(
                  testCode,
                  filterExpression,
                  "forEuVehicleCategory"
                )
              : true;
          })
          .filter((testCode) => {
            return testCode.forVehicleClass && filterExpression.vehicleClass
              ? this.fieldInFilterExpressionMatchesTheOneInTestCode(
                  testCode,
                  filterExpression,
                  "forVehicleClass"
                )
              : true;
          })
          .filter((testCode) => {
            return testCode.forVehicleSubclass &&
              filterExpression.vehicleSubclass
              ? this.fieldInFilterExpressionMatchesTheOneInTestCode(
                  testCode,
                  filterExpression,
                  "forVehicleSubclass"
                )
              : true;
          })
          .filter((testCode) => {
            return testCode.forVehicleWheels && filterExpression.vehicleWheels
              ? this.fieldInFilterExpressionMatchesTheOneInTestCode(
                  testCode,
                  filterExpression,
                  "forVehicleWheels"
                )
              : true;
          });

        if (testCodes.length === 0) {
          throwResourceNotFound();
        }

        if (testCodes.length > 1) {
          console.error("More than one testType was retrieved");
          throwInternalServerError();
        }

        const response: any = {
          id: testType.id,
        };

        // Populating testTypeClassification that is found in testType, not testCode
        this.addFieldsToResponse(
          testType,
          testCodes[0],
          filterExpression.fields,
          response
        );
        return response;
      });
  }

  public addFieldsToResponse(
    testType: ITestType,
    testCode: TestCode,
    fields: string[],
    response: any
  ): void {
    fields.forEach((field) => {
      if (testCode.hasOwnProperty(field)) {
        response[field] = testCode[field as keyof TestCode];
      } else if (testType.hasOwnProperty(field)) {
        response[field] = testType[field as keyof ITestType];
      }
    });
  }

  public filterTaxonomyTypes(
    testTypesTaxonomy: ITestType[] | NextTestTypesOrCategory[],
    typeOfTest?: string
  ): ITestType[] | NextTestTypesOrCategory[] {
    return testTypesTaxonomy
      .filter(
        (testTypes) =>
          testTypes.typeOfTest === typeOfTest || !testTypes.typeOfTest
      )
      .map((testType) => {
        if (testType.nextTestTypesOrCategories) {
          testType.nextTestTypesOrCategories = this.filterTaxonomyTypes(
            testType.nextTestTypesOrCategories,
            typeOfTest
          );
        }
        return testType;
      });
  }

  /**
   * returns null if the test-type was not found
   * @param id
   * @param testTypes
   */
  public findTestType({ id, testTypes }: { id: string; testTypes: any }) {
    for (const testType of testTypes) {
      // for (let i = 0; i < testTypes.length; i++) {
      //   const testType: any = testTypes[i];
      if (testType.hasOwnProperty("nextTestTypesOrCategories")) {
        const childrenTestType: any = this.findTestType({
          id,
          testTypes: testType.nextTestTypesOrCategories,
        });

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
      if (testType.hasOwnProperty("nextTestTypesOrCategories")) {
        Object.assign(testTypeArray, {
          nextTestTypesOrCategories: this.sort(
            testType.nextTestTypesOrCategories
          ),
        });
      }
    }

    return testTypeArray.sort(
      (a: { sortId: string }, b: { sortId: string }) =>
        parseInt(a.sortId, 10) - parseInt(b.sortId, 10)
    );
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

  public insertTestTypesList(testTypesItems: ITestType[]) {
    return this.testTypesDAO
      .createMultiple(testTypesItems)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems;
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error);
          throwInternalServerError();
        }
      });
  }

  public deleteTestTypesList(testTypesItemKeys: any) {
    return this.testTypesDAO
      .deleteMultiple(testTypesItemKeys)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems;
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error);
          throwInternalServerError();
        }
      });
  }

  public fieldInFilterExpressionMatchesTheOneInTestCode(
    testCode: TestCode,
    filterExpression: any,
    field: string
  ) {
    const filterOnField = (filterVal: string) => {
      const filterField = testCode[filterVal as keyof TestCode];
      if (Array.isArray(filterField)) {
        return filterField.some(
          (arrayElement: any) =>
            arrayElement ===
            filterExpression[getFilterFieldWithoutFor(filterVal)]
        );
      } else {
        return (
          filterField === filterExpression[getFilterFieldWithoutFor(filterVal)]
        );
      }
    };

    const getFilterFieldWithoutFor = (filterVal: any) => {
      const rightLetters = filterVal.slice(3); // cut off the leading "for", but still got a capital letter leading
      return rightLetters[0].toLowerCase() + rightLetters.slice(1); // switch first letter to lower case, and rejoin with rest of string
    };

    switch (field) {
      case "forVehicleType":
      case "forVehicleSize":
      case "forVehicleConfiguration":
      case "forVehicleAxles":
      case "forEuVehicleCategory":
      case "forVehicleClass":
      case "forVehicleSubclass":
      case "forVehicleWheels":
        return filterOnField(field);
      default:
        console.error("Field you filtered by does not exist");
        throwInternalServerError();
    }
  }
}

const throwResourceNotFound = () => {
  throw new HTTPError(404, HTTPRESPONSE.RESOURCE_NOT_FOUND);
};

const throwInternalServerError = () => {
  throw new HTTPError(500, ERRORS.InternalServerError);
};
