import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
} from "firebase/firestore";
import { auth, db } from "../../assets/components/firebase";
import { serverTimestamp } from "firebase/firestore";

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName || "",
                role: "user",
                createdAt: serverTimestamp()
            };

            await setDoc(doc(db, "Users", uid), userData);

            return {
                uid: uid,
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: "user"
            };
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
                    createdAt: userData.createdAt
                        ? userData.createdAt.toMillis()
                        : null,
                };
            }

            return {
                uid: uid,
                email: userCredential.user.email,
            };
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
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
                                createdAt: userData.createdAt
                                    ? userData.createdAt.toMillis()
                                    : null,
                            });
                        } else {
                            resolve({
                                uid: user.uid,
                                email: user.email,
                            });
                        }
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    reject(rejectWithValue(error.message));
                } finally {
                    unsubscribe();
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

            console.log("Users Count:", snapshot.size);

            return snapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt
                        ? data.createdAt.toMillis()
                        : null,
                };
            });
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    authLoading: false,
    checkingAuth: true,
    usersLoading: false,

    user: null,
    users: [],
    todos: [],

    isAuthenticated: false,
    error: null,

    email: "",
    password: "",
    fname: "",
    lname: "",
};

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        updateField: (state, action) => {
            console.log(action.payload);

            state[action.payload.name] = action.payload.value;
        },
        cleanForm: (state) => {
            state.email = "";
            state.password = "";
            state.fname = "";
            state.lname = "";
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.authLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.authLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            });

        builder
            .addCase(loginUser.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.authLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.authLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            });

        builder
            .addCase(logoutUser.pending, (state) => {
                state.authLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.authLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(checkAuth.pending, (state) => {
                state.checkingAuth = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.checkingAuth = false;

                if (action.payload) {
                    state.user = action.payload;
                    state.isAuthenticated = true;
                } else {
                    state.user = null;
                    state.isAuthenticated = false;
                }
            })
            .addCase(checkAuth.rejected, (state) => {
                state.checkingAuth = false;
            })
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.usersLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.usersLoading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.usersLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, updateField, cleanForm } = authSlice.actions;
export default authSlice.reducer;
