//* req.headers has authorization property that looks like: "Bearer token"

//* Function to Get the token from Request Header
const getTokenFromHeader = (req) => {
  //! 1. get headers object from request
  const headerObj = req.headers;

  //! 2. extract token --> split auth property by space separator and take index 1 (it is token itself)
  const token = headerObj.authorization.split(" ")[1];

  //! 3. check if token exist
  if (token !== undefined) {
    return token;
  } else {
    return {
      status: "failed",
      message: "There is no token attached to the Headers",
    };
  }
};

module.exports = getTokenFromHeader;
