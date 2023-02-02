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
  SmallTrl = "small trailer",
  Motorcycle = "motorcycle",
}

export enum ForEuVehicleCategory {
  N2 = "n2",
  N3 = "n3",
  O1 = "o1",
  O2 = "o2",
  O3 = "o3",
  O4 = "o4",
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
}

export enum TestTypeClassification {
  AnnualNOCERTIFICATE = "Annual NO CERTIFICATE",
  AnnualWithCertificate = "Annual With Certificate",
  NonAnnual = "NON ANNUAL",
}
