import React, { useEffect, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { CHECK_USER_ROTUE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import Chat from "./Chat/Chat";
import { setUserInfo } from "@/context/UserSlice";

function Main() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const userData = useSelector((state) => state?.userData?.userInfo);
  const currentChatUser = useSelector((state) => state?.userData?.currentChatUser);
  // console.log(redirectLogin, "check Redux");

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true);
    // console.log(currentUser?.email, "neet");
    if (!userData && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROTUE, {
        email: currentUser?.email,
      });
      // console.log(data?.status,"neet")

      if (!data.status) {
        router.push("/login");


      }

      // console.log({data});
      if (data?.data) {
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
      }
    }
  });
  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-h-screen max-w-full overflow-hidden ">
        <ChatList />
        {currentChatUser ?<Chat />:<Empty/>}
        {/* <Empty /> */}
        <Chat/>
      </div>
    </>
  );
}

export default Main;
