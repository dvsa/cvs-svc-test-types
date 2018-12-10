/**
 * Defines a throwable subclass of Error used for signaling an HTTP status code.
 */
class HTTPErrorResponse extends Error {
  /**
   * Constructor for the HTTPResponseStatus class
   * @param statusCode the HTTP status code
   * @param body the response body
   * @param headers the response headers
   */
  constructor (statusCode, body, headers) {
    super()
    this.statusCode = statusCode
    this.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
    this.body = body

    if (headers) Object.assign(this.headers, headers)
  }
}

module.exports = HTTPErrorResponse
