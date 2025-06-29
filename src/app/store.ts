import authReducer from '@/slices/auth.slice'
import mbtiReducer from '@/slices/mbti.slice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
  auth: authReducer,
  mbti: mbtiReducer
})

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: [], // reducers that you don't want to persist
  whiteList: ['auth'] // reducers that you want to persist
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)
