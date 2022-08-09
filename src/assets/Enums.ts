export enum ERRORS {
  NotifyConfigNotDefined = "The Notify config is not defined in the config file.",
  DynamoDBConfigNotDefined = "DynamoDB config is not defined in the config file.",
  LambdaInvokeConfigNotDefined = "Lambda Invoke config is not defined in the config file.",
  EventIsEmpty = "Event is empty",
  NoBranch = "Please define BRANCH environment variable",
  InternalServerError = "Internal Server Error",
}

export enum HTTPRESPONSE {
  AWS_EVENT_EMPTY = "AWS event is empty. Check your test event.",
  NOT_VALID_JSON = "Body is not a valid JSON.",
  RESOURCE_NOT_FOUND = "No resources match the search criteria.",
}

export enum HTTPMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum NUM_PARAMETERS {
  VEHICLE_AXLES = "vehicleAxles",
  VEHICLE_WHEELS = "vehicleWheels",
}
