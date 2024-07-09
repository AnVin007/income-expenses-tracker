const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const appErr = require("../../utils/appErr");
const generateToken = require("../../utils/generateToken");

//*===========================================================
//* ------> Register Controler
const registerCtrl = async (req, res, next) => {
  // destructure the body field
  const { username, email, password } = req.body;

  // Check if all required parameters exists
  //! throw an Error with message if needed
  if (!username || !email || !password) {
    return next(appErr("All required fields could not be empty"));
  }

  try {
    // Check if user exist by email
    //! 1. find the user in DB by provided email
    const userFound = await User.findOne({ email });
    //! 2. throw an Error if you found the user with provided email
    if (userFound) {
      // use next to pass message to error middleware and statusCode(optional)
      return next(appErr("User already exist", 400));
    }
    // Proceed if user with provided email was not created before
    //! 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    //! 4. Register user
    const user = await User.create({
      username,
      email,
      password: passwordHashed,
    });

    // Send the response
    res.json({
      status: "success",
      username: user.username,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Login Controler
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if all required parameters exists
  //! throw an Error with message if needed
  if (!email || !password) {
    return next(appErr("All required fields could not be empty"));
  }

  try {
    // Check if user exist by email
    //! 1. find the user in DB by provided email
    const userFound = await User.findOne({ email });
    //! 2. throw an Error if you could not find the user
    if (!userFound) {
      return next(appErr("Invalid User credentials", 400));
    }
    //! 3. verify password
    // compare password sent by user with the one stored in DB
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    //! 4. throw an Error if password not valid
    if (!isPasswordValid) {
      return next(appErr("Invalid User credentials", 400));
    }
    //! 5. generate JWT Token and send it back to the user in response
    const token = generateToken(userFound._id);

    // Send the response
    res.json({
      status: "success",
      fullname: userFound.fullname,
      id: userFound._id,
      token,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Profile Details Controler
const profileCtrl = async (req, res, next) => {
  //* After checking "isAuth" middleware --> req.user will contain Id of logged in user
  try {
    //! Find user by Id
    const user = await User.findById(req.user);

    //! Throw an Error if could not find one
    if (!user) {
      return next(appErr("User not Found"));
    }

    // Send response
    res.json({
      status: "successful",
      data: user,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Delete User Controler
const deleteUserCtrl = async (req, res, next) => {
  try {
    //* After checking "isAuth" middleware --> req.user will contain Id of logged in user
    await User.findByIdAndDelete(req.user);

    // send the response
    res.status(200).json({
      status: "successful",
      data: null,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Change User Password Controler
const changeUserPasswordCtrl = async (req, res, next) => {
  //* After checking "isAuth" middleware --> req.user will contain Id of logged in user
  //distructure req.body
  const { password } = req.body;
  try {
    //* PASSWORD UPDATE
    if (password) {
      //! 1. re-hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //! 2. update the user data with new password
      const user = await User.findByIdAndUpdate(
        req.user,
        {
          password: hashedPassword,
        },
        {
          new: true,
        }
      );

      //! 3. send the response
      return res.status(200).json({
        status: "successful",
        data: user,
      });
    }
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//*===========================================================
//* ------> Update User Controler
const updateUserCtrl = async (req, res, next) => {
  //* After checking "isAuth" middleware --> req.user will contain Id of logged in user
  //distructure req.body
  const { username, email } = req.body;
  try {
    if (email) {
      //! 1. check if email exist
      const userFound = await User.findOne({ email });
      //! 2. throw an Error if you found the user with provided email
      if (userFound) return next(appErr("Email is taken", 400));
    }

    //use entire req.body for updating all fields: fullname and email
    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
    });

    //send the response
    res.status(200).json({
      status: "successful",
      data: user,
    });
  } catch (err) {
    res.json(next(appErr(err.message)));
  }
};

//* Export Modules
module.exports = {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  deleteUserCtrl,
  changeUserPasswordCtrl,
  updateUserCtrl,
};
