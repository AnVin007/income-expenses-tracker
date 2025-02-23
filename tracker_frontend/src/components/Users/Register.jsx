import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { registerAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";

//* FORM VALIDATIONS (using Yup library)
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirming your password is required"),
});

const RegistrationForm = () => {
  //* ==========> CREATE NAVIGATION INSTANCE
  const navigate = useNavigate();

  //* ==========> CONFIGURE MUTATION (React Query)
  // Destructure useMutation to use some specific components:
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register"],
  });

  //* ==========> CONFIGURE FORMIK INSTANCE
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    //Validation -> use schema from Yup
    validationSchema,
    //Submit form
    //! values holds values from input fields of the form
    onSubmit: (values) => {
      //pass input values to mutateAsync function
      mutateAsync(values)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log(err));

      //mutateAsync will use mutationFn defined above (registerAPI in our case) and then resolve promise from loginAPI
    },
  });

  //* ==========> REDIRECT TO LOGIN PAGE
  useEffect(() => {
    setTimeout(() => {
      if (isSuccess) {
        navigate("/login");
      }
    }, 1000);
  }, [isPending, isError, error, isSuccess]);

  //* ==========> RETURN HTML COMPONENT
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200"
    >
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Sign Up
      </h2>
      {/* Display messages */}
      {isPending && (
        <AlertMessage type="loading" message="Register you in..." />
      )}
      {isSuccess && (
        <AlertMessage type="success" message="Registered successfully" />
      )}
      {isError && (
        <AlertMessage type="error" message={error.response.data.message} />
      )}
      <p className="text-sm text-center text-gray-500">
        Join our community now!
      </p>

      {/* Input Field - Username */}
      <div className="relative">
        <FaUser className="absolute top-3 left-3 text-gray-400" />
        <input
          id="username"
          type="text"
          // use utility method "getFieldProps" that take care of: values, handleChange, handleBlur, touched and others
          {...formik.getFieldProps("username")}
          placeholder="Username"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {/* Display the error if: touched and input field has any errors. Show error message */}
        {formik.touched.username && formik.errors.username && (
          <span className="text-xs text-red-500">{formik.errors.username}</span>
        )}
      </div>

      {/* Input Field - Email */}
      <div className="relative">
        <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
        <input
          id="email"
          type="email"
          {...formik.getFieldProps("email")}
          placeholder="Email"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-xs text-red-500">{formik.errors.email}</span>
        )}
      </div>

      {/* Input Field - Password */}
      <div className="relative">
        <FaLock className="absolute top-3 left-3 text-gray-400" />
        <input
          id="password"
          type="password"
          {...formik.getFieldProps("password")}
          placeholder="Password"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.password && formik.errors.password && (
          <span className="text-xs text-red-500">{formik.errors.password}</span>
        )}
      </div>

      {/* Input Field - Confirm Password */}
      <div className="relative">
        <FaLock className="absolute top-3 left-3 text-gray-400" />
        <input
          id="confirmPassword"
          type="password"
          {...formik.getFieldProps("confirmPassword")}
          placeholder="Confirm Password"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <span className="text-xs text-red-500">
            {formik.errors.confirmPassword}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
