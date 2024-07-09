import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { BASE_URL } from "../../utils/url";
import axios from "axios";

//* GET TOKEN FROM LOCAL STORAGE
const token = getUserFromStorage();

//* =====>  Login function ---
// You would need to pass user data to login (ex. email, password)
export const loginAPI = async ({ email, password }) => {
  //! 1. send the request using axios with payload -> get back and save the response
  const response = await axios.post(`${BASE_URL}/users/login`, {
    email,
    password,
  });
  //! 2. return the promise
  return response.data;

  // ! react query will take care of error handling !
};

//? ****************************************************************************

//* =====>  Register function ---
// You would need to pass user data to register (ex. email, password)
export const registerAPI = async ({ email, password, username }) => {
  //! 1. send the request using axios with payload -> get back and save the response
  const response = await axios.post(`${BASE_URL}/users/register`, {
    email,
    password,
    username,
  });
  //! 2. return the promise
  return response.data;

  // ! react query will take care of error handling !
};

//? ****************************************************************************

//* =====>  Change Password function ---
// You would need to pass user data to change pswd (ex. password)
export const changePasswordAPI = async ({ password }) => {
  //! 1. send the request using axios with payload -> get back and save the response
  const response = await axios.put(
    `${BASE_URL}/users/change-password`,
    {
      password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  //! 2. return the promise
  return response.data;

  // ! react query will take care of error handling !
};

//? ****************************************************************************

//* =====>  Update Profile function ---
// You would need to pass user data to updt profile (ex. email, username)
export const updateProfileAPI = async ({ email, username }) => {
  //! 1. send the request using axios with payload -> get back and save the response
  const response = await axios.put(
    `${BASE_URL}/users/update-profile`,
    {
      email,
      username,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  //! 2. return the promise
  return response.data;

  // ! react query will take care of error handling !
};
