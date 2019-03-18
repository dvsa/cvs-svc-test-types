const LambdaTester = require('lambda-tester')
const GetTestTypesFunction = require('../../src/functions/getTestTypes')

describe('getTestTypes', () => {
  it('should return a promise', () => {
    return LambdaTester(GetTestTypesFunction.getTestTypes)
      .expectResolve()
  })
})
