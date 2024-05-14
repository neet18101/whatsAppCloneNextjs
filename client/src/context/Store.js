import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice"; // Corrected import statement

const store = configureStore({
  reducer: {
    userData: userSlice // Using the userSlice directly
  },
});

export default store;
