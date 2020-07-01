import { HTTPError } from "../models/HTTPError";
import TestTypesDAO from "../models/TestTypesDAO";
import { ITestType, TestCode } from "../models/ITestType";
import { ERRORS, HTTPRESPONSE, APPLICABLE_TO } from "../assets/Enums";
import { cloneDeep } from "lodash";

export class TestTypesService {
  public readonly testTypesDAO: TestTypesDAO;

  constructor(testTypesDAO: TestTypesDAO) {
    this.testTypesDAO = testTypesDAO;
  }

  public getTestTypesList(applicableTo: APPLICABLE_TO = APPLICABLE_TO.VTA) {
    return this.testTypesDAO
      .getAll()
      .then((data) => {
        if (data.Count === 0) {
          throwResourceNotFound();
        }
        return data.Items as ITestType[];
      })
      .then((testTypes: ITestType[]) => {
        let filteredTestType: ITestType[] = [];
        if (applicableTo !== APPLICABLE_TO.ALL) {
          const forVtmOnly = applicableTo === APPLICABLE_TO.VTM;
          filteredTestType = this.filterTestTypesByVtmOnly(forVtmOnly, testTypes);
        } else {
          filteredTestType = cloneDeep(testTypes);
        }
        this.purgeTestTypes(filteredTestType);

        return this.sort(filteredTestType);
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

            testCodes = testCodes.filter((testCode) => { // filter by vehicleType if present in DB, otherwise skip
                return testCode.forVehicleType ? this.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleType") : true;
            }).filter((testCode) => { // filter by vehicleSize if present in DB & in request, otherwise skip
                return (testCode.forVehicleSize && filterExpression.vehicleSize) ? this.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleSize") : true;
            }).filter((testCode) => { // filter by vehicleConfiguration if present in DB & in request, otherwise skip
                return (testCode.forVehicleConfiguration && filterExpression.vehicleConfiguration) ? this.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleConfiguration") : true;
            }).filter((testCode) => { // filter by vehicleAxles if present in DB & in request, otherwise skip
                return (testCode.forVehicleAxles && filterExpression.vehicleAxles) ? this.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleAxles") : true;
            }).filter((testCode) => {
                return (testCode.forEuVehicleCategory && filterExpression.euVehicleCategory) ? this.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forEuVehicleCategory") : true;
            }).filter((testCode) => {
                return (testCode.forVehicleClass && filterExpression.vehicleClass) ? this.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleClass") : true;
            }).filter((testCode) => {
                return (testCode.forVehicleSubclass && filterExpression.vehicleSubclass) ? this.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleSubclass") : true;
            }).filter((testCode) => {
                return (testCode.forVehicleWheels && filterExpression.vehicleWheels) ? this.fieldInFilterExpressionMatchesTheOneInTestCode(testCode, filterExpression, "forVehicleWheels") : true;
            });

            if (testCodes.length === 0) {
                    throwResourceNotFound();
                }

            if (testCodes.length > 1) {
                    console.error("More than one testType was retrieved");
                    throwInternalServerError();
                }

            const response: any = {
                    id: testType.id
                };

            filterExpression.fields // Iterate through filterExpression's fields and populate them in the response
                    .forEach((field: keyof TestCode) => {
                        response[field] = testCodes[0][field];
                    });

                // Populating testTypeClassification that is found in testType, not testCode
            if (filterExpression.fields.includes("testTypeClassification")) {
                    response.testTypeClassification = testType.testTypeClassification;
                }
            return response;
        });
    }

    /**
     * returns null if the test-type was not found
     * @param id
     * @param testTypes
     */
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
                    throwInternalServerError();
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
                    throwInternalServerError();
                }
            });
    }

    public fieldInFilterExpressionMatchesTheOneInTestCode(testCode: TestCode, filterExpression: any, field: string) {
        let bool = false;
        const filterOnField = (filterVal: string) => {
            const filterField = (testCode as any)[filterVal];
            if (Array.isArray(filterField)) {
                filterField.map((arrayElement: any) => {
                    if (arrayElement === filterExpression[getFilterFieldWithoutFor(filterVal)]) {
                        bool = true;
                    }
                });
            } else {
                bool = filterField === filterExpression[getFilterFieldWithoutFor(filterVal)];
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
                filterOnField(field);
                break;
            default:
                console.error("Field you filtered by does not exist");
                throwInternalServerError();
        }

        return bool;
    }

    private filterTestTypesByVtmOnly(forVtmOnly: boolean, testTypes: ITestType[]) {
        return testTypes.filter(function findTestTypesByVtmOnly(testType): any {
            if (testType.forVtmOnly === forVtmOnly) {
            return true;
            }
            if (testType.nextTestTypesOrCategories) {
            return (testType.nextTestTypesOrCategories = testType.nextTestTypesOrCategories.filter(findTestTypesByVtmOnly)).length;
            }
        });
    }
}

const throwResourceNotFound = () => {
    throw new HTTPError(404, HTTPRESPONSE.RESOURCE_NOT_FOUND);
};

const throwInternalServerError = () => {
    throw new HTTPError(500, ERRORS.InternalServerError);
};
