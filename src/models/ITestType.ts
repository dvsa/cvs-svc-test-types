import {
  FOR_VEHICLE_TYPE,
  FOR_VEHICLE_SIZE,
  FOR_VEHICLE_CONFIGURATION,
  FOR_EU_VEHICLE_CATEGORY,
  FOR_VEHICLE_SUB_CLASS,
  TEST_TYPE_CLASSIFICATION
} from "../assets/Enums";

export interface ITestType {
  id: string;
  linkedIds: string[] | null;
  name: string;
  testTypeName?: string;
  forVehicleType: FOR_VEHICLE_TYPE[];
  forVtmOnly: boolean;
  forVehicleSize: FOR_VEHICLE_SIZE[] | null;
  forVehicleConfiguration: FOR_VEHICLE_CONFIGURATION[] | null;
  forVehicleAxles: number[] | null;
  forEuVehicleCategory: FOR_EU_VEHICLE_CATEGORY[] | null;
  forVehicleClass: string[] | null;
  forVehicleSubclass: FOR_VEHICLE_SUB_CLASS[] | null;
  forVehicleWheels: number[] | null;
  testTypeClassification?: TEST_TYPE_CLASSIFICATION;
  testCodes?: TestCode[];
  nextTestTypesOrCategories?: ITestType[];
}

// export interface NextTestTypesOrCategory {
//   id: string;
//   linkedIds: string[] | null;
//   name: string;
//   testTypeName?: string;
//   forVehicleType: FOR_VEHICLE_TYPE | FOR_VEHICLE_TYPE[];
//   forVehicleSize: FOR_VEHICLE_SIZE[] | null;
//   forVehicleConfiguration: FOR_VEHICLE_CONFIGURATION[] | null;
//   forVehicleAxles: number[] | null;
//   forEuVehicleCategory: FOR_EU_VEHICLE_CATEGORY[] | null;
//   forVehicleClass: string[] | null;
//   forVehicleSubclass: FOR_VEHICLE_SUB_CLASS[] | null;
//   forVehicleWheels: number[] | null;
//   testTypeClassification?: TEST_TYPE_CLASSIFICATION;
//   testCodes?: TestCode[];
//   nextTestTypesOrCategories?: NextTestTypesOrCategory[];
// }

export interface TestCode {
  forVehicleType: FOR_VEHICLE_TYPE | FOR_VEHICLE_TYPE[];
  forVtmOnly: boolean;
  forVehicleSize: FOR_VEHICLE_SIZE | null;
  forVehicleConfiguration: FOR_VEHICLE_CONFIGURATION | null;
  forVehicleAxles: number | number[] | null;
  forEuVehicleCategory:
    | FOR_EU_VEHICLE_CATEGORY
    | FOR_EU_VEHICLE_CATEGORY[]
    | null;
  forVehicleClass: string | string[] | null;
  forVehicleSubclass: FOR_VEHICLE_SUB_CLASS | FOR_VEHICLE_SUB_CLASS[] | null;
  forVehicleWheels: number | number[] | null;
  defaultTestCode: string;
  linkedTestCode: null | string;
}
