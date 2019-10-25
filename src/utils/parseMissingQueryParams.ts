export const parseMissingQueryParams = (queryStringParameters: any) => {
    const queryParams = Object.assign({}, queryStringParameters);

    if (queryParams.vehicleAxles === "null") {
        queryParams.vehicleAxles = null;
    } else if ( queryParams.vehicleAxles !== undefined ) {
        queryParams.vehicleAxles = parseInt(queryParams.vehicleAxles, 10);
    }

    if (queryParams.vehicleSize === undefined) {
        queryParams.vehicleSize = null;
    }

    if (queryParams.vehicleConfiguration === "null") {
        queryParams.vehicleConfiguration = null;
    }
    return queryParams;
};
