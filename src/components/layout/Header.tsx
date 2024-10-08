import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "@/config/firebase";
import { clearUser, selectUser } from "@/store/slices/userSlice";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import DropDown from "../shared/DropDown";
import { HiOutlineLogout } from "react-icons/hi";
import { RiLogoutCircleRFill } from "react-icons/ri";

const Header = () => {
  const [dropDown, setDropdown] = useState(false);
  const getUser = useSelector(selectUser);
  const dispatch = useDispatch();

  console.log("GOOGLE======", dropDown);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        dispatch(clearUser(null));
        setDropdown(false);
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#313141",
          padding: "0 15px",
          height: 50,
        }}>
        <Link href="/">
          <img
            src="https://tradermind.ai/wp-content/uploads/2024/07/TM-logo-new-354x40-1.png"
            alt="Logo"
            style={{
              width: "200px",
              // height: '300px',
              objectFit: "contain",
            }}
          />
        </Link>
        {getUser?.displayName ? (
          <div className="text-white flex items-center gap-x-3">
            <h3 className="cursor-default">{getUser?.displayName}</h3>
            <Image
              src={getUser.photoURL}
              alt="User Avatar"
              width={35}
              height={35}
              className="rounded-full cursor-pointer border-2 border-slate-600"
              onClick={() => setDropdown(!dropDown)}
            />
          </div>
        ) : (
          <Link
            href="/auth"
            style={{
              height: 30,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1a5896",
              padding: "0 15px",
              fontWeight: "600",
              color: "white",
              borderRadius: 8,
              fontSize: 14,
              textTransform: "capitalize",
            }}>
            Sign in
          </Link>
        )}
      </header>

      {dropDown && (
        <DropDown>
          <button
            onClick={handleSignOut}
            className="w-full font-medium bg-red-600 text-sm py-1 capitalize text-white flex items-center justify-center gap-x-2">
            <span>Signout</span>
            {/* <HiOutlineLogout size={20} /> */}
            <RiLogoutCircleRFill size={20} />
          </button>
        </DropDown>
      )}
    </>
  );
};

export default Header;
