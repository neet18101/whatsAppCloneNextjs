  import React from "react";
  import Avatar from "../common/Avatar";
  import { useDispatch, useSelector } from "react-redux";
  import { currentChatUser, setAllContacts } from "@/context/UserSlice";
  // import { currentChatUser } from "@/context/UserSlice";

  function ChatLIstItem({ data, isContactPage = false }) {
    const currentChat = useSelector((state) => state.userData?.currentChatUser);
    // console.log(currentChat , data);
    const dispatch = useDispatch();
    const handleContactClick = () => {
      dispatch(currentChatUser(data));
      dispatch(setAllContacts());
    };
    return (
      <div
        className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
        onClick={handleContactClick}
      >
        <div className="min-w-fit px-5 pt-3 pb-1">
          <Avatar type="sm" image={data?.profilePicture} />
        </div>
        <div className="min-h-full flex flex-col justify-center mt-3 w-full pr-2">
          <div className="flex justify-between">
            <div>
              <span className="text-white">{data?.name}</span>
            </div>
          </div>
          <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
            <div className="flex justify-between w-full">
              <span className="text-secondary line-clamp-1 text-sm">
                {data?.about || "\u00a0"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default ChatLIstItem;
