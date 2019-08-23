import { ITestTypeCode } from "./ITestTypeCode";

export interface ITestType {
    id: string;
    linkedIds: string[];
    name: string;
    testTypeName: string;
    forVehicleType: string[];
    forVehicleSize: string[];
    forVehicleConfiguration: string[];
    forVehicleAxles: string | null;
    testTypeClassification: string;
    testCodes: ITestTypeCode[];
    nextTestTypesOrCategories?: ITestType[] | undefined;
}
