import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";

let emailSlice = createSlice({
    name:"email",
    initialState : {
        email : null
    },
    reducers : {
        addTemporaryEmail : (state, action)=>{
            state.email = action.payload
        }
    },
});


export let {addTemporaryEmail} = emailSlice.actions;
export default emailSlice.reducer;