import { configureStore } from "@reduxjs/toolkit";
import emailSlice from "./emailSlice.js";
import { api } from "./api.js";

let appStore = configureStore({
    reducer : {
        [api.reducerPath]: api.reducer,
        email : emailSlice, // for email in verification page
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export default appStore;