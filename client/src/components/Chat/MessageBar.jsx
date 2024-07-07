import { addMessage } from "@/context/UserSlice";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import PhotoPicker from "../common/PhotoPicker";
const CaptureAudio = dynamic(() => import('../common/CaptureAudio'), { ssr: false })
import { FaMicrophone } from "react-icons/fa";
import dynamic from "next/dynamic";
// Import useSocket

function MessageBar() {
  const userData = useSelector((state) => state?.userData?.userInfo);
  const dispatch = useDispatch();
  const currentChatUser = useSelector(
    (state) => state?.userData?.currentChatUser
  );
  const [message, setMessage] = useState("");
  const getSocketFromStore = useSelector((state) => state?.userData?.socket);
  // console.log(getSocketFromStore.current);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecording, setShowAudioRecording] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.body.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userData?.id,
          to: currentChatUser?.id,
        },
      });
      console.log(response?.status, "neetx");
      if (response?.status === 201) {
        getSocketFromStore.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userData?.id,
          message: response?.data?.message?.message,
          type: "image",
          createAt: new Date().toISOString(),
        });

        dispatch(
          addMessage({
            message: response?.data?.message?.message,
            createdAt: new Date().toISOString(),
            senderId: userData?.id,
            messageStatus: "delivered",
            type: "image",
            fromSelf: true,
          })
        );
      }

      setMessage(response.data.data.url);
    } catch (error) { }
    // alert("hello");
    // const file = e.target.files[0];
    // const reader = new FileReader();
    // const data = document.createElement("img");
    // reader.onload = function (event) {
    //   data.src = event.target.result;
    //   data.setAttribute("data-src", event.target.result);
    // };
    // reader.readAsDataURL(file);

    // setTimeout(() => {
    //   console.log(data.src);
    //   setImage(data.src);
    // }, 100);
  };

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  // console.log(userData);
  const sendMessage = async () => {
    try {
      const { data } = await axios.post(ADD_MESSSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userData?.id,
        message: message,
      });
      getSocketFromStore.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userData?.id,
        message: data?.data?.message,
        type: "text",
      });
      dispatch(
        addMessage({
          message: data?.data?.message,
          createdAt: new Date().toISOString(),
          senderId: userData?.id,
          messageStatus: "delivered",
          type: "text",
          fromSelf: true,
        })
      );

      // if (socket.current) {
      //   socket.current.emit("send-msg", {
      //     to: currentChatUser?.id,
      //     from: userData?.id,
      //     message: data?.data?.message,
      //   });
      // }

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {!showAudioRecording && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                className="absolute bottom-24 left-16 z-40"
                ref={emojiPickerRef}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attachment"
              onClick={() => setGrabPhoto(!grabPhoto)}
            />
          </div>

          <div className="w-full rounded-lg h-10 flex items-center z-10">
            <input
              type="text"
              placeholder="Type a message"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <div className="flex w-10 items-center justify-center">
            <button onClick={sendMessage}>
              {message?.length ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record"
                  onClick={() => setShowAudioRecording(true)}
                />
              )}
            </button>
          </div>
        </>
      )}

      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecording && <CaptureAudio hide={setShowAudioRecording} />}
    </div>
  );
}

export default MessageBar;
