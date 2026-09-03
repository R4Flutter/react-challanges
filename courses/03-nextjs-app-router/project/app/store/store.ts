'use client';

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './apiSlice';
import counterReducer from './counterSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      counter: counterReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
  });

setupListeners(makeStore().dispatch);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
