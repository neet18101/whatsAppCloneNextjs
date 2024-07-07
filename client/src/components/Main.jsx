import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { CHECK_USER_ROTUE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import Chat from "./Chat/Chat";
import {
  UserMessages,
  addMessage,
  setUserInfo,
  socketReducer,
} from "@/context/UserSlice";
import { io } from "socket.io-client";

function Main() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  const userData = useSelector((state) => state?.userData?.userInfo);
  const currentChatUser = useSelector(
    (state) => state?.userData?.currentChatUser
  );
  const socketRef = useRef();

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (!currentUser) setRedirectLogin(true);
      if (!userData && currentUser?.email) {
        const { data } = await axios.post(CHECK_USER_ROTUE, {
          email: currentUser?.email,
        });

        if (!data.status) {
          router.push("/login");
        }

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
  }, [userData]);

  useEffect(() => {
    if (userData) {
      socketRef.current = io(HOST);
      socketRef.current.emit("add-user", userData?.id);
      dispatch(socketReducer(socketRef));
    }
  }, [userData]);

  useEffect(() => {
    if (socketRef.current && !socketEvent) {
      socketRef.current.on("msg-recieve", (data) => {
        console.log(data);
        dispatch(
          addMessage({
            type: data.type === "text" ? "text" : data.type === "image" ? "image" : "audio",
            message: data.message,
            senderId: currentChatUser?.id,

            createdAt: new Date().toISOString(),
          })
        );
      });
      setSocketEvent(true);
    }
  }, [socketRef.current]);

  useEffect(() => {
    const getMessages = async () => {
      const {
        data: { data },
      } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userData?.id}/${currentChatUser?.id}`
      );
      dispatch(UserMessages(data));
    };
    if (userData?.id && currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-h-screen max-w-full overflow-hidden">
      <ChatList />
      {currentChatUser ? <Chat /> : <Empty />}
      <Chat />
    </div>
  );
}

export default Main;
