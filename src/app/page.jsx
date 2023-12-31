'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { CredentialsContext } from '../store/Credentials';
import Login from './login/page';

export default function Home() {
  const { isLogged } = useContext(CredentialsContext);
  const router = useRouter();

  useEffect(()=> {
    isLogged ? router.push('/dashboard') : router.push('/');
  }, [isLogged]);

  return (
    <Login />
  )
  
}
