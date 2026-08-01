
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constants.js';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
});

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    endpoints : (builder) => ({
        getUserDetails: builder.query({
            query: () => '/auth/current-user',
        }),

        getAllUsers: builder.query({
            query: () => "/auth/allusers",
        }),

        logout : builder.mutation({
            query : ()=>({
                method : "GET",
                url : "/auth/logout"
            })
        }),
    })
});


export const {useGetUserDetailsQuery,useGetAllUsersQuery, useLogoutMutation} = api;

