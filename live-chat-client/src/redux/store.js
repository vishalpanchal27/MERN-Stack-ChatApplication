import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./Slices/themeSlice";
import chatListSlice from "./Slices/chatListSlice";
import chatwithSlice from "./Slices/chatwithSlice";

export const store = configureStore({
    reducer: {
        theme: themeSlice,
        chatList: chatListSlice,
        chatWith: chatwithSlice,
    }
})