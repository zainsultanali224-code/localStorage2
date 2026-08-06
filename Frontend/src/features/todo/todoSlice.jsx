import { createAsyncThunk, createSlice, isPending, isFulfilled, isRejected } from "@reduxjs/toolkit";
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
import { handleAsyncState } from "../handleState";
import axios from "axios"

export const fetchUserTodos = createAsyncThunk(
    'todo/fetchUserTodos',
    async (userId, { rejectWithValue }) => {
        try {
            // const todosRef = collection(db, "Users", userId, "Todos");
            // const snapshot = await getDocs(todosRef);
            // const todos = snapshot.docs.map(doc => {
            //     const data = doc.data();

            //     return {
            //         id: doc.id,
            //         ...data,
            //         createdAt: data.createdAt
            //             ? data.createdAt.toMillis()
            //             : null,
            //     };
            // });
            // return todos;

            const res = await axios.get("/todos")
            return res.data

        } catch (error) {
            return rejectWithValue(
                error.res?.data?.message || error.message
            );
        }
    }
);

export const fetchSingleTodo = createAsyncThunk(
    'todo/fetchSingleTodo',
    async ({ id }, { rejectWithValue }) => {
        try {
            // const todoRef = doc(db, "Users", userId, "Todos", todoId);
            // const todoSnap = await getDoc(todoRef);

            // if (!todoSnap.exists()) {
            //     throw new Error("Task not found");

            // }

            // const data = todoSnap.data();

            // return {
            //     id: todoSnap.id,
            //     ...data,
            //     createdAt: data.createdAt
            //         ? data.createdAt.toMillis()
            //         : null,
            // };

            const res = await axios.get(`/todos/${id}`)
            return res.data
        } catch (error) {
            return rejectWithValue(
                error.res?.data?.message || error.message
            );
        }
    }
)
export const addNewTodo = createAsyncThunk(
    'todo/addNewTodo',
    async ({ todo }, { rejectWithValue }) => {
        try {
            // const todosRef = collection(db, "Users", userId, "Todos");
            // const docRef = await addDoc(todosRef, {
            //     ...todoData,
            //     createdAt: serverTimestamp(),
            // });
            // return {
            //     id: docRef.id,
            //     ...todoData
            // };

            const res = await axios.post("/todos", todo)
            return res.data
        } catch (error) {
            return rejectWithValue(
                error.res?.data?.message || error.message
            );
        }
    }
);

export const updateTodo = createAsyncThunk(
    'todo/updateTodo',
    async ({ id, todo }, { rejectWithValue }) => {
        try {
            // const todoRef = doc(db, "Users", userId, "Todos", todoId);
            // await updateDoc(todoRef, updatedData);
            // return {
            //     id: todoId,
            //     ...updatedData
            // };

            const res = await axios.patch(`/todos${id}`, todo)
            return res.data
        } catch (error) {
            return rejectWithValue(
                error.res?.data?.message || error.message
            );
        }
    }
);

export const deleteTodo = createAsyncThunk(
    'todo/deleteTodo',
    async ({ id }, { rejectWithValue }) => {
        try {
            // const todoRef = doc(db, "Users", userId, "Todos", todoId);
            // await deleteDoc(todoRef);
            // return todoId;

            const res = await axios.delete(`/todos/${id}`)
            return res.data
        } catch (error) {
            return rejectWithValue(
                error.res?.data?.message || error.message
            );
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
                const userData = userDoc.data();

                const todosRef = collection(db, "Users", userDoc.id, "Todos");
                const todosSnapshot = await getDocs(todosRef);

                const userTodos = todosSnapshot.docs.map((doc) => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        userId: userDoc.id,

                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        role: userData.role,
                        userEmail: userData.email,

                        ...data,

                        createdAt: data.createdAt
                            ? data.createdAt.toMillis()
                            : null,
                    };
                });

                allTodos.push(...userTodos);
            }
            return allTodos;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPaginationTodos = createAsyncThunk(
    "todo/fetchPaginationTodos",
    async (
        {
            userId,
            pageSize,
            searchValue,
            lastVisible,
        },
        { rejectWithValue }
    ) => {
        try {
            const result = await getPaginationUsersTodos({
                userId,
                pageSize,
                searchValue,
                lastVisible,
            });

            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTodoByAdmin = createAsyncThunk(
    'todo/deleteTodoByAdmin ',
    async ({ userId, todoId }, { rejectWithValue }) => {
        try {
            await deleteDoc(doc(db, "Users", userId, "Todos", todoId))

            return { userId, todoId }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateTodoByAdmin = createAsyncThunk(
    "todo/updateTodoByAdmin",
    async ({ userId, todoId, updatedTodo }, thunkAPI) => {
        try {
            const todoRef = doc(db, "Users", userId, "Todos", todoId);

            await updateDoc(todoRef, updatedTodo);

            return {
                userId,
                todoId,
                updatedTodo,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = {
    todos: [],
    allUsersTodos: [],
    selectedTask: null,
    userId: null,

    tasks: [],
    hasNextPage: false,
    totalItems: 0,


    pageCursors: {
        1: null,
    },

    loadings: {},
    errors: {},
    param: {},

    updateError: "",
};

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {

        clearError: (state, action) => {
            state.errors[action.payload] = null;
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

        ClearTask: (state) => {
            state.selectedTask = null
        },

        setPageCursor: (state, action) => {
            const { page, cursor } = action.payload;
            state.pageCursors[page] = cursor;
        },

        resetPagination: (state) => {
            state.pageCursors = {
                1: null,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserTodos.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.todos = action.payload;
            }))

        builder
            .addCase(addNewTodo.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.todos.push(action.payload);
            }))

        builder
            .addCase(updateTodo.fulfilled, handleAsyncState("fulfilled", (state, action) => {
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

            }))

        builder
            .addCase(deleteTodo.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.todos = state.todos.filter(todo => todo.id !== action.payload);
            }))
        builder
            .addCase(fetchAllUsersTodos.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.allUsersTodos = action.payload;
            }))

        builder
            .addCase(fetchSingleTodo.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.selectedTask = action.payload;
            }))

        builder
            .addCase(fetchPaginationTodos.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.tasks = action.payload.data;
                state.hasNextPage = action.payload.hasNextPage;
                state.totalItems = action.payload.totalItems;
            }))

        builder
            .addCase(deleteTodoByAdmin.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.allUsersTodos = state.allUsersTodos.filter(
                    (todo) => todo.id !== action.payload.todoId
                );
            }))

            .addCase(updateTodoByAdmin.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                const index = state.allUsersTodos.findIndex(
                    todo => todo.id === action.payload.todoId
                );

                if (index !== -1) {
                    state.allUsersTodos[index] = {
                        ...state.allUsersTodos[index],
                        ...action.payload.updatedTodo
                    };
                }
            }))

        builder
            .addMatcher(isPending, handleAsyncState("pending"))
            .addMatcher(isRejected, handleAsyncState("rejected"))

    }
});

export const {
    clearError,
    setUserId,
    setSelectedTask,
    setUpdateError,
    setPageCursor,
    resetPagination,
    ClearTask
} = todoSlice.actions;
export default todoSlice.reducer;
