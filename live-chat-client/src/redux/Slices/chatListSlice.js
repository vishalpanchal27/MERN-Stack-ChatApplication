import { createSlice } from "@reduxjs/toolkit";

const chatListSlice = createSlice({
    name: "chatList",
    initialState: [], // array to store multiple users
    reducers: {
        addPerson(state, action) {
            const exists = state.find(u => u._id === action.payload._id);
            console.log("redux call")
            if (!exists) state.push(action.payload);
        },
        clearPerson() {
            return []; // reset to empty list
        },
    },
});

export const { addPerson, clearPerson } = chatListSlice.actions;
export default chatListSlice.reducer;
