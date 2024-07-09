import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { BASE_URL } from "../../utils/url";
import axios from "axios";

//* GET TOKEN FROM LOCAL STORAGE
const token = getUserFromStorage();

//* =====>  Add category ---
export const addCategoryAPI = async ({ name, type }) => {
  //! 1. send the request using axios with TOKEN and payload -> get back and save the response
  const response = await axios.post(
    `${BASE_URL}/categories/create`,
    {
      name,
      type,
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

//* =====>  List categories ---
export const listCategoriesAPI = async () => {
  //! 1. send the request using axios -> get back and save the response
  const response = await axios.get(`${BASE_URL}/categories/lists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //! 2. return the promise
  return response.data.data; //--> real

  // ! react query will take care of error handling !
};

//* =====>  Update category ---
export const updateCategoryAPI = async ({ name, type, id }) => {
  //! 1. send the request using axios with TOKEN and payload -> get back and save the response
  const response = await axios.put(
    `${BASE_URL}/categories/update/${id}`,
    {
      name,
      type,
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

//* =====>  Delete category ---
export const deleteCategoryAPI = async (id) => {
  //! 1. send the request using axios with TOKEN and payload -> get back and save the response
  const response = await axios.delete(`${BASE_URL}/categories/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //! 2. return the promise
  return response.data;

  // ! react query will take care of error handling !
};
