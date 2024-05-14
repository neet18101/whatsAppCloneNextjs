import { setAllContacts } from "@/context/UserSlice";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContact, setallContact] = useState([]);
  const allContacts = useSelector((state) => state.userData?.contactsPage);
  const dispatch = useDispatch();
  useEffect(() => {
    const getContact = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setallContact(users);
      } catch (error) {
        console.log(error);
      }
    };
    getContact();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => dispatch(setAllContacts())}
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14 ">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
            <div className="px-5">
              <BiSearchAlt2
                className="text-panel-header-icon cursor-pointer"
                title="Search"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Search Contact"
                className="bg-transparent text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              />
            </div>
          </div>
        </div>

        {Object.entries(allContact).map(([initalLetter, userList]) => {
          return (
            <div key={Date.now() + initalLetter}>
              <div className="text-teal-light pl-10 py-5">{initalLetter}</div>
              {userList.map((contact) => {
                return (
                  <ChatLIstItem
                    data={contact}
                    isContactPage={true}
                    key={contact._id}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
