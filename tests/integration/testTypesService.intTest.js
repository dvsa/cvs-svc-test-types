const supertest = require('supertest')
const expect = require('expect')

const url = `http://localhost:${process.env.SERVERLESS_PORT}/`
const request = supertest(url)

describe('test types', () => {
  context('GET', () => {
    context('All test types', () => {
      it('should return all test types', (done) => {
        request
          .get('test-types')
          .set('Context-Type', 'application/json')
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .end((err, res) => {
            if (err) throw err
            expect(res.body.length).toBeGreaterThan(0)
            done()
          })
      })
    })
  })
})
