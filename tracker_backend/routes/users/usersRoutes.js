const express = require("express");
const {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  deleteUserCtrl,
  updateUserCtrl,
  changeUserPasswordCtrl,
} = require("../../controllers/users/usersController");
const isAuth = require("../../middlewares/isAuth");

//* Create Router from express package
const userRoutes = express.Router();

//(POST) Register: /api/v1/users/register
userRoutes.post("/register", registerCtrl);

//(POST) Login: /api/v1/users/login
userRoutes.post("/login", loginCtrl);

//(GET) Detailes about user's profile: /api/v1/users/profile
userRoutes.get("/profile", isAuth, profileCtrl);

//(DELETE) Delete user: /api/v1/users
userRoutes.delete("/", isAuth, deleteUserCtrl);

//(PUT) Change password: /api/v1/users/change-password
userRoutes.put("/change-password", isAuth, changeUserPasswordCtrl);

//(PUT) Update user: /api/v1/users/update-profile
userRoutes.put("/update-profile", isAuth, updateUserCtrl);

//* Export module
module.exports = userRoutes;
