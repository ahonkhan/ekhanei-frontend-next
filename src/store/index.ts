import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import locationReducer from './slices/locationSlice';
import authReducer from './slices/authSlice';
import { apiService } from './services/apiService';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    location: locationReducer,
    auth: authReducer,
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
