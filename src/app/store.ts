import authReducer from '@/slices/auth.slice'
import chatReducer from '@/slices/chat.slice'
import logicRuleReducer from '@/slices/logicRule.slice'
import mbtiReducer from '@/slices/mbti.slice'
import newsReducer from '@/slices/news.slice'
import portfolioReducer from '@/slices/portfolio.slice'
import promptReducer from '@/slices/prompt.slice'
import stockReducer from '@/slices/stock.slice'
import subscriptionReducer from '@/slices/subscription.slice'
import surveyReducer from '@/slices/survey.slice'
import zaloReducer from '@/slices/zalo.slice'
import watchlistReducer from '@/slices/watchlist.slice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
  auth: authReducer,
  mbti: mbtiReducer,
  portfolio: portfolioReducer,
  survey: surveyReducer,
  subscription: subscriptionReducer,
  chat: chatReducer,
  stock: stockReducer,
  news: newsReducer,
  prompt: promptReducer,
  logicRule: logicRuleReducer,
  zalo: zaloReducer,
  watchlist: watchlistReducer
})

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['portfolio', 'survey', 'subscription', 'stock', 'news', 'prompt', 'logicRule', 'zalo'],
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
