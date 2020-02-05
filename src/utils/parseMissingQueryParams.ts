/**
 * AWS lambda returns event.queryStringParameters containing only string values.
 * If you pass null, undefined or 47 in event.queryStringParameters
 * they will be received as "null", "undefined" and "47"
 *
 * This method is required to cast all the parameters to the correct type
 * @param queryStringParameters
 */
export const parseMissingQueryParams = (queryStringParameters: any) => {
    const queryParams = Object.assign({}, queryStringParameters);
    const numericParameters = ["vehicleAxles", "vehicleWheels"];

    Object.keys(queryParams).forEach((parameterName: string) => {
        if (queryParams[parameterName] === "null" || queryParams[parameterName] === "undefined") {
            queryParams[parameterName] = null;
        }
        if (numericParameters.includes(parameterName)) {
            queryParams[parameterName] = castToNumber(queryParams[parameterName]);
        }
    });

    return queryParams;
};

function castToNumber(parameter: string): number {
    if (parameter === null) { return parameter; } else { return parseInt(parameter, 10); }
}
