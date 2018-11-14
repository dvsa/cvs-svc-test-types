const assert = require('assert')
const testTypesService = require('../../services/testTypesService')

describe('testTypesService', () => {
  it('should fetch all test types from the database', () => {
    return testTypesService()
      .then(() => {
        assert.ok(true, 'Test types retrieved successfully.')
      })
      .catch((error) => {
        assert.fail(error)
      })
  })
})
