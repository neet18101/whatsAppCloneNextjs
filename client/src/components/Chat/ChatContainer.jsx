import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import { useSelector } from "react-redux";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

import dynamic from "next/dynamic";

const VoiceMessage = dynamic(() => import('./VoiceMessage'), { ssr: false })
function ChatContainer() {
  const getMessages = useSelector((state) => state.userData?.messages);
  const currentChatUser = useSelector(
    (state) => state?.userData?.currentChatUser
  );

  const userData = useSelector((state) => state?.userData?.userInfo);
  // console.log(userData);
  // console.log(currentChatUser?.id);
  // console.log(getMessages);
  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed  w-full opacity-5  left-0 top-0 z-0"></div>
      <div className="mx-2 my-6 relative bottom-0 z-0 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {getMessages?.map((message, index) => {
              return (
                <div
                  key={index}
                  className={`flex ${message.senderId === currentChatUser?.id
                    ? "justify-start"
                    : "justify-end"
                    }`}
                >
                  {message.type === "text" && (
                    <div
                      className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${message.senderId === currentChatUser?.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                        }`}
                    >
                      <span className="break-all">{message.message}</span>
                      <div className="flex gap-1 items-end">
                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                          {calculateTime(message.createdAt)}
                        </span>
                        <span>
                          {message.senderId === userData?.id && (
                            <MessageStatus
                              messageStatus={message?.messageStatus}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  {message.type === "image" && (
                    <ImageMessage message={message} />
                  )}
                  {message.type === "audio" && (
                    <VoiceMessage message={message} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
