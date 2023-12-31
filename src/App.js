import React from 'react';

import AppContextProvider from './store/AppContext';
import SessionController from './components/SessionController';
import './index.scss';
// import { g90 } from '@carbon/themes';

function App() {
  return (
    <AppContextProvider>
      <SessionController/>
    </AppContextProvider>
  );
}

export default App;
