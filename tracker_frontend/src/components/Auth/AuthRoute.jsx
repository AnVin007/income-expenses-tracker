import React from "react";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  //* ==========> GET TOKEN FROM LOCAL STORAGE
  const token = getUserFromStorage();

  //Check if user loged in
  if (token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AuthRoute;
