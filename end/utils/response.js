// utils/response.js
function sendResponse(res, data = null, message, code = 0) {
  res.json({
    code,
    message,
    data
  })
}

module.exports = sendResponse;
