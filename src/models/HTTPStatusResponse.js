/**
 * Defines a class used for signaling a successful HTTP status code.
 */
class HTTPStatusResponse {
  /**
   * Constructor for the HTTPStatusResponse class
   * @param statusCode the HTTP status code
   * @param body the response body
   * @param headers the response headers
   */
  constructor (statusCode, body, headers) {
    this.statusCode = statusCode
    this.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
    this.body = body

    if (headers) Object.assign(this.headers, headers)
  }
}

module.exports = HTTPStatusResponse
