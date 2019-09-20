import {TestTypesDAO} from "../models/TestTypesDAO";
import {TestTypesService} from "../services/TestTypesService";
import { HTTPResponse } from "../models/HTTPResponse";
import Joi from "joi";
import { Handler } from "aws-lambda";

export const getTestTypesById: Handler = (event, context, callback) => {
  const testTypesDAO = new TestTypesDAO();
  const testTypesService = new TestTypesService(testTypesDAO);

  // Validate query parameters
  const queryParamSchema = Joi.object().keys({
    fields: Joi.string().regex(/^(testTypeClassification|defaultTestCode|linkedTestCode),?\s*((testTypeClassification|defaultTestCode|linkedTestCode),?\s*)?((testTypeClassification|defaultTestCode|linkedTestCode),?\s*)?$/).required(),
    vehicleType: Joi.any().only([ "psv", "hgv", "trl" ]).required(),
    vehicleSize: Joi.any().only([ "small", "large" ]),
    vehicleConfiguration: Joi.any().only([ "rigid", "articulated" ]).required(),
    vehicleAxles: Joi.number().min(0).max(99).allow(null).optional()
  });

  const queryParams = Object.assign({}, event.queryStringParameters);
  if (queryParams.vehicleAxles) {
    if (queryParams.vehicleAxles === "null") {
      queryParams.vehicleAxles = null;
    } else {
      queryParams.vehicleAxles = parseInt(queryParams.vehicleAxles, 10);
    }
  }
  const validation = Joi.validate(queryParams, queryParamSchema);

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