import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";


export const fetchUserDetails = createAsyncThunk("get/user",
    async(_,{rejectWithValue})=>{
        try {
            let res = await axios.get(BASE_URL + "/auth/current-user",{withCredentials: true});
            return res?.data?.data;
        } catch (error) {
            return rejectWithValue({
                message : error.response?.data?.message || "Get User Data Failed",
                error : error?.response?.status
            });
        }
    }
)

let userSlice = createSlice({
    name:"user",
    initialState : {
        user : null,
        isLoading : false,
        error : null
    },
    reducers : {
        logout : (state, action)=>{
            state.user = null;
            state.isLoading = false;
            state.error = null;
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(fetchUserDetails.pending, (state,action)=>{
            state.isLoading = true,
            state.error = null;
        });

        builder.addCase(fetchUserDetails.fulfilled, (state,action)=>{
            state.isLoading = false,
            state.user = action.payload,
            state.error = null;
        });

        builder.addCase(fetchUserDetails.rejected, (state,action)=>{
            state.isLoading = false,
            state.error = action.payload;
        });
    }
});


export let {logout} = userSlice.actions;
export default userSlice.reducer;