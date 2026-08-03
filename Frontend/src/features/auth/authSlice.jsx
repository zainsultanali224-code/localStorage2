import { createAsyncThunk, createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../assets/components/firebase";
import { serverTimestamp } from "firebase/firestore";
import { uploadImage } from "../../assets/components/cloudinary";
import { handleAsyncState } from "../handleState";
import { updateTodoByAdmin, deleteTodoByAdmin } from "../todo/todoSlice";

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (params, { rejectWithValue }) => {
        try {
            const { email, password, firstName, lastName } = params;

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const userData = {
                email,
                firstName,
                lastName: lastName || "",
                role: "user",
                createdAt: serverTimestamp()
            };

            await setDoc(doc(db, "Users", uid), userData);

            return { uid, email, firstName, lastName, role: "user" };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const docRef = doc(db, "Users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                return {
                    uid,
                    email: userCredential.user.email,
                    ...userData,
                    createdAt: userData.createdAt ? userData.createdAt.toMillis() : null,
                };
            }

            return { uid, email: userCredential.user.email };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    async (_, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            let unsubscribe;
            unsubscribe = onAuthStateChanged(auth, async (user) => {
                try {
                    if (user) {
                        const docRef = doc(db, "Users", user.uid);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            resolve({
                                uid: user.uid,
                                email: user.email,
                                ...userData,
                                createdAt: userData.createdAt ? userData.createdAt.toMillis() : null,
                            });
                        } else {
                            resolve({ uid: user.uid, email: user.email });
                        }
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    console.error("checkAuth error", error);
                    reject(rejectWithValue(error.message));
                } finally {
                    if (unsubscribe) unsubscribe();
                }
            });
        });
    }
);

