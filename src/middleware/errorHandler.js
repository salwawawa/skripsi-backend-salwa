const { errorResponse } = require('../utils/response')

const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  return errorResponse(res, 'Internal Server Error', err.message)
}

module.exports = errorHandler
