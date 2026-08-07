import {
    isPending,
    isRejected
} from "@reduxjs/toolkit";

export const handleAsyncState = (status, customHandler) => {

    return (state, action) => {
        if (!state.loadings) state.loadings = {};
        if (!state.errors) state.errors = {};
        if (!state.params) state.params = {};

        const name = action.type.split("/")[1];
        const key = action.meta?.arg?.key;
        const params = action.meta?.arg || {};

        if (key) {
            state.params[key] = params;
        }

        switch (status) {
            case "pending":
                state.loadings[name] = true;
                state.errors[name] = null;
                state.params[name] = params;

                if (key) {
                    state.loadings[key] = true;
                    state.errors[key] = null;
                    state.params[key] = params;
                }
                break;

            case "fulfilled":

                state.loadings[name] = false;
                state.errors[name] = null;

                if (key) {
                    state.loadings[key] = false;
                    state.errors[key] = null;
                }

                if (customHandler) {
                    customHandler(state, action);
                }
                break;

            case "rejected":
                state.loadings[name] = false;
                state.errors[name] =
                    action.payload ||
                    action.error.message ||
                    "Something went wrong";

                if (key) {
                    state.loadings[key] = false;
                    state.errors[key] =
                        action.payload ||
                        action.error.message ||
                        "Something went wrong";
                }
                break;
        }
    };
};