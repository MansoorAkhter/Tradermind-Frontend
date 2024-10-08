import React, { FC, useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  signOut,
  signInWithPopup,
} from "../../config/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { ASSETS } from "@/assets/page";
import Image from "next/image";
import { useRegisterUserMutation } from "@/store/slices/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/store/slices/userSlice";

const GoogleSignIn: FC<{ state: any }> = ({ state }) => {
  const { signupForm, toggler } = state;
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const [RegisterHandler, { data }] = useRegisterUserMutation();

  useEffect(() => {
    if (userData !== null) {
      dispatch(setUser(userData));
      router.push("/");
    }
  }, [userData]);

  return (
    <div className="w-full">
      <button
        onClick={() => {
          handleSignIn(setUserData, toggler, RegisterHandler, signupForm);
        }}
        type="submit"
        className="bg-white text-btnBlue rounded-lg font-semibold h-12 w-full text-sm md:text-base px-6 flex items-center justify-center gap-x-3">
        <Image src={ASSETS.googleIcon} alt="Google Icon" />
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleSignIn;

export const handleSignIn = (
  isUser: any,
  toggleCallback: any,
  RegisterHandler: any,
  signupForm: boolean
) => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  signInWithPopup(auth, provider)
    .then((result: any) => {
      isUser(result.user);
      toggleCallback;

      console.log("Uid: ", result?.user.uid);
      console.log("User email: ", result?.user.email);
      console.log("User displayName: ", result?.user.displayName);

      const regsReqData: any = {
        email: result?.user.email,
        user_id: result?.user.uid,
        name: result?.user.displayName,
      };
      if (signupForm) {
        RegisterHandler(regsReqData)
          .unwrap()
          .then((res: any) => {
            console.log("RegisterHandler=====>>>", res);
          })
          .catch((error: any) => {
            console.log("Error API signing in : ", error);
          });
      }
    })
    .catch((error: any) => {
      console.log("Error Google signing in: ", error);
    });
};
