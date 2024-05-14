import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useSelector } from "react-redux";
import ContactsList from "./ContactsList";

function ChatList() {
  const allContact = useSelector((state) => state.userData?.contactsPage);
  const [pageType, setPageType] = useState("default");
  useEffect(() => {
    if (!allContact) setPageType("allContact");
    else setPageType("default");
  }, [allContact]);

  // console.log(allContact, "allContact");
  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
      {pageType === "default" && (
        <div>
          <ChatListHeader />
          <SearchBar />
          <List />
        </div>
      )}
      {pageType === "allContact" && <ContactsList />}
    </div>
  );
}

export default ChatList;
