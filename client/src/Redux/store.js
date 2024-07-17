import { configureStore,combineReducers } from '@reduxjs/toolkit'
import userReducer from './User-Slice/userSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { persistStore } from 'redux-persist';
import addressReducer from './User-Slice/addressSlice';
import cartReducer from './Cart-slice/cartSlice'

const rootReducer = combineReducers({
  user: userReducer,
  address : addressReducer,
  cart : cartReducer
})

const persistConfig = {
  key: 'root',
  storage,
  version:1
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
