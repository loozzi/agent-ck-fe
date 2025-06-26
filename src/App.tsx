import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import './App.css';
import { persistor, store } from "./app/store";
import AppNavigator from './navigators/AppNavigator';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  )
}

export default App
