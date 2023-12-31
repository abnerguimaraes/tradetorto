'use client';

import { useEffect, useContext, useState } from 'react';
import { CredentialsContext } from '../../store/Credentials';
import classes from './style.module.css';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Space from '../../components/Space/Space';
import Dialog from '../../components/Dialog/Dialog';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgpCSZwW8ujKeHGmLF4ovBUqM95NG1ebg",
  authDomain: "tradetorto.firebaseapp.com",
  databaseURL: "https://tradetorto-default-rtdb.firebaseio.com",
  projectId: "tradetorto",
  storageBucket: "tradetorto.appspot.com",
  messagingSenderId: "901021173643",
  appId: "1:901021173643:web:3e364f9c60c2b41bc7d18e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function Login() {
  const [user, setUser] = useState('guimaraesabner@gmail.com');
  const [pass, setPass] = useState('Teste123@');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [modalTitulo, setModalTitulo] = useState('');

  const { isLogged, login, initApp } = useContext(CredentialsContext);
  
  useEffect(()=> {
    initApp({ 
      app: app,
      database: database
    });
    
  }, [isLogged]);

  function mailHandler(event) {
    setUser(event.target.value);
  }

  function passHandler(event) {
    setPass(event.target.value);
  }

  function handleCloseDialog() {
    setPass('');
    setModalOpen(false);
  }

  async function handleLogin() {
    const auth = getAuth();

    try {
      const firebaseCredential = await signInWithEmailAndPassword(auth, user, pass);

      login({
        isLogged: true,
        userId: firebaseCredential.user.uid,
        userEmail: user,
      });
      
    } catch (err) {
      console.error(err);

      setModalTitulo('Problemas na autenticação');
      setModalMsg('Ocorreu um erro ao tentar entrar no sistema.');
      setModalOpen(true);

    }
    
  }

  return (
    <main className={classes.login__container}>
      {modalOpen && <Dialog open={modalOpen} onClose={handleCloseDialog} message={modalMsg} title={modalTitulo}/>}
      <section className={classes.welcome}>
        <h1>welcome!</h1>
        <p>
          por favor, entre com suas credenciais ao lado e divirta-se!
        </p>
      </section>

      <section className={classes.login_area}>
        <h1>login para trader</h1>
        <Space/>
        <div
          className={classes.fieldContainer}
        >
          <Input
            value={user}
            onChange={mailHandler}
            width="400px"
            placeholder='e-mail'
          />
          <Space />
          <Input
            type="password"
            value={pass}
            onChange={passHandler}
            width="400px"
            placeholder='senha'
          />
          <Space />
          <Button width="180px" onClick={handleLogin} label="Login" />
        </div>
      </section>
    </main>
  )
}
