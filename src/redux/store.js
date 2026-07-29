import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";

let appStore = configureStore({
    reducer : {
        user : userSlice
    }
});

export default appStore;