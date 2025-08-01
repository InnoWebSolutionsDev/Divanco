import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query con autenticación automática
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Base query con manejo de errores y re-autenticación
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token expirado, limpiar estado de auth
    api.dispatch({ type: 'auth/logout' });
  }
  
  return result;
};

// API base para todas las queries
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: () => ({}),
});
