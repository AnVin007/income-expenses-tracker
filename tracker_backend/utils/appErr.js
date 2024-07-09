// Using this Function we creating an ERROR object that should be handled by 'globalErrHandler.js'
// You must provide the message as a parameter. statusCode could be by default 500.
const appErr = (message, statusCode) => {
  //! we going to use Error class of JavaScript to create 'error' object and pass the message
  let error = new Error(message);
  //! we want to add extra properties to 'error' object
  error.stack = error.stack;
  error.statusCode = statusCode ? statusCode : 500;
  return error;
};

//* Export module
module.exports = appErr;
