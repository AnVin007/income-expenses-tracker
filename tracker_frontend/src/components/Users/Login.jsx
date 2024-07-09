import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";
import { loginAction } from "../../redux/slice/authSlice";

//* FORM VALIDATIONS (using Yup library)
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid").required("Email is required"),
  password: Yup.string()
    .min(5, "Password must be 5 characters long")
    .required("Password is required"),
});

const LoginForm = () => {
  //* ==========> CREATE NAVIGATION INSTANCE
  const navigate = useNavigate();

  //* ==========> CREATE INSTANSE OF DISPATCH
  const dispatch = useDispatch();

  //* ==========> CONFIGURE MUTATION (React Query)
  // Destructure useMutation to use some specific components:
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: loginAPI,
    mutationKey: ["login"],
  });

  //* ==========> CONFIGURE FORMIK INSTANCE
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    //Validation -> use schema from Yup
    validationSchema,
    //Submit form
    //! values holds values from input fields of the form
    onSubmit: (values) => {
      //pass input values to mutateAsync function
      mutateAsync(values)
        .then((data) => {
          //! dispatch the action from Redux
          dispatch(loginAction(data));
          //! save the user data from server in local storage
          localStorage.setItem("userInfo", JSON.stringify(data));
        })
        .catch((err) => console.log(err));

      //mutateAsync will use mutationFn defined above (loginAPI in our case) and then resolve promise from loginAPI
    },
  });

  //* ==========> REDIRECT TO PROFILE PAGE
  useEffect(() => {
    setTimeout(() => {
      if (isSuccess) {
        navigate("/dashboard");
      }
    }, 1000);
  }, [isPending, isError, error, isSuccess]);

  //* ==========> RETURN HTML COMPONENT
  return (
    //! We bind formik into form
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200"
    >
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Login
      </h2>
      {/* Display messages: based on the type and message */}
      {isPending && <AlertMessage type="loading" message="Login you in..." />}
      {isSuccess && (
        <AlertMessage type="success" message="Login successfully" />
      )}
      {isError && (
        <AlertMessage type="error" message={error.response.data.message} />
      )}
      <p className="text-sm text-center text-gray-500">
        Login to access your account
      </p>

      {/* Input Field - Email */}
      <div className="relative">
        <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
        <input
          id="email"
          type="email"
          // use utility method "getFieldPropse" that take care of: values, handleChange, handleBlur, touched and others
          {...formik.getFieldProps("email")}
          placeholder="Email"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {/* Display the error if: email touched and input field has any errors. Show error message */}
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

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
