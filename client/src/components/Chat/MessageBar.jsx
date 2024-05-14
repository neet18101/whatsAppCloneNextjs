import { ADD_MESSSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useSelector } from "react-redux";

function MessageBar() {
  const userData = useSelector((state) => state?.userData?.userInfo);
  const currentChatUser = useSelector(
    (state) => state?.userData?.currentChatUser
  );

  const [message, setMessage] = useState("");
  const sendMessage = async () => {
    try {
      const { data } = await axios.post(ADD_MESSSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userData?.id,
        message: message,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
          />
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attachment"
          />
        </div>

        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          <button>
            <MdSend
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Send Message"
              onClick={sendMessage}
            />
            {/* <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl" title="Microphone"/> */}
          </button>
        </div>
      </>
    </div>
  );
}

export default MessageBar;
