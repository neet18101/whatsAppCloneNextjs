import { setNewUser, setUserInfo } from "@/context/UserSlice";
import { CHECK_USER_ROTUE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";

function login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.userData?.userInfo);
  const checkNewUser = useSelector((state) => state?.userData?.newUser);
  // console.log(userData?.email);
  useEffect(() => {
    // console.log(userData, checkNewUser);
    if (userData?.id && !checkNewUser) router.push("/");
  }, [userData, checkNewUser]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email, photoUrl: profileImage },
    } = await signInWithPopup(firebaseAuth, provider);
    // console.log(email)
    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROTUE, { email });
        console.log(data, email);
        console.log(data?.status);
        if (!data?.status) {
          dispatch(setNewUser(true));
          dispatch(
            setUserInfo({
              name,
              email,
              profileImage,
              status: "",
            })
          );
          router.push("/onboarding");
        } else {
          const {
            id,
            name,
            email,
            profilePicture: profileImage,
            status,
          } = data?.data;
          dispatch(
            setUserInfo({
              id,
              name,
              email,
              profileImage,
              status: "",
            })
          );
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
        <div className="flex items-center justify-center gap-2 text-white">
          <Image src="/whatsapp.gif" height={300} width={300} alt="whatsapp" />
          <span className="text-7xl"> NeetX Chat </span>
        </div>
        <button
          className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
          onClick={handleLogin}
        >
          <FcGoogle className="text-4xl" />
          <span className="text-white text-2xl">Login with Google </span>
        </button>
      </div>
    </>
  );
}

export default login;
