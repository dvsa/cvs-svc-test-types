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
  const queryParams = parseAndCastQueryParams(event.queryStringParameters);

  return testTypesService
    .getTestTypesList(queryParams.typeOfTest)
    .then((data) => {
      return new HTTPResponse(200, data);
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
