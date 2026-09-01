import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { BASE_URL } from "../utils/constants.js";
import toast from "react-hot-toast";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
});

const mutex = new Mutex();

const handleUnauthorized = async (api, errorMessage = "Session expired. Please login again.") => {
   
    try {
        await baseQuery(
            {
                url: '/auth/emergency-logout',
                method: 'GET',
            },
            api,
            {}
        );
        console.log('Emergency logout successful');
        toast.error(errorMessage);
    } catch (error) {
        console.log('Emergency logout failed, clearing local session anyway');
    }

    // Clear all local storage
    localStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
        document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Reset RTK Query cache if available
    // if (api && api.dispatch) {
    //     try {
    //         api.dispatch(api.util.resetApiState());
    //     } catch (error) {
    //         console.log('Error resetting API state:', error);
    //     }
    // }
    
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
        // Check if we're not already on the login page to avoid redirect loops
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/signup')) {
            window.location.href = '/login';
        }
    }
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
    try {
        // Wait for mutex to be available
        await mutex.waitForUnlock();
        
        let result = await baseQuery(args, api, extraOptions);

        // Check if we got a 401 Unauthorized response
        if (result.error && result.error.status === 401) {
            // Check if we're not already refreshing
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();

                try {
                    // Try to refresh the token
                    const refreshResult = await baseQuery(
                        {
                            url: '/auth/refresh',
                            method: 'POST',
                        },
                        api,
                        extraOptions
                    );

                    if (refreshResult.data) {
                        // Successfully refreshed - retry the original request
                        result = await baseQuery(args, api, extraOptions);
                    } else {
                        // Refresh failed - session expired, call emergency logout
                        await handleUnauthorized(api, "Your session has expired. Please login again.");
                    }
                } catch (error) {
                    // Error during refresh - call emergency logout
                    await handleUnauthorized(api, "Authentication failed. Please login again.");
                } finally {
                    release();
                }
            } else {
                // Mutex is locked - wait for it to unlock and then retry
                await mutex.waitForUnlock();
                result = await baseQuery(args, api, extraOptions);
            }
        }

        return result;
    } catch (error) {
        // Network errors or other unexpected errors
        console.error('API request failed:', error);
        
        // If it's a network error and we're on a protected page, redirect to login
        if (error?.status === 401) {
            await handleUnauthorized(api, "Authentication failed. Please login again.");
        }
        
        return {
            error: {
                status: error?.status || 'FETCH_ERROR',
                message: error?.message || 'Network error occurred'
            }
        };
    }
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Messages', 'Conversation'],
    endpoints: (builder) => ({

        getUserDetails: builder.query({
            query: () => '/v1/auth/current-user',
            providesTags: ['User'],
        }),

        getAllUsers: builder.query({
            query: () => "/v1/auth/allusers",
            providesTags: ['User'],
        }),

        logout: builder.mutation({
            query: () => ({
                method: "GET",
                url: "/v1/auth/logout"
            }),
        }),

        updateProfile: builder.mutation({
            query: ({ name, bio }) => ({
                method: "PATCH",
                url: "/v1/auth/update-profile",
                body: { name, bio }
            }),
            invalidatesTags: ['User'],
        }),

        updatePassword: builder.mutation({
            query: (data) => ({
                method: "POST",
                url: "/v1/auth/change-password",
                body: data
            }),
        }),

        getAllMessages : builder.query({
            query: (targetUserId) => `/v1/chat/${targetUserId}`,
        }),

        deleteMessage: builder.mutation({
            query: ({ targetUserId, messageId }) => ({
                method: "DELETE",
                url: `/v2/chat/${targetUserId}/message/${messageId}`,
            }),
            invalidatesTags: (result, error, { targetUserId }) => 
                [{ type: 'Messages', id: targetUserId }],
        }),

        // not using, socket is managing
        editMessage: builder.mutation({
            query: ({ targetUserId, messageId, text }) => ({
                method: "PATCH",
                url: `/v2/chat/${targetUserId}/message/${messageId}`,
                body: { text }
            }),
            invalidatesTags: (result, error, { targetUserId }) => 
                [{ type: 'Messages', id: targetUserId }],
        }),

        clearConversation: builder.mutation({
            query: (targetUserId) => ({
                method: "DELETE",
                url: `/chat/${targetUserId}`,
            }),
            invalidatesTags: (result, error, targetUserId) => 
                [{ type: 'Messages', id: targetUserId }, { type: 'Conversation' }],
        }),

        // v2 chat messages

        uploadPresignedUrl : builder.mutation({
            query : (data)=>({
                method : "POST",
                url : `/v2/chat/upload/file`,
                body : data
            })
        }),
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
    useClearConversationMutation,
    useUploadPresignedUrlMutation,
} = api;