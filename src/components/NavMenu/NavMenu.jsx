'use client';

import classes from './navmenu.module.css';

import { useState } from 'react';
import Link from 'next/link';

function NavMenu({user}) {
  const [idActive, setIdActive] = useState(1);

  function handleActiveRoute(id) {
    setIdActive(id);
  }

  return (
    <section className={classes.navMenu}>
      <div className={classes.links}>
        <Link
          href="/dashboard/historic"
          onClick={() => {handleActiveRoute(1)}}
          className={`${classes.navItem} ${idActive == 1 ? classes.routeActive : undefined}`}
        >
          MyTrades
        </Link>
        <Link
          href="/dashboard/backtest"
          onClick={() => {handleActiveRoute(2)}}
          className={`${classes.navItem} ${idActive == 2 ? classes.routeActive : undefined}`}
        >
          BackTest
        </Link>
      </div>
      <div className={classes.name}>{ user }</div>
    </section>
  )
}

export default NavMenu;