import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import todoReducer from "../features/todo/todoSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        todo: todoReducer,
    },
});

export default store;