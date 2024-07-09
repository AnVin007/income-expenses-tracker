//* Error Should cover:
// 1) status - failed/server error/...
// 2) message - actual description of an error
// 3) stack - in which file/line a particular error occured

//* Global Error Handler will watch anywhere in a code, where we are returning/catching any error and will send back the response
//* Global Error Handler will look up for 'appErr.js'
const globalErrHandler = (err, req, res, next) => {
  const message = err.message;
  const status = err.status ? err.status : "failed"; //! error status or default value
  const stack = err.stack;
  const statusCode = err.statusCode ? err.statusCode : 500; //! status code or default value 500 (server error)

  // send response
  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

//* Export module
module.exports = globalErrHandler;
