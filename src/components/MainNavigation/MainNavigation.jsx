import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import classes from './style.module.scss'
import { AppContext } from '../../store/AppContext';

function MainNavigation() {
  const navigate = useNavigate();
  const [activeBar, setActiveBar] = useState(1);
  const { initApp } = useContext(AppContext);

  useEffect(() => {
    navigate('/trades');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleActiveBar(bar) {
    setActiveBar(bar)
  }

  function hanldeLogout() {
    initApp({
      app: null,
      database: null,
      userId: null,
      userEmail: null,
      isLogged: false
    })
  }

  return (
    <section className={classes.navBarContainer}>
      <nav className={classes.navBar}>
        <div className={classes.navLogo}>
          Trade Torto [Platform]
        </div>
        <div className={classes.linksLogout}>
          <div className={classes.linksArea}>
            <NavLink
              className={`${classes.navItem} ${activeBar === 1 ? classes.navActive : null}`}
              end
              to={'/trades'}
              onClick={() => {handleActiveBar(1)}}
            >
              Trades
            </NavLink>
            <NavLink
              className={`${classes.navItem} ${activeBar === 2 ? classes.navActive : null}`}
              end
              to={'/backtest'}
              onClick={() => {handleActiveBar(2)}}
            >
              BackTest
            </NavLink>
          </div>
          <div className={classes.logoutItem}>
            <span onClick={hanldeLogout}> logout </span>
          </div>
        </div>
      </nav>
    </section>
  );
}

export default MainNavigation;