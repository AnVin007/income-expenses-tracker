const jwt = require("jsonwebtoken");

//* Create Function
const generateToken = (id) => {
  //! sign() will encode the payload (ex: id of the user) using secret key
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

module.exports = generateToken;
