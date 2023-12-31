import React, { useEffect, useContext } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from '../pages/Login/Login';

import RootLayout from '../pages/Layout/Layout';
import Trades from '../pages/Trades/Trades';
import Backtest from '../pages/Backtest/Backtest';
import { AppContext } from '../store/AppContext';

function SessionController() {
  const { isLogged } = useContext(AppContext);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      // errorElement: <ErrorPage />,
      children: [
        { index: true, path: '/trades', element: <Trades /> },
        { path: '/backtest', element: <Backtest />},
      ]
    },
  ]);

  return (
    <>
      { !isLogged && <Login/> }
      { isLogged && <RouterProvider router={router} />}
    </>
  )

}

export default SessionController;