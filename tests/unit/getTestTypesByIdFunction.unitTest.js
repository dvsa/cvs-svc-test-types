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

  context('when the queryStringParameter vehicleAxles is out of range', () => {
    it('should return 400', () => {
      return LambdaTester(GetTestTypesByIdFunction.getTestTypesById)
        .event({
          queryStringParameters: {
            fields: 'testTypeClassification, defaultTestCode, linkedTestCode',
            vehicleType: 'psv',
            vehicleSize: 'small',
            vehicleConfiguration: 'rigid',
            vehicleAxles: '101'
          }
        })
        .expectResolve((result) => {
          expect(result.statusCode).to.equal(400)
          expect(result.body).to.equal('"Query parameter \\"vehicleAxles\\" must be less than or equal to 99"')
        })
    })
  })

  context('when the queryStringParameter vehicleAxles is out of range from below', () => {
    it('should return 400', () => {
      return LambdaTester(GetTestTypesByIdFunction.getTestTypesById)
        .event({
          queryStringParameters: {
            fields: 'testTypeClassification, defaultTestCode, linkedTestCode',
            vehicleType: 'psv',
            vehicleSize: 'small',
            vehicleConfiguration: 'rigid',
            vehicleAxles: '-1'
          }
        })
        .expectResolve((result) => {
          expect(result.statusCode).to.equal(400)
          expect(result.body).to.equal('"Query parameter \\"vehicleAxles\\" must be larger than or equal to 0"')
        })
    })
  })

  context('when the queryStringParameter vehicleAxles is in range', () => {
    it('should return 200', () => {
      const expectedResult =
          { 'id': '30',
            'testTypeClassification': 'NON ANNUAL',
            'defaultTestCode': 'qal',
            'linkedTestCode': null
          }
      return LambdaTester(GetTestTypesByIdFunction.getTestTypesById)
        .event({
          queryStringParameters: {
            fields: 'testTypeClassification, defaultTestCode, linkedTestCode',
            vehicleType: 'psv',
            vehicleSize: 'large',
            vehicleConfiguration: 'rigid',
            vehicleAxles: 2
          },
          pathParameters: {
            id: '30'
          }
        })
        .expectResolve((result) => {
          expect(result.statusCode).to.equal(200)
          expect(JSON.parse(result.body)).to.eql(expectedResult)
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
