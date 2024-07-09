import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { BASE_URL } from "../../utils/url";
import axios from "axios";

//* GET TOKEN FROM LOCAL STORAGE
const token = getUserFromStorage();

//* =====>  Add transaction ---
export const addTransactionAPI = async ({
  type,
  amount,
  category,
  date,
  description,
}) => {
  //! 1. send the request using axios with TOKEN and payload -> get back and save the response
  const response = await axios.post(
    `${BASE_URL}/transactions/create`,
    {
      type,
      amount,
      category,
      date,
      description,
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

//* =====>  List transaction ---
export const listTransactionAPI = async ({
  category,
  type,
  startDate,
  endDate,
}) => {
  //! 1. send the request using axios -> get back and save the response
  const response = await axios.get(`${BASE_URL}/transactions/filter`, {
    params: { category, type, startDate, endDate },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //! 2. return the promise
  return response.data.data; //--> real

  // ! react query will take care of error handling !
};
