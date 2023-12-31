'use client';

import React, { createContext, useState } from 'react';

const AppContext = createContext({
  app: null,
  database: null,
  userId: null,
  userEmail: null,
  isLogged: false,
  alphaKey: 'P8B3A8FGRZ7ZNA6Y',
  brapiKey: '3L3zG1cU1C5QSsgdwnK4TN',
  initApp: (appObj) => { console.log('Errado..') },
});

export { AppContext };

function AppContextProvider({ children }) {

  const [userAppData, setUserAppData] = useState({
    app: null,
    database: null,
    userId: null,
    userEmail: null,
    isLogged: false,
    alphaKey: 'P8B3A8FGRZ7ZNA6Y',
    brapiKey: '3L3zG1cU1C5QSsgdwnK4TN',
  });

  function initApp (appObj) {
    setUserAppData((old) => {
      return {
        ...old,
        ...appObj
      }
    });
  }

  const contextValue = {
    initApp,
    ...userAppData,
  }

  return (
    <AppContext.Provider value={contextValue}>
      { children }
    </AppContext.Provider>
  );
}

export default AppContextProvider