const appErr = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

//* When user is Loged In --> Encoded token was created with id of that User and sent back to client.
//* User from Client side should send the encoded token in the Header of the Request.
//* Then in order to protect routes we use "isLogin" Middleware.
//* Middleware need to verify token and decoding the data

const isAuth = (req, res, next) => {
  // Get token from request header
  const token = getTokenFromHeader(req);

  // Verify token
  const decodedUser = verifyToken(token);

  // If decodedUser is not exist --> token expired or not valid
  if (!decodedUser) {
    return next(appErr("Invalid / Expired Token, Please Log In again", 401));
  }

  // Save User id into req object
  req.user = decodedUser.id;

  // Move on to next middleware
  next();
};

module.exports = isAuth;
