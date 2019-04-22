const expect = require('chai').expect
const LambdaTester = require('lambda-tester')
const GetTestTypesByIdFunction = require('../../src/functions/getTestTypesById')

describe('getTestTypesById', () => {
  context('when the queryStringParameters are invalid', () => {
    it('should return 400', () => {
      return LambdaTester(GetTestTypesByIdFunction.getTestTypesById)
        .event({
          queryStringParameters: {
            fields: 'testTypeClassification, defaultTestCode, linkedTestCode',
            vehicleType: 'psv',
            vehicleSize: 'smalll',
            vehicleConfiguration: 'rigid',
            vehicleAxles: '2'
          }
        })
        .expectResolve((result) => {
          expect(result.statusCode).to.equal(400)
          expect(result.body).to.equal('"Query parameter \\"vehicleSize\\" must be one of [small, large]"')
        })
    })
  })

  context('when the request is valid', () => {
    context('and the parameters match a test type in the database', () => {
      it('should return 200', () => {
        return LambdaTester(GetTestTypesByIdFunction.getTestTypesById)
          .event({
            queryStringParameters: {
              fields: 'testTypeClassification',
              vehicleType: 'psv',
              vehicleSize: 'small',
              vehicleConfiguration: 'rigid'
            },
            pathParameters: {
              id: '1'
            }
          })
          .expectResolve((result) => {
            expect(result.statusCode).to.equal(200)
            expect(JSON.parse(result.body).id).to.equal('1')
            expect(JSON.parse(result.body).testTypeClassification).to.equal('Annual With Certificate')
          })
      })
    })

    context('and the parameters match a test category in the database', () => {
      it('should return 404', () => {
        return LambdaTester(GetTestTypesByIdFunction.getTestTypesById)
          .event({
            queryStringParameters: {
              fields: 'testTypeClassification',
              vehicleType: 'psv',
              vehicleSize: 'small',
              vehicleConfiguration: 'rigid'
            },
            pathParameters: {
              id: '2'
            }
          })
          .expectResolve((result) => {
            expect(result.statusCode).to.equal(404)
            expect(result.body).to.equal('"No resources match the search criteria."')
          })
      })
    })
  })
})