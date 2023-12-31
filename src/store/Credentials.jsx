'use client';

import { createContext, useState } from 'react';

const CredentialsContext = createContext({
  app: null,
  database: null,
  userId: null,
  userEmail: null,
  isLogged: false,
  database: null,
  alphaKey: 'P8B3A8FGRZ7ZNA6Y',
  brapiKey: '3L3zG1cU1C5QSsgdwnK4TN',
  login: () => { console.log('Errado..') },
  initApp: () => { console.log('Errado..') },
});

export { CredentialsContext };

function CredentialsProvider({ children }) {

  const [userCredentials, setUserCredentials] = useState({
    app: null,
    database: null,
    userId: null,
    userEmail: null,
    isLogged: false,
    database: null,
    alphaKey: 'P8B3A8FGRZ7ZNA6Y',
    brapiKey: '3L3zG1cU1C5QSsgdwnK4TN',
  });

  function login(credentialsObj) {
    setUserCredentials((old) => {
      return {
        ...old,
        ...credentialsObj
      }
    });
  }

  function initApp (credentialsObj) {
    setUserCredentials((old) => {
      return {
        ...old,
        ...credentialsObj
      }
    });
  }

  const contextValue = {
    login,
    initApp,
    ...userCredentials,
  }

  return (
    <CredentialsContext.Provider value={contextValue}>
      { children }
    </CredentialsContext.Provider>
  );
}

export default CredentialsProvider