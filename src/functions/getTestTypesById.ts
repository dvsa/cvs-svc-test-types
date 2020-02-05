import TestTypesDAO from "../models/TestTypesDAO";
import {TestTypesService} from "../services/TestTypesService";
import { HTTPResponse } from "../models/HTTPResponse";
import Joi from "joi";
import { Handler } from "aws-lambda";
import {parseMissingQueryParams} from "../utils/parseMissingQueryParams";
import {ForEuVehicleCategory, ForVehicleConfiguration, ForVehicleSize, ForVehicleSubclass, ForVehicleType} from "../models/ITestType";

export const getTestTypesById: Handler = (event, context, callback) => {
  const testTypesDAO = new TestTypesDAO();
  const testTypesService = new TestTypesService(testTypesDAO);

  // Validate query parameters
  const queryParamSchema = Joi.object().keys({
    fields: Joi.string().regex(/^(testTypeClassification|defaultTestCode|linkedTestCode),?\s*((testTypeClassification|defaultTestCode|linkedTestCode),?\s*)?((testTypeClassification|defaultTestCode|linkedTestCode),?\s*)?$/).required(),
    vehicleType: Joi.string().only(Object.values(ForVehicleType)).required(),
    vehicleSize: Joi.string().only(Object.values(ForVehicleSize)),
    vehicleConfiguration: Joi.string().only(Object.values(ForVehicleConfiguration)).allow(null),
    euVehicleCategory: Joi.string().only(Object.values(ForEuVehicleCategory)).allow(null),
    vehicleClass: Joi.string().allow(null),
    vehicleSubclass: Joi.string().only(Object.values(ForVehicleSubclass)).allow(null),
    vehicleWheels: Joi.number().min(0).max(99).allow(null),
    vehicleAxles: Joi.number().min(0).max(99).allow(null)
  });

  const queryParams = parseMissingQueryParams(event.queryStringParameters);

  const validation = Joi.validate(queryParams, queryParamSchema, { convert: false }); // strict validation

  if (validation.error) {
    return Promise.resolve(new HTTPResponse(400, `Query parameter ${validation.error.details[0].message}`));
  }

  // Splitting fields into an array and cleaning up unwanted whitespace
  Object.assign(queryParams, { fields: queryParams.fields.replace(/\s/g, "").split(",") });

  return testTypesService.getTestTypesById(event.pathParameters.id, queryParams)
    .then((data) => {
      return new HTTPResponse(200, data);
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
