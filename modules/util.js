module.exports = {
  success: (status, message, data) => ({
    status,
    message,
    data,
  }),
  fail: (status, message) => ({
    status,
    message,
  }),
};