export const fetchUsers = createAsyncThunk(
    "auth/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const snapshot = await getDocs(collection(db, "Users"));
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt ? data.createdAt.toMillis() : null,
                };
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async ({ firstName, lastName, image }, { rejectWithValue }) => {
        try {
            let imageUrl = "";

            if (image) {
                imageUrl = await uploadImage(image);
            } else {
                const snap = await getDoc(doc(db, "Users", auth.currentUser.uid));
                imageUrl = snap.data().image || "";
            }

            await updateDoc(doc(db, "Users", auth.currentUser.uid), {
                firstName,
                lastName,
                image: imageUrl,
            });

            return { firstName, lastName, image: imageUrl };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEntity = createAsyncThunk(
    "admin/fetchEntity",
    async ({ key, search = "", page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            let allData = [];

            switch (key) {
                case "users": {
                    const usersSnapshot = await getDocs(collection(db, "Users"));
                    allData = usersSnapshot.docs.map((docItem) => ({
                        id: docItem.id,
                        ...docItem.data(),
                        createdAt: docItem.data().createdAt ? docItem.data().createdAt.toMillis() : null,
                    }));
                    break;
                }

                case "usersTodos": {
                    const usersSnapshot = await getDocs(collection(db, "Users"));
                    const allTodos = [];

                    for (const userDoc of usersSnapshot.docs) {
                        const userData = userDoc.data();
                        const todosSnapshot = await getDocs(collection(db, "Users", userDoc.id, "Todos"));

                        todosSnapshot.docs.forEach((todoDoc) => {
                            const todoData = todoDoc.data();
                            allTodos.push({
                                id: todoDoc.id,
                                userId: userDoc.id,
                                firstName: userData.firstName || "",
                                lastName: userData.lastName || "",
                                role: userData.role || "user",
                                userEmail: userData.email || "",
                                ...todoData,
                                createdAt: todoData.createdAt ? todoData.createdAt.toMillis() : null,
                            });
                        });
                    }

                    allData = allTodos;
                    break;
                }

                default:
                    allData = [];
            }

            const query = search.trim().toLowerCase();
            const filtered = query
                ? allData.filter((item) =>
                    [item.email, item.userEmail, item.title].some((value) =>
                        value?.toString().toLowerCase().includes(query)
                    )
                )
                : allData;

            const total = filtered.length;
            const start = (page - 1) * limit;
            const pageData = filtered.slice(start, start + limit);

            const completedCount = key === "usersTodos"
                ? filtered.filter((item) => item.status === "Completed").length
                : undefined;
            const pendingCount = key === "usersTodos"
                ? filtered.filter((item) => item.status !== "Completed").length
                : undefined;

            return {
                key,
                data: pageData,
                total,
                page,
                limit,
                extra: { completedCount, pendingCount },
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const emptyView = (page = 1, limit = 10) => ({
    data: [],
    total: 0,

    search: "",
    appliedSearch: "",
    page,
    limit,
    reloadId: 0,
    extra: {},

    selected: null,
    formValues: {},
    detailsItem: null,
    viewMode: "list",
});

const getView = (state, id, page, limit) => {
    if (!state.views[id]) state.views[id] = emptyView(page, limit);
    return state.views[id];
};

const setViewStatus = (state, id, status, error = null) => {
    if (!state.loadings) state.loadings = {};
    if (!state.errors) state.errors = {};
    state.loadings[id] = status === "pending";
    state.errors[id] = status === "rejected" ? (error || "Something went wrong") : null;
};

const initialState = {
    checkingAuth: true,

    user: null,
    entities: {
        users: {
            data: [],
            total: 0,
            search: "",
            pagination: { page: 1, limit: 10, totalPages: 1 }
        },

        usersTodos:
        {
            data: [],
            total: 0,
            search: "",
            pagination: { page: 1, limit: 10, totalPages: 1 }
        }
    },

    users: [],
    todos: [],

    isAuthenticated: false,

    email: "",
    password: "",
    fname: "",
    lname: "",

    loadings: {},
    errors: {},
    params: {},

    views: {},
};

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        clearError: (state, action) => {
            state.errors[action.payload] = null;
        },

        updateField: (state, action) => {
            state[action.payload.name] = action.payload.value;
        },

        cleanForm: (state) => {
            state.email = "";
            state.password = "";
            state.fname = "";
            state.lname = "";
        },


        ensureView: (state, { payload }) => {
            getView(state, payload.id, payload.initialPage, payload.limit);
        },

        setSearch: (state, { payload }) => {
            getView(state, payload.id).search = payload.value;
        },

        applySearch: (state, { payload }) => {
            const view = getView(state, payload.id);
            view.appliedSearch = view.search;
            view.page = 1;
        },

        setPage: (state, { payload }) => {
            getView(state, payload.id).page = Math.max(1, Number(payload.page) || 1);
        },

        requestStarted: (state, { payload }) => {
            getView(state, payload.id);
            setViewStatus(state, payload.id, "pending");
        },

        requestSucceeded: (state, { payload }) => {
            const view = getView(state, payload.id);
            view.data = payload.data || [];
            view.total = payload.total ?? view.data.length;
            view.extra = payload.extra || {};
            setViewStatus(state, payload.id, "fulfilled");
        },

        requestFailed: (state, { payload }) => {
            getView(state, payload.id);
            setViewStatus(state, payload.id, "rejected", payload.error);
        },

        refetch: (state, { payload }) => {
            getView(state, payload.id).reloadId += 1;
        },

        openEdit: (state, { payload }) => {
            const view = getView(state, payload.id);
            view.selected = payload.item;
            view.formValues = Object.fromEntries(
                payload.columns.map((column) => [column.key, payload.item[column.key] ?? ""])
            );
        },
        closeEdit: (state, { payload }) => {
            const view = getView(state, payload.id);
            view.selected = null;
            view.formValues = {};
        },
        setFormValue: (state, { payload }) => {
            getView(state, payload.id).formValues[payload.key] = payload.value;
        },

        setViewMode: (state, { payload }) => {
            getView(state, payload.id).viewMode = payload.mode;
        },

        openDetails: (state, { payload }) => {
            getView(state, payload.id).detailsItem = payload.item;
        },
        closeDetails: (state, { payload }) => {
            getView(state, payload.id).detailsItem = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            }))

        builder
            .addCase(loginUser.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            }))

        builder
            .addCase(logoutUser.fulfilled, handleAsyncState("fulfilled", (state) => {
                state.user = null;
                state.isAuthenticated = false;
            }))

        builder
            .addCase(checkAuth.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.checkingAuth = false;

                if (action.payload) {
                    state.user = action.payload;
                    state.isAuthenticated = true;
                } else {
                    state.user = null;
                    state.isAuthenticated = false;
                }
            }))

        builder.addCase(
            checkAuth.rejected,
            handleAsyncState("rejected", (state) => {
                state.checkingAuth = false;
                state.user = null;
                state.isAuthenticated = false;
            })
        );

        builder
            .addCase(fetchUsers.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.users = action.payload;
            }))

        builder
            .addCase(updateProfile.fulfilled, handleAsyncState("fulfilled", (state, action) => {
                state.user = {
                    ...state.user,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    image: action.payload.image
                };
            }));

        builder.addCase(
            fetchEntity.fulfilled,
            handleAsyncState("fulfilled", (state, action) => {
                const { key, data, total, page, limit } = action.payload;

                if (!state.entities[key]) {
                    state.entities[key] = {
                        data: [],
                        total: 0,
                        search: "",
                        pagination: { page: 1, limit: 10, totalPages: 1 },
                    };
                }

                state.entities[key].data = data;
                state.entities[key].total = total;
                state.entities[key].pagination = {
                    page,
                    limit,
                    totalPages: Math.max(1, Math.ceil(total / limit)),
                };
            }));

        builder.addCase(
            deleteTodoByAdmin.fulfilled,
            handleAsyncState("fulfilled", (state, action) => {
                if (state.entities.usersTodos?.data) {
                    state.entities.usersTodos.data = state.entities.usersTodos.data.filter(
                        (todo) => todo.id !== action.payload.todoId
                    );
                }
            })
        );

        builder.addCase(
            updateTodoByAdmin.fulfilled,
            handleAsyncState("fulfilled", (state, action) => {
                if (state.entities.usersTodos?.data) {
                    const index = state.entities.usersTodos.data.findIndex(
                        (todo) => todo.id === action.payload.todoId
                    );

                    if (index !== -1) {
                        state.entities.usersTodos.data[index] = {
                            ...state.entities.usersTodos.data[index],
                            ...action.payload.updatedTodo,
                        };
                    }
                }
            })
        );

        builder
            .addMatcher(isPending, handleAsyncState("pending"))
            .addMatcher(isRejected, handleAsyncState("rejected"))
    }
});

export const {
    clearError,
    updateField,
    cleanForm,

    ensureView,
    setSearch,
    applySearch,
    setPage,
    requestStarted,
    requestSucceeded,
    requestFailed,
    refetch,
    openEdit,
    closeEdit,
    setFormValue,
    setViewMode,
    openDetails,
    closeDetails,
} = authSlice.actions;

export const selectDataView = (state, id, initialPage = 1, limit = 10) => {
    const view = state.auth.views[id] || emptyView(initialPage, limit);
    return {
        ...view,
        loading: !!state.auth.loadings?.[id],
        error: state.auth.errors?.[id] || null,
    };
};

export default authSlice.reducer;