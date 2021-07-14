import TestTypesDAO from "../../src/models/TestTypesDAO";
import testTypes from "../resources/test-types.json";
import { TestTypesService } from "../../src/services/TestTypesService";
import * as _ from "lodash";

export const populateDatabase = async () => {
  const mockBuffer = _.cloneDeep(testTypes);
  const testTypesDAO = new TestTypesDAO();
  const batches = [];
  while (mockBuffer.length > 0) {
    batches.push(mockBuffer.splice(0, 25));
  }

  for (const batch of batches) {
    // @ts-ignore
    await testTypesDAO.createMultiple(batch);
  }
};

export const emptyDatabase = async () => {
  const testTypesDAO = new TestTypesDAO();
  const testTypesService = new TestTypesService(testTypesDAO);
  const mockDataKeys = _.cloneDeep(testTypes).map(
    (testType: { id: any; name: any }) => [testType.id, testType.name]
  );
  const batches = [];
  while (mockDataKeys.length > 0) {
    batches.push(mockDataKeys.splice(0, 25));
  }

  for (const batch of batches) {
    await testTypesService.deleteTestTypesList(batch);
  }
};

/*
        const mockDataKeys = mockData.map((testType: { id: any; name: any; }) => [testType.id, testType.name]);
        testTypesService.deleteTestTypesList(mockDataKeys);
*/
