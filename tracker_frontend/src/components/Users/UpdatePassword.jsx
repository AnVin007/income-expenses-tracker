import React, { useEffect, useState } from "react";
import { AiOutlineLock } from "react-icons/ai";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { changePasswordAPI } from "../../services/users/userService";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { logoutAction } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../Alert/AlertMessage";

//* FORM VALIDATIONS (using Yup library)
const validationSchema = Yup.object({
  password: Yup.string()
    .min(5, "Password must be at least 5 characters long")
    .required("Email is required"),
});

const UpdatePassword = () => {
  //* ==========> CREATE NAVIGATION INSTANCE
  const navigate = useNavigate();

  //* ==========> CREATE INSTANSE OF DISPATCH
  const dispatch = useDispatch();

  //* ==========> CONFIGURE MUTATION (React Query)
  // Destructure useMutation to use some specific components:
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: changePasswordAPI,
    mutationKey: ["change-password"],
  });

  //* ==========> CONFIGURE FORMIK INSTANCE
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    // Validations
    validationSchema,
    //Submit
    onSubmit: (values) => {
      //pass input values to mutateAsync function
      mutateAsync(values)
        .then((data) => {
          // After updating the password we want to Logout
          console.log(values);
          //! dispatch logoutAction from Redux
          dispatch(logoutAction());
          //! remove "userInfo" from localStorage
          localStorage.removeItem("userInfo");
        })
        .catch((err) => console.log(err));

      //mutateAsync will use mutationFn defined above (changePasswordAPI in our case) and then resolve promise from loginAPI
    },
  });

  //* ==========> REDIRECT TO PROFILE PAGE
  useEffect(() => {
    setTimeout(() => {
      if (isSuccess) {
        navigate("/login");
      }
    }, 1000);
  }, [isPending, isError, error, isSuccess]);

  //* ==========> RETURN HTML COMPONENT
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-semibold mb-4">Change Your Password</h2>

      {/* Display messages: based on the type and message */}
      {isPending && <AlertMessage type="loading" message="Updating..." />}
      {isSuccess && (
        <AlertMessage type="success" message="Updated successfully" />
      )}
      {isError && (
        <AlertMessage type="error" message={error.response.data.message} />
      )}

      <form onSubmit={formik.handleSubmit} className="w-full max-w-xs">
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-2"
            htmlFor="new-password"
          >
            New Password
          </label>
          <div className="flex items-center border-2 py-2 px-3 rounded">
            <AiOutlineLock className="text-gray-400 mr-2" />
            <input
              id="new-password"
              type="password"
              name="newPassword"
              {...formik.getFieldProps("password")}
              className="outline-none flex-1"
              placeholder="Enter new password"
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <span className="text-xs text-red-500">
              {formik.errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
