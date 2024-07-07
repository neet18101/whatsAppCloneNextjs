import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: true,
  currentChatUser: undefined,
  messages: [],
  socket: undefined,
  socketConnected: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState, // Corrected typo from 'initalState' to 'initialState'
  reducers: {
    setUserInfo(state, action) {
      // console.log(action.payload);
      state.userInfo = action.payload;
    },
    setNewUser(state, action) {
      state.newUser = action.payload;
    },

    setAllContacts(state, action) {
      state.contactsPage = !state.contactsPage; // Toggle the contactsPage state
    },
    currentChatUser(state, action) {
      state.currentChatUser = action.payload;
    },
    UserMessages(state, action) {
      // console.log(action.payload);
      state.messages = action.payload;
    },
    socketReducer(state, action) {
      // console.log(action.payload);
      state.socket = action.payload;
    },
    addMessage(state, action) {
      console.log(action.payload);
      state.messages.push(action.payload);
      // state.messages = [...state.messages, action.payload];
    },
    setSocketConnected(state, action) {
      state.socketConnected = action.payload;
    },
  },
});

export const {
  setUserInfo,
  setNewUser,
  setAllContacts,
  currentChatUser,
  UserMessages,
  socketReducer,
  addMessage,
  setSocketConnected,
} = userSlice.actions;
export default userSlice.reducer;
