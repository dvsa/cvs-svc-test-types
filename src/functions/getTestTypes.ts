import TestTypesDAO from "../models/TestTypesDAO";
import { TestTypesService } from "../services/TestTypesService";
import { HTTPResponse } from "../models/HTTPResponse";
import { Handler } from "aws-lambda";
import Joi, { required } from "joi";
import { parseAndCastQueryParams } from "../utils/parseMissingQueryParams";

export const getTestTypes: Handler = async (event) => {
  const testTypesDAO = new TestTypesDAO();
  const testTypesService = new TestTypesService(testTypesDAO);

  // GET /test-types
  if (
    !event.queryStringParameters ||
    !Object.keys(event.queryStringParameters).length
  ) {
    return testTypesService
      .getTestTypesList()
      .then((data) => {
        return new HTTPResponse(200, data);
      })
      .catch((error) => {
        return new HTTPResponse(error.statusCode, error.body);
      });
  }

  const queryParamsSchema = Joi.object().keys({
    typeOfTest: Joi.string().max(20),
  });

  const queryParams = parseAndCastQueryParams(event.queryStringParameters);

  const validation = Joi.validate(queryParams, queryParamsSchema);
  if (validation.error) {
    return Promise.resolve(
      new HTTPResponse(
        400,
        `Query parameter ${validation.error.details[0].message}`
      )
    );
  }

  return testTypesService
    .getTestTypesList(queryParams.typeOfTest)
    .then((data) => {
      return new HTTPResponse(200, data);
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
