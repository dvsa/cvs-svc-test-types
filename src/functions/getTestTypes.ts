import TestTypesDAO from "../models/TestTypesDAO";
import { TestTypesService } from "../services/TestTypesService";
import { HTTPResponse } from "../models/HTTPResponse";
import { Handler } from "aws-lambda";

export const getTestTypes: Handler = async (event) => {
  const testTypesDAO = new TestTypesDAO();
  const testTypesService = new TestTypesService(testTypesDAO);

  const applicableTo = event.queryStringParameters && event.queryStringParameters.applicableTo;

  // GET /test-types
  return testTypesService
    .getTestTypesList(applicableTo)
    .then((data) => {
      return new HTTPResponse(200, data);
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
