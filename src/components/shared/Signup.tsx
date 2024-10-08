"use client";
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "./forms";

const SignupForm: React.FC = () => {
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Required"),
    lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
  });

  return (
    <Formik
      initialValues={{ firstName: "", lastName: "", email: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}>
      <Form className="flex flex-col gap-4 w-full">
        <h1 className="text-white text-3xl font-medium leading-none">
          Private Details
        </h1>
        <h4 className="text-white font-extralight text-sm leading-none">
          This information will not be publicly displayed.
        </h4>
        <InputField name="email" label="Email" type="email" />
        <InputField name="firstName" label="First Name" />
        <InputField name="lastName" label="Last Name" />

        <div className="">
          <h2 className="text-white">Make your account more secure</h2>
          <button
            type="submit"
            className="bg-btnBlue text-white rounded-lg h-12 px-6">
            Set 2-factors authentication
          </button>
          <h2 className="text-white">Password</h2>
          <button
            type="submit"
            className="bg-btnBlue text-white rounded-lg h-12 px-6">
            Change Password
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default SignupForm;
