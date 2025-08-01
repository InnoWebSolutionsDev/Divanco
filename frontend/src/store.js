import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from './features/auth/authApi';
import { usersApi } from './features/users/usersApi';
import authReducer from './features/auth/authSlice';
import uiReducer from './features/ui/uiSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Solo persiste auth, no ui
};

// Combinar reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
});

// Reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(usersApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export default store;
