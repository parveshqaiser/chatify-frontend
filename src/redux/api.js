
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
    useDeleteMessageMutation,
    useEditMessageMutation,
    useClearConversationMutation
} = api;