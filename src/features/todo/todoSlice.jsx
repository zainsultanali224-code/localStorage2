import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../../assets/components/firebase";
import getPaginationUsersTodos from "../../assets/components/pagination";

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

export const fetchSingleTodo = createAsyncThunk(
    'todo/fetchSingleTodo',
    async ({ userId, todoId }, { rejectWithValue }) => {
        try {
            const todoRef = doc(db, "Users", userId, "Todos", todoId);
            const todoSnap = await getDoc(todoRef);

            if (!todoSnap.exists()) {
                throw new Error("Task not found");

            }

            return {
                id: todoSnap.id,
                ...todoSnap.data()
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)
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
        console.log("fetchAllUsersTodos called")

        try {
            const usersRef = collection(db, "Users");
            const usersSnapshot = await getDocs(usersRef);
            const allTodos = [];

            for (const userDoc of usersSnapshot.docs) {
                const userData = userDoc.data();

                const todosRef = collection(db, "Users", userDoc.id, "Todos");
                const todosSnapshot = await getDocs(todosRef);

                const userTodos = todosSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    userId: userDoc.id,

                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                    userEmail: userData.email,

                    ...doc.data(),
                }));

                allTodos.push(...userTodos);
            }
            return allTodos;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPaginationTodos = createAsyncThunk(
    'todo/fetchPaginationTodos',
    async ({ userId, pageSize, searchValue, lastVisible }, { rejectWithValue }) => {
        try {
            const result = await getPaginationUsersTodos({
                userId,
                pageSize,
                searchValue,
                lastVisible
            })
            return result
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const initialState = {
    todos: [],
    allUsersTodos: [],
    selectedTask: null,
    userId: null,
    updateError: "",
    isLoading: false,
    error: null,

    tasks: [],
    lastVisible: null,
    hasNextPage: false,
    totalItems: 0
};

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        setUserId: (state, action) => {
            state.userId = action.payload;
        },

        setSelectedTask: (state, action) => {
            state.selectedTask = action.payload;
        },

        setUpdateError: (state, action) => {
            state.updateError = action.payload;
        },
    },
    extraReducers: (builder) => {
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

        builder
            .addCase(updateTodo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                state.isLoading = false;

                const index = state.todos.findIndex(
                    todo => todo.id === action.payload.id
                );

                if (index !== -1) {
                    state.todos[index] = {
                        ...state.todos[index],
                        ...action.payload,
                    };
                }

                if (state.selectedTask?.id === action.payload.id) {
                    state.selectedTask = {
                        ...state.selectedTask,
                        ...action.payload,
                    };
                }

                state.error = null;
            })
            .addCase(updateTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

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

        builder
            .addCase(fetchSingleTodo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSingleTodo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedTask = action.payload;
                state.error = null;
            })
            .addCase(fetchSingleTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchPaginationTodos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(fetchPaginationTodos.fulfilled, (state, action) => {
                state.isLoading = false;

                state.tasks = action.payload.data;
                state.lastVisible = action.payload.lastVisible;
                state.hasNextPage = action.payload.hasNextPage;
                state.totalItems = action.payload.totalItems;

                state.error = null;
            })

            .addCase(fetchPaginationTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const {
    clearError,
    setUserId,
    setSelectedTask,
    setUpdateError,
} = todoSlice.actions;
export default todoSlice.reducer;
