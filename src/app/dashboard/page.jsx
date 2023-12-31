'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CredentialsContext } from '../../store/Credentials';

function Dashboard() {
  const { isLogged } = useContext(CredentialsContext);
  const router = useRouter();

  useEffect(()=> {
    isLogged ? router.push('/dashboard/historic') : router.push('/');
  }, [isLogged]);

  return (
    <div></div>
  )
}

export default Dashboard;