import { configureStore } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import userSlice from "./UserSlice"; // Corrected import statement

const store = configureStore({
  reducer: {
    userData: userSlice, // Using the userSlice directly
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["userSlice/socketReducer"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.socket"],
        // Ignore these paths in the state
        ignoredPaths: ["userData.socket"],
      },
    }),
});

export default store;
