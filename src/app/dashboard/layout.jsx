'use client';
import NavMenu from '../../components/NavMenu/NavMenu';
import { CredentialsContext } from '../../store/Credentials';

import { useEffect, useContext, useState } from 'react';
import { ref, onValue } from "firebase/database";

export default function DashboardLayout({ children }) {
  const { userId, database } = useContext(CredentialsContext);
  const [user, setUser] = useState('');

  const userDocument = ref(database, userId);

  useEffect(() => {
    onValue(userDocument, (snapShot) => {
      let firebaseUser = snapShot.val();
      setUser(firebaseUser.userData.firstName + ' ' + firebaseUser.userData.lastName);
    });
  }, [userId]);
  
  return (
    <div>
      <NavMenu user={user}> </NavMenu>
      { children }
    </div>  
  );
}