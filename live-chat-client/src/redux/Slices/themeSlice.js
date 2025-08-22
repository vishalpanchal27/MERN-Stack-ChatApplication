import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'themeSlice',
    initialState: true,
    reducers: {
        toggleTheme: (state, action) => {
            // Modify the state using Immer
            return action.payload;
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
