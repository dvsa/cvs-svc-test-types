export interface ITestType {
    id: string;
    linkedIds: string[] | null;
    name: string;
    testTypeName?: string;
    forVehicleType: ForVehicleType[];
    forVehicleSize: ForVehicleSize[] | null;
    forVehicleConfiguration: ForVehicleConfiguration[] | null;
    forVehicleAxles: number[] | null;
    testTypeClassification?: TestTypeClassification;
    testCodes?: TestCode[];
    nextTestTypesOrCategories?: NextTestTypesOrCategory[];
}

export enum ForVehicleConfiguration {
    Articulated = "articulated",
    Rigid = "rigid",
}

export enum ForVehicleSize {
    Large = "large",
    Small = "small",
}

export enum ForVehicleType {
    Hgv = "hgv",
    Psv = "psv",
    Trl = "trl",
}

export interface NextTestTypesOrCategory {
    id: string;
    linkedIds: string[] | null;
    name: string;
    testTypeName?: string;
    forVehicleType: ForVehicleType | ForVehicleType[];
    forVehicleSize: ForVehicleSize[] | null;
    forVehicleConfiguration: ForVehicleConfiguration[] | null;
    forVehicleAxles: number[] | null;
    testTypeClassification?: TestTypeClassification;
    testCodes?: TestCode[];
    nextTestTypesOrCategories?: NextTestTypesOrCategory[];
}

export interface TestCode {
    forVehicleType: ForVehicleType;
    forVehicleSize: ForVehicleSize | null;
    forVehicleConfiguration: ForVehicleConfiguration | null;
    forVehicleAxles: number[] | number | null;
    defaultTestCode: string;
    linkedTestCode: null | string;
}

export enum TestTypeClassification {
    AnnualNOCERTIFICATE = "Annual NO CERTIFICATE",
    AnnualWithCertificate = "Annual With Certificate",
    NonAnnual = "NON ANNUAL",
}
