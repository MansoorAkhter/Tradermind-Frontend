"use client";
import Image from "next/image";
import { ASSETS } from "@/assets/page";
import LoginForm from "@/components/shared/Login";
import SignupForm from "@/components/shared/Signup";
import { useRegisterUserMutation } from "@/store/slices/auth";

const Auth = () => {
  const [RegisterHandler, { data }] = useRegisterUserMutation();

  return (
    <div className="relative h-full w-full py-8 md:py-20 flex justify-center bg-secondary overflow-hidden ">
      <div className="grid md:grid-cols-2 md:bg-[#ffffff0c] md:backdrop-blur-3xl md:border border-[#fff3] rounded-[30px] w-[80%] h-full z-20">
        <div className="h-full w-full overflow-hidden hidden md:flex justify-center relative">
          <Image
            src={ASSETS.robot}
            quality={100}
            alt="AI Robot"
            className="h-full w-[80%] absolute bottom-0 z-10 object-cover"
          />
          {/* <Image
            src={ASSETS.sparkels}
            quality={100}
            alt="Background Pattern"
            className="h-[80%] w-[80%] absolute mix-blend-lighten left-12 top-24"
          /> */}
        </div>
        <div className="h-full w-full flex justify-center items-center  md:overflow-hidden">
          <div className="w-full md:w-[65%] px-8 md:px-16 py-5 md:py-10 bg-[#ffffff0c] md:bg-transparent backdrop-blur-xl border border-[#fff3] rounded-2xl flex flex-col items-center">
            {/* <SignupForm/> */}
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="w-[500px] h-[500px] bg-primary blur-[100px] absolute -left-5 -top-5 -z-0" />
      <div className="w-[500px] h-[500px] bg-primary blur-[100px] absolute -right-5 -bottom-5 -z-0" />
    </div>
  );
};

export default Auth;

// [border-image:linear-gradient(to_left,#1a5896,#fff)_30] border-2 border-solid border-transparent
