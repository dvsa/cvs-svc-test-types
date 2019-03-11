class TestTypesDAOMock {
  constructor () {
    this.testTypesRecordsMock = null
    this.unprocessedItems = null
    this.numberOfrecords = null
    this.numberOfScannedRecords = null
    this.isDatabaseOn = true
  }

  getAll () {
    const responseObject = {
      Items: this.testTypesRecordsMock,
      Count: this.numberOfrecords,
      ScannedCount: this.numberOfScannedRecords
    }

    if (!this.isDatabaseOn) {
      return Promise.reject(responseObject)
    }

    return Promise.resolve(responseObject)
  }

  createMultiple () {
    const responseObject = { UnprocessedItems: this.unprocessedItems }

    if (!this.isDatabaseOn) return Promise.reject(responseObject)

    return Promise.resolve(responseObject)
  }

  deleteMultiple () {
    const responseObject = { UnprocessedItems: this.unprocessedItems }

    if (!this.isDatabaseOn) return Promise.reject(responseObject)

    return Promise.resolve(responseObject)
  }
}

module.exports = TestTypesDAOMock
