import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../fireBase/firebase";


export const saveTheme = createAsyncThunk(
    'theme/saveTheme',
    async ({ uid, theme }) => {
        const userRef = doc(db, "Users", uid)

        await updateDoc(userRef, {
            theme
        })
        return theme;
    }
)

const themeSlice = createSlice({

    name:"theme",

    initialState:{
        mode:"light",
        loading:false
    },

    reducers:{
        toggleTheme:(state)=>{
            state.mode = state.mode === "light"
            ? "dark"
            :"light";
        },

        setTheme:(state,action)=>{
            state.mode = action.payload;
        }

    },

    extraReducers:(builder)=>{
        builder
        .addCase(saveTheme.fulfilled,(state,action)=>{
            state.mode = action.payload;
        })
    }

});

export const {
    toggleTheme,
    setTheme
}=themeSlice.actions;

export default themeSlice.reducer;