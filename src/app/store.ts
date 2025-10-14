import authReducer from '@/slices/auth.slice'
import chatReducer from '@/slices/chat.slice'
import logicRuleReducer from '@/slices/logicRule.slice'
import mbtiReducer from '@/slices/mbti.slice'
import newsReducer from '@/slices/news.slice'
import newsPromptReducer from '@/slices/newsPrompt.slice'
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
import portfolioNewsReducer from '@/slices/portfolioNews.slice'
import adminReducer from '@/slices/admin.slice'
import strategyReducer from '@/slices/strategy.slice'
import recommendationReducer from '@/slices/recommendation.slice'
import lessonReducer from '@/slices/lesson.slice'
import adminSurveyReducer from '@/slices/adminSurvey.slice'
import emailReducer from '@/slices/email.slice'
import analysisReducer from '@/slices/analysis.slice'
import newsFormatReducer from '@/slices/newsFormat.slice'

const rootReducer = combineReducers({
  auth: authReducer,
  mbti: mbtiReducer,
  portfolio: portfolioReducer,
  survey: surveyReducer,
  subscription: subscriptionReducer,
  chat: chatReducer,
  stock: stockReducer,
  news: newsReducer,
  newsPrompt: newsPromptReducer,
  newsFormat: newsFormatReducer,
  prompt: promptReducer,
  logicRule: logicRuleReducer,
  zalo: zaloReducer,
  watchlist: watchlistReducer,
  portfolioNews: portfolioNewsReducer,
  admin: adminReducer,
  strategy: strategyReducer,
  recommendation: recommendationReducer,
  lesson: lessonReducer,
  adminSurvey: adminSurveyReducer,
  email: emailReducer,
  analysis: analysisReducer
})

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: [
    'portfolio',
    'survey',
    'mbti',
    'chat',
    'subscription',
    'stock',
    'news',
    'newsPrompt',
    'prompt',
    'logicRule',
    'zalo',
    'watchlist',
    'portfolioNews',
    'admin',
    'strategy',
    'recommendationReducer',
    'lesson',
    'adminSurvey',
    'recommendation',
    'email',
    'analysis'
  ], // reducers that you do not want to persist
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
