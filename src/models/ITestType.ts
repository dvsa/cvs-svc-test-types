export interface ITestType {
  typeOfTest?: string;
  id: string;
  sortId: string;
  linkedIds: string[] | null;
  suggestedTestTypeIds?: string[];
  name: string;
  testTypeName?: string;
  suggestedTestTypeDisplayName?: string;
  suggestedTestTypeDisplayOrder?: string;
  forVehicleType: ForVehicleType[];
  forProvisionalStatus?: boolean;
  forVehicleSize: ForVehicleSize[] | null;
  forVehicleConfiguration: ForVehicleConfiguration[] | null;
  forVehicleAxles: number[] | null;
  forEuVehicleCategory: ForEuVehicleCategory[] | null;
  forVehicleClass: string[] | null;
  forVehicleSubclass: ForVehicleSubclass[] | null;
  forVehicleWheels: number[] | null;
  testTypeClassification?: TestTypeClassification;
  testCodes?: TestCode[];
  nextTestTypesOrCategories?: NextTestTypesOrCategory[];
}

export enum ForVehicleConfiguration {
  Articulated = "articulated",
  Rigid = "rigid",
  CentreAxleDrawbar = "centre axle drawbar",
  SemiCarTransporter = "semi-car transporter",
  SemiTrailer = "semi-trailer",
  LongSemiTrailer = "long semi-trailer",
  LowLoader = "low loader",
  Other = "other",
  Drawbar = "drawbar",
  FourInLine = "four-in-line",
  Dolly = "dolly",
  FullDrawbar = "full drawbar",
}

export enum ForVehicleSize {
  Small = "small",
  Large = "large",
}

export enum ForVehicleType {
  Hgv = "hgv",
  Psv = "psv",
  Trl = "trl",
  Lgv = "lgv",
  Car = "car",
  Motorcycle = "motorcycle",
}

export enum ForEuVehicleCategory {
  M1 = "m1",
  M2 = "m2",
  M3 = "m3",
  N1 = "n1",
  N2 = "n2",
  N3 = "n3",
  O1 = "o1",
  O2 = "o2",
  O3 = "o3",
  O4 = "o4",
  L1E_A = "l1e-a",
  L1E = "l1e",
  L2E = "l2e",
  L3E = "l3e",
  L4E = "l4e",
  L5E = "l5e",
  L6E = "l6e",
  L7E = "l7e",
}

export enum ForVehicleSubclass {
  A = "a",
  C = "c",
  S = "s",
  L = "l",
  M = "m",
  N = "n",
  P = "p",
  T = "t",
  R = "r",
}

export interface NextTestTypesOrCategory {
  typeOfTest?: string;
  id: string;
  linkedIds: string[] | null;
  name: string;
  testTypeName?: string;
  forVehicleType: ForVehicleType | ForVehicleType[];
  forProvisionalStatus?: boolean;
  forVehicleSize: ForVehicleSize[] | null;
  forVehicleConfiguration: ForVehicleConfiguration[] | null;
  forVehicleAxles: number[] | null;
  forEuVehicleCategory: ForEuVehicleCategory[] | null;
  forVehicleClass: string[] | null;
  forVehicleSubclass: ForVehicleSubclass[] | null;
  forVehicleWheels: number[] | null;
  testTypeClassification?: TestTypeClassification;
  testCodes?: TestCode[];
  nextTestTypesOrCategories?: NextTestTypesOrCategory[];
}

export interface TestCode {
  forVehicleType: ForVehicleType | ForVehicleType[];
  forVehicleSize: ForVehicleSize | null;
  forVehicleConfiguration: ForVehicleConfiguration | null;
  forVehicleAxles: number | number[] | null;
  forEuVehicleCategory: ForEuVehicleCategory | ForEuVehicleCategory[] | null;
  forVehicleClass: string | string[] | null;
  forVehicleSubclass: ForVehicleSubclass | ForVehicleSubclass[] | null;
  forVehicleWheels: number | number[] | null;
  defaultTestCode: string;
  linkedTestCode: null | string;
  forProvisionalStatus?: boolean;
}

export enum TestTypeClassification {
  AnnualNOCERTIFICATE = "Annual NO CERTIFICATE",
  AnnualWithCertificate = "Annual With Certificate",
  NonAnnual = "NON ANNUAL",
}

export interface GetTestTypeByIdQueryParams {
  fields: string | string[];
  vehicleSubclass?: string | string[] | null;
  vehicleWheels?: number | null;
  vehicleAxles?: number | null;
  euVehicleCategory?: string | null;
  vehicleType: ForVehicleType;
  vehicleSize?: ForVehicleSize;
  vehicleConfiguration?: ForVehicleConfiguration | null;
  vehicleClass?: string | null;
}
