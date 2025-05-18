// filepath: /opt/live/salwa-skripsi/src/utils/response.js
const successResponse = (res, message, data = null) => {
  return res.json({
    status: 'berhasil',
    messages: message,
    data: data,
  })
}

const errorResponse = (res, message, error = null, statusCode = 500) => {
  return res.status(statusCode).json({
    status: 'gagal',
    messages: message,
    error: error,
  })
}

module.exports = {
  successResponse,
  errorResponse,
}
