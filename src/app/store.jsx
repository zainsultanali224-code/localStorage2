import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import todoReducer from "../features/todo/todoSlice";
import themeReducer from "../features/theme/themeSlice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        todo: todoReducer,
        theme: themeReducer,
    },
});

export default store;