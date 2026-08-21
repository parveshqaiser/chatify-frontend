
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constants.js';
import useLogout from '../hooks/useLogout.js';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
});

let baseQueryWithReauth =  async (args, api, extraOptions) =>{
    
    // First: make the original request
    let result = await baseQuery(args, api, extraOptions);

    console.log("result ", result);


    // check if access token expired
    if (result.error?.status === 401) {

        // ask backend for a new accesstokken 
        const refreshResult = await baseQuery(
            {
                url: "/auth/generate/access-token",
                method: "GET",
            },
            api,
            extraOptions
        );

        // Refresh successful
        if (refreshResult.data) {

            // Retry the original request
            result = await baseQuery(args, api, extraOptions);

        } else {
            // Refresh failed
            console.log("Refresh token expired. Login again.");
            useLogout();
            // Here you can logout / clear user state
        }
    }

    return result;

}

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
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

        updateProfile : builder.mutation({
            query : ({name,bio})=>({
                method : "PATCH",
                url : "/auth/update-profile",
                body : {name, bio}
            })
        }),

        updatePassword : builder.mutation({
            query : (data)=>({
                method : "POST",
                url : "/auth/change-password",
                body : data
            })
        }),

        // messages

        getAllMessages : builder.query({
            query: (targetUserId) => `/chat/${targetUserId}`,
        }),


        deleteMessage : builder.mutation({
            query : ({targetUserId, messageId})=> ({
                method : "DELETE",
                url : `/chat/${targetUserId}/message/${messageId}`,
            })
        }),

        // using socket
        editMessage : builder.mutation({
            query : ({targetUserId, messageId, text})=> ({
                method : "PATCH",
                url : `/chat/${targetUserId}/message/${messageId}`,
                body : text
            })
        }),

        clearConversation : builder.mutation({
            query : (targetUserId)=> ({
                method : "DELETE",
                url : `/chat/${targetUserId}`,
            })
        })

    })
});


export const {
    useGetUserDetailsQuery,
    useGetAllUsersQuery,
    useLogoutMutation, 
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
    useGetAllMessagesQuery,
    useLazyGetAllMessagesQuery,
    useDeleteMessageMutation,
    useEditMessageMutation,
    useClearConversationMutation
} = api;



/*

                RTK Query
                     │
                     ↓
             baseQueryWithReauth
                     │
              ┌──────┴──────┐
              ↓             ↓
         normal API       401
                            │
                            ↓
                       /auth/refresh
                            │
                   ┌────────┴────────┐
                   ↓                 ↓
                success            failure
                   │                 │
                   ↓                 ↓
             retry request       logout
                   │
                   ↓
                  API
*/