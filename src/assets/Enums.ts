export enum ERRORS {
    NotifyConfigNotDefined = "The Notify config is not defined in the config file.",
    DynamoDBConfigNotDefined = "DynamoDB config is not defined in the config file.",
    LambdaInvokeConfigNotDefined = "Lambda Invoke config is not defined in the config file.",
    EventIsEmpty = "Event is empty",
    NoBranch = "Please define BRANCH environment variable"
}

export enum HTTPRESPONSE {
    AWS_EVENT_EMPTY = "AWS event is empty. Check your test event.",
    NOT_VALID_JSON = "Body is not a valid JSON.",
}

export enum HTTPMethods {
    GET = "GET",
      POST = "POST",
      PUT = "PUT",
      DELETE = "DELETE"
}
