import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: true,
  currentChatUser: undefined,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState, // Corrected typo from 'initalState' to 'initialState'
  reducers: {
    setUserInfo(state, action) {
      console.log(action.payload);
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
      
    }
  },
});

export const { setUserInfo, setNewUser, setAllContacts ,currentChatUser} = userSlice.actions;
export default userSlice.reducer;
