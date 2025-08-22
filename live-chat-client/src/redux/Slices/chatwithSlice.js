import { createSlice } from "@reduxjs/toolkit";

const chatwithSlice = createSlice({
    name: "chatWith",
    initialState: null, // Change to null as the initial state
    reducers: {
        openChat(state, action) {
            const chatWithNewPerson = action.payload;
            // Check if state is null or not before finding
            if (state && state._id === chatWithNewPerson) {
                return state; // If the person is already open, return the current state
            } else {
                return chatWithNewPerson; // Otherwise, return the new person
            }
        },
        closeChat(state, action) {
            return null; // Set state to null to indicate that no chat is open
        }
    }
});

export const { openChat, closeChat } = chatwithSlice.actions;
export default chatwithSlice.reducer;
