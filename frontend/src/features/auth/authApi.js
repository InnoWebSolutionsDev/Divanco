import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loginSuccess, loginFailure, logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Decodificar el token para obtener info del usuario
          const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
          const user = {
            id: tokenPayload.id,
            role: tokenPayload.role,
            username: arg.username, // Del formulario
          };
          dispatch(loginSuccess({ token: data.token, user }));
        } catch (error) {
          dispatch(loginFailure());
        }
      },
    }),

    // Register
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Recover Password
    recoverPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/recover-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Logout (client-side only)
    logoutUser: builder.mutation({
      queryFn: () => ({ data: {} }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(logout());
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRecoverPasswordMutation,
  useResetPasswordMutation,
  useLogoutUserMutation,
} = authApi;
