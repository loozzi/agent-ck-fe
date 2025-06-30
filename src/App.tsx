import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import './App.css'
import { persistor, store } from './app/store'
import AppNavigator from './navigators/AppNavigator'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </PersistGate>
    </Provider>
  )
}

export default App
