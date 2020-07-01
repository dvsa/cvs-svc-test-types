export enum ERRORS {
    NotifyConfigNotDefined = "The Notify config is not defined in the config file.",
    DynamoDBConfigNotDefined = "DynamoDB config is not defined in the config file.",
    LambdaInvokeConfigNotDefined = "Lambda Invoke config is not defined in the config file.",
    EventIsEmpty = "Event is empty",
    NoBranch = "Please define BRANCH environment variable",
    InternalServerError = "Internal Server Error"
}

export enum HTTPRESPONSE {
    AWS_EVENT_EMPTY = "AWS event is empty. Check your test event.",
    NOT_VALID_JSON = "Body is not a valid JSON.",
    RESOURCE_NOT_FOUND = "No resources match the search criteria."
}

export enum HTTPMethods {
    GET = "GET",
      POST = "POST",
      PUT = "PUT",
      DELETE = "DELETE"
}

export enum NUM_PARAMETERS {
    VEHICLE_AXLES = "vehicleAxles",
    VEHICLE_WHEELS = "vehicleWheels",
}

export enum FOR_VEHICLE_CONFIGURATION {
    Articulated = "articulated",
    Rigid = "rigid",
    CentreAxleDrawbar = "centre axle drawbar",
    SemiCarTransporter = "semi-car transporter",
    SemiTrailer = "semi-trailer",
    LowLoader = "low loader",
    Other = "other",
    Drawbar = "drawbar",
    FourInLine = "four-in-line",
    Dolly = "dolly",
    FullDrawbar = "full drawbar"
}

export enum FOR_VEHICLE_SIZE {
    Small = "small",
    Large = "large",
}

export enum FOR_VEHICLE_TYPE {
    Hgv = "hgv",
    Psv = "psv",
    Trl = "trl",
    Car = "car",
    Lgv = "lgv",
    Motorcycle = "motorcycle"
}

export enum FOR_EU_VEHICLE_CATEGORY {
    N2 = "n2",
    N3 = "n3",
    O1 = "o1",
    O2 = "o2",
    O3 = "o3",
    O4 = "o4"
}

export enum FOR_VEHICLE_SUB_CLASS {
    A = "a",
    C = "c",
    S = "s",
    L = "l",
    M = "m",
    N = "n",
    P = "p",
    T = "t",
    R = "r"
}

export enum TEST_TYPE_CLASSIFICATION {
    AnnualNOCERTIFICATE = "Annual NO CERTIFICATE",
    AnnualWithCertificate = "Annual With Certificate",
    NonAnnual = "NON ANNUAL",
}

export enum APPLICABLE_TO {
    VTA = "vta",
    VTM = "vtm",
    ALL = "all"
}
