import TestTypesDAO from "../models/TestTypesDAO";
import { TestTypesService } from "../services/TestTypesService";
import { HTTPResponse } from "../models/HTTPResponse";
import Joi from "joi";
import { Handler } from "aws-lambda";
import { parseAndCastQueryParams } from "../utils/parseMissingQueryParams";
import {
  ForVehicleConfiguration,
  ForVehicleSize,
  ForVehicleType,
  GetTestTypeByIdQueryParams,
} from "../models/ITestType";
import { HTTPRESPONSE, NUM_PARAMETERS } from "../assets/Enums";
import { Validator } from "../utils/Validator";

export const getTestTypesById: Handler = (event, context, callback) => {
  const testTypesDAO = new TestTypesDAO();
  const testTypesService = new TestTypesService(testTypesDAO);
  const check: Validator = new Validator();

  if (event.pathParameters) {
    if (!check.parametersAreValid(event.pathParameters)) {
      return Promise.resolve(
        new HTTPResponse(400, HTTPRESPONSE.MISSING_PARAMETERS)
      );
    }
  } else {
    return Promise.resolve(
      new HTTPResponse(400, HTTPRESPONSE.MISSING_PARAMETERS)
    );
  }
  // Validate query parameters
  const queryParamSchema = Joi.object()
    .keys({
      fields: Joi.string()
        .regex(
          /^((testTypeClassification|defaultTestCode|linkedTestCode|name|testTypeName),?\s*){0,5}$/
        )
        .required(),
      vehicleType: Joi.string().valid(...Object.values(ForVehicleType)).required(),
      vehicleSize: Joi.string().valid(...Object.values(ForVehicleSize)),
      vehicleConfiguration: Joi.string()
        .valid(...Object.values(ForVehicleConfiguration))
        .allow(null),
      euVehicleCategory: Joi.string().allow(null),
      vehicleClass: Joi.string().allow(null),
      vehicleSubclass: Joi.string().allow(null),
      vehicleWheels: Joi.number().min(0).max(99).allow(null),
      vehicleAxles: Joi.number().min(0).max(99).allow(null),
    })
    .strict();

  const queryParams = parseAndCastQueryParams(
    event.queryStringParameters,
    Object.values(NUM_PARAMETERS)
  );

  const validation = queryParamSchema.validate(queryParams);

  if (validation.error) {
    return Promise.resolve(
      new HTTPResponse(
        400,
        `Query parameter ${validation.error.details[0].message}`
      )
    );
  }

  // Splitting fields and subclass into an array and cleaning up unwanted whitespace
  Object.assign(queryParams, {
    fields: queryParams.fields.replace(/\s/g, "").split(","),
    vehicleSubclass: queryParams.vehicleSubclass?.replace(/\s/g, "").split(","),
  });

  return testTypesService
    .getTestTypesById(
      event.pathParameters.id,
      queryParams as GetTestTypeByIdQueryParams
    )
    .then((data) => {
      return new HTTPResponse(200, data);
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
