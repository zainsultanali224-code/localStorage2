import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    serverTimestamp 
} from "firebase/firestore";
import { db } from "../../assets/components/firebase";

// Async Thunks
export const fetchUserTodos = createAsyncThunk(
    'todo/fetchUserTodos',
    async (userId, { rejectWithValue }) => {
        try {
            const todosRef = collection(db, "Users", userId, "Todos");
            const snapshot = await getDocs(todosRef);
            const todos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return todos;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addNewTodo = createAsyncThunk(
    'todo/addNewTodo',
    async ({ userId, todoData }, { rejectWithValue }) => {
        try {
            const todosRef = collection(db, "Users", userId, "Todos");
            const docRef = await addDoc(todosRef, {
                ...todoData,
                createdAt: serverTimestamp(),
            });
            return {
                id: docRef.id,
                ...todoData
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateTodo = createAsyncThunk(
    'todo/updateTodo',
    async ({ userId, todoId, updatedData }, { rejectWithValue }) => {
        try {
            const todoRef = doc(db, "Users", userId, "Todos", todoId);
            await updateDoc(todoRef, updatedData);
            return {
                id: todoId,
                ...updatedData
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTodo = createAsyncThunk(
    'todo/deleteTodo',
    async ({ userId, todoId }, { rejectWithValue }) => {
        try {
            const todoRef = doc(db, "Users", userId, "Todos", todoId);
            await deleteDoc(todoRef);
            return todoId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAllUsersTodos = createAsyncThunk(
    'todo/fetchAllUsersTodos',
    async (_, { rejectWithValue }) => {
        try {
            const usersRef = collection(db, "Users");
            const usersSnapshot = await getDocs(usersRef);
            const allTodos = [];

            for (const userDoc of usersSnapshot.docs) {
                const todosRef = collection(db, "Users", userDoc.id, "Todos");
                const todosSnapshot = await getDocs(todosRef);
                const userTodos = todosSnapshot.docs.map(doc => ({
                    id: doc.id,
                    userId: userDoc.id,
                    userEmail: userDoc.data().email,
                    ...doc.data()
                }));
                allTodos.push(...userTodos);
            }
            return allTodos;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    todos: [],
    allUsersTodos: [],
    isLoading: false,
    error: null,
};

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch User Todos
        builder
            .addCase(fetchUserTodos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.todos = action.payload;
                state.error = null;
            })
            .addCase(fetchUserTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Add Todo
        builder
            .addCase(addNewTodo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addNewTodo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.todos.push(action.payload);
                state.error = null;
            })
            .addCase(addNewTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Update Todo
        builder
            .addCase(updateTodo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.todos.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.todos[index] = { ...state.todos[index], ...action.payload };
                }
                state.error = null;
            })
            .addCase(updateTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Delete Todo
        builder
            .addCase(deleteTodo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.todos = state.todos.filter(todo => todo.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Fetch All Users Todos
        builder
            .addCase(fetchAllUsersTodos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllUsersTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allUsersTodos = action.payload;
                state.error = null;
            })
            .addCase(fetchAllUsersTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;