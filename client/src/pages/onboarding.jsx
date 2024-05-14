import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { setNewUser, setUserInfo } from "@/context/UserSlice";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function onboarding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData?.userInfo);
  const checkNewUser = useSelector((state) => state.userData?.newUser);
  console.log(!userData?.userInfo?.email, !userData?.newUser, "neet");
  const [name, setName] = useState(userData?.name || "")  ;
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  // as soon as page load we need user data
  useEffect(() => {
    if (!checkNewUser && !userData?.email) router.push("/login");
    else if (!checkNewUser && userData?.email) router.push("/");
  }, [checkNewUser, userData, router]);

  // console.log(image);
  const onboardUserHandle = async () => {
    if (validateDetails()) {
      const email = userData?.email;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        });
        console.log(data);
        if (data.status) {
          dispatch(setNewUser(false));
          dispatch(
            setUserInfo({
              id: data.user.id,
              name,
              email,
              profileImage: profilePicture,
              status: about,
            })
          );
          router.push("/chat");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const validateDetails = () => {
    if (name.length < 3) return false;
    return true;
  };

  return (
    <>
      <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center">
        <div className="flex items-center justify-center gap-2">
          <Image src="/whatsapp.gif" height={300} width={300} />
          <span className="text-7xl"> NeetX Chat </span>
        </div>
        <h2 className="text-2xl">Create your profile</h2>
        <div className="flex gap-6 mt-6">
          <div className="flex flex-col items-center mt-5 gap-6">
            <Input
              name={"Display Name"}
              state={name}
              setState={setName}
              label
            />
            <Input name={"about"} state={about} setState={setAbout} label />
            <div className="flex items-center justify-center">
              <button
                className="bg-black-500 hover:bg-black-700 text-white bg-search-input-container-background font-bold py-2 px-4 rounded"
                onClick={onboardUserHandle}
              >
                create profile
              </button>
            </div>
          </div>
          <div>
            <Avatar type="lg" image={image} setImage={setImage} />
          </div>
        </div>
      </div>
    </>
  );
}

export default onboarding;
