import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './counterSlice';
import { pokemonApi } from './pokemonAPI';

const store = configureStore({
  reducer: {
    counter: counterSlice,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export default store;
