import React from 'react';
import './App.css';
import { createStateContext } from 'react-use';
import Checkout from './Pages/Checkout/Checkout';


const [useContext, ContextProvider] = createStateContext({
  language: 'zhTW',
  formResult: {}
});
global.useContext = useContext;
global.defaultLang = 'zhTW';

function App() {
  return (
    <ContextProvider>
      <Checkout />
    </ContextProvider>
  );
}

export default App;
