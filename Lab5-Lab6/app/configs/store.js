import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImagePickerResponse } from 'react-native-image-picker';
import rootReducer from './rootReducer'

// Configure persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['images']
};

// Create persisted reducer
const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export default store; 