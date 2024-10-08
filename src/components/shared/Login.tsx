"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "./forms";
import Image from "next/image";
import { ASSETS } from "@/assets/page";
import { useRegisterUserMutation } from "@/store/slices/auth";
import GoogleSignIn from "./GoogleSignin";

const LoginForm: React.FC = () => {
  const [signupForm, setSignupForm] = useState(false);
  const toggleForm = () => {
    setSignupForm((prev) => !prev);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[\W_]/, "Must contain at least one special character") // Special character
      .required("Required"),
  });

  const loginReqData: any = {
    email: "user@example.com",
    user_id: "string",
    name: "string",
  };

  const [RegisterHandler, { data }] = useRegisterUserMutation();

  const authHandler = async () => {
    const res = await RegisterHandler(loginReqData).unwrap();
    console.log("RegisterHandler=====>>>", res);
  };

  return (
    <>
      <div className="flex justify-center flex-col w-full mb-5">
        <Image
          src={ASSETS.tm_logo}
          quality={100}
          alt="Background Pattern"
          className="w-4/5 md:w-3/5 self-center mb-2"
        />
        <h1 className="text-white text-left text-[26px] font-medium leading-none my-5">
          {signupForm ? "Signup" : "Login"}
        </h1>
      </div>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}>
        <Form className="flex flex-col md:gap-4 w-full">
          {/* FORM */}
          <div className="gap-6 flex flex-col">
            <InputField name="email" label="Email" type="email" />
            <InputField name="password" label="Password" type="password" />

            <button
              onClick={authHandler}
              type="submit"
              className="bg-gradient-to-tl from-[#6EACFE] to-[#7CC7CA] text-white rounded-lg h-12 w-full font-medium px-6 mt-8">
              {signupForm ? "Sign up" : "Sign in"}
            </button>
          </div>
        </Form>
      </Formik>

      {/* Google signin & toggler */}
      <div className="w-full flex flex-col items-center gap-y-7 mt-7">
        <h2 className="text-white text-center">or</h2>
        <GoogleSignIn state={{ toggleForm, signupForm }} />
        <h4 className="text-white font-extralight select-none text-xs md:text-[13px] cursor-default tracking-wide text-center">
          {signupForm
            ? "Already have and account?"
            : "Don’t have an account yet?"}{" "}
          <br className="flex md:hidden" />
          <span className="font-semibold cursor-pointer" onClick={toggleForm}>
            {signupForm ? "Login" : "Register"}
          </span>
        </h4>
      </div>
    </>
  );
};

export default LoginForm;
