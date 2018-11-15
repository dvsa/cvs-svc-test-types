'use strict'

/**
 * Defines a throwable subclass of Error used for signaling an HTTP status code.
 */
class HTTPResponseStatus extends Error {
  /**
     * Constructor for the HTTPResponseStatus class
     * @param statusCode the HTTP status code
     * @param body - the response body
     * @param headers - optional - the response headers
     */
  constructor (statusCode, body, headers = {}) {
    super()
    this.statusCode = statusCode
    if (headers) this.headers = headers
    this.body = body
  }
}

module.exports = HTTPResponseStatus
