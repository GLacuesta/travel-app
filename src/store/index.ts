import { configureStore } from '@reduxjs/toolkit';
import cityReducer from '../features/city/citySlice';

export const store = configureStore({
  reducer: {
    city: cityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
