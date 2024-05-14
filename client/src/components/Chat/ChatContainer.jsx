import React from "react";

function ChatContainer() {
  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed opacity-5 w-full h-full left-0 top-0 z-0"></div>
      <div className="flex w-full">
        <div className="flex flex-col justify-end w-full gap-1 overflow-auto"></div>
      </div>
    </div>
  );
}

export default ChatContainer;